interface AssetBinding { fetch(request: Request): Promise<Response> }
interface Statement {
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  bind(...values: (string | number)[]): Statement;
  run(): Promise<unknown>;
}
interface DatabaseBinding { prepare(query: string): Statement; batch(statements: Statement[]): Promise<unknown> }
interface Env {
  ASSETS: AssetBinding;
  DB: DatabaseBinding;
  ADMIN_PASSWORD: string;
}

const COOKIE = 'taiba_admin_session';
const configuredPassword = (env: Env) => (env.ADMIN_PASSWORD ?? '').trim();

async function token(password: string, expires = Math.floor(Date.now() / 1000) + 60 * 60 * 12): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(expires)));
  const bytes = new Uint8Array(signature);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `${expires}.${btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
}

async function validSession(request: Request, password: string): Promise<boolean> {
  const cookie = request.headers.get('Cookie')?.split(';').map(value => value.trim()).find(value => value.startsWith(`${COOKIE}=`));
  if (!cookie || !password) return false;
  const [expires, signature] = cookie.slice(COOKIE.length + 1).split('.');
  if (!expires || !signature || !Number.isSafeInteger(Number(expires)) || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = (await token(password, Number(expires))).split('.')[1];
  return signature === expected;
}

async function state(request: Request, env: Env): Promise<Response> {
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT value FROM site_state WHERE id = 1').first<{ value: string }>();
    let data = row ? JSON.parse(row.value) : null;
    if (data?.__storage === 'chunks-v1') {
      const chunks = await env.DB.prepare('SELECT value FROM site_state_chunks WHERE generation = ? ORDER BY part').bind(data.generation).all<{ value: string }>();
      if (chunks.results.length !== data.parts) return Response.json({ error: 'Saved data is incomplete.' }, { status: 503 });
      data = JSON.parse(chunks.results.map(chunk => chunk.value).join(''));
    }
    return Response.json(data ? { ...data, hasSavedData: true } : { hasSavedData: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  if (!(await validSession(request, configuredPassword(env)))) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 });
  }
  const value = await request.text();
  try { JSON.parse(value); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const upsert = (body: string) => env.DB.prepare('INSERT INTO site_state (id, value) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET value = excluded.value').bind(body);
  if (new TextEncoder().encode(value).length <= 1000000) {
    await upsert(value).run();
  } else {
    // Keep each D1 row below its size limit, including uploaded image data.
    const size = 400000;
    const parts = Math.ceil(value.length / size);
    if (parts > 45) return Response.json({ error: 'Please reduce the uploaded image sizes.' }, { status: 413 });
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS site_state_chunks (generation TEXT NOT NULL, part INTEGER NOT NULL, value TEXT NOT NULL, created INTEGER NOT NULL, PRIMARY KEY (generation, part))').run();
    const generation = crypto.randomUUID();
    const created = Date.now();
    const statements = Array.from({ length: parts }, (_, part) => env.DB.prepare('INSERT INTO site_state_chunks (generation, part, value, created) VALUES (?, ?, ?, ?)').bind(generation, part, value.slice(part * size, (part + 1) * size), created));
    statements.push(upsert(JSON.stringify({ __storage: 'chunks-v1', generation, parts })));
    // D1 batches commit atomically. Keep older revisions for in-flight readers.
    statements.push(env.DB.prepare('DELETE FROM site_state_chunks WHERE created < ?').bind(created - 86400000));
    await env.DB.batch(statements);
  }
  return Response.json({ success: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/state') return state(request, env);
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json() as { password?: string };
      if (!body.password || body.password.trim() !== configuredPassword(env)) return Response.json({ success: false }, { status: 401 });
      const value = await token(configuredPassword(env));
      return Response.json({ success: true }, { headers: { 'Set-Cookie': `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200` } });
    }
    if (url.pathname === '/api/auth/session') return Response.json({ authenticated: await validSession(request, configuredPassword(env)) }, { headers: { 'Cache-Control': 'no-store' } });
    if (url.pathname === '/api/auth/logout') return Response.json({ success: true }, { headers: { 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` } });
    return env.ASSETS.fetch(request);
  },
};
