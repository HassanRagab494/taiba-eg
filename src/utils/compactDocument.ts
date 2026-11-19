/** Optimize legacy embedded photos without dropping fields, translations or edits. */
export async function compactDocument(body: string, optimize: (image: string) => Promise<string>): Promise<string> {
  const cache = new Map<string, string>();
  async function visit(value: unknown): Promise<unknown> {
    if (typeof value === 'string' && value.length > 150000 && /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value)) {
      if (cache.has(value)) return cache.get(value)!;
      const next = await optimize(value);
      const result = next.length < value.length ? next : value;
      cache.set(value, result);
      return result;
    }
    if (Array.isArray(value)) {
      const next = [];
      for (const item of value) next.push(await visit(item));
      return next;
    }
    if (value !== null && typeof value === 'object') {
      const entries: [string, unknown][] = [];
      for (const [key, item] of Object.entries(value)) entries.push([key, await visit(item)]);
      return Object.fromEntries(entries);
    }
    return value;
  }
  return JSON.stringify(await visit(JSON.parse(body)));
}
