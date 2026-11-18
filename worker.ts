interface AssetBinding { fetch(request: Request): Promise<Response> }
interface DatabaseBinding { prepare(query: string): { first<T>(): Promise<T | null>; bind(value: string): { run(): Promise<unknown> } } }
interface Env {
  ASSETS: AssetBinding;
  DB: DatabaseBinding;
  ADMIN_PASSWORD: string;
}

const COOKIE = 'taiba_admin_session';

async function token(password: string): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 12;
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
  if (!expires || !signature || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = (await token(password)).split('.')[1];
  return signature === expected;
}

async function state(request: Request, env: Env): Promise<Response> {
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT value FROM site_state WHERE id = 1').first<{ value: string }>();
    return Response.json(row ? { ...JSON.parse(row.value), hasSavedData: true } : { hasSavedData: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  if (!(await validSession(request, env.ADMIN_PASSWORD))) return Response.json({ error: 'Authentication required.' }, { status: 401 });
  const value = await request.text();
  await env.DB.prepare('INSERT INTO site_state (id, value) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET value = excluded.value').bind(value).run();
  return Response.json({ success: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/state') return state(request, env);
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json() as { password?: string };
      if (!body.password || body.password !== env.ADMIN_PASSWORD) return Response.json({ success: false }, { status: 401 });
      const value = await token(env.ADMIN_PASSWORD);
      return Response.json({ success: true }, { headers: { 'Set-Cookie': `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200` } });
    }
    if (url.pathname === '/api/auth/session') return Response.json({ authenticated: await validSession(request, env.ADMIN_PASSWORD) }, { headers: { 'Cache-Control': 'no-store' } });
    if (url.pathname === '/api/auth/logout') return Response.json({ success: true }, { headers: { 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` } });
    return env.ASSETS.fetch(request);
  },
};

