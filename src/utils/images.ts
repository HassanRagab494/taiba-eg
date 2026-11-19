/** Resize uploads before storing them in the shared site document. */
export async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') throw new Error('اختر صورة JPG أو PNG أو WebP');
  const bitmap = await createImageBitmap(file);
  try {
    const ratio = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('تعذر معالجة الصورة');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.8);
  } finally { bitmap.close(); }
}

const localImages = import.meta.glob('../assets/images/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
export function imageUrl(src?: string, width = 800): string | undefined {
  if (!src) return src;
  if (src.startsWith('/src/assets/images/')) return localImages['../assets/images/' + src.split('/').pop()] ?? src;
  try {
    const url = new URL(src);
    if (url.hostname === 'images.unsplash.com') {
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', '72');
      url.searchParams.set('auto', 'format');
      return url.toString();
    }
  } catch { /* Relative URLs and embedded uploads are already usable. */ }
  return src;
}
