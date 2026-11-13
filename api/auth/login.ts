import { createAdminSessionCookie, createAdminSessionToken, verifyAdminPassword } from '../../lib/adminAuth';

export async function POST(request: Request): Promise<Response> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return Response.json({ success: false, message: 'Admin password is not configured.' }, { status: 503 });
  }

  let body: { password?: unknown };
  try {
    body = await request.json() as { password?: unknown };
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }

  if (!verifyAdminPassword(body.password, password)) {
    return Response.json({ success: false }, { status: 401 });
  }

  const secure = new URL(request.url).protocol === 'https:';
  const token = createAdminSessionToken(password);
  return Response.json(
    { success: true },
    { headers: { 'Set-Cookie': createAdminSessionCookie(token, secure), 'Cache-Control': 'no-store' } },
  );
}
