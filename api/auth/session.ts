import { readAdminSession, verifyAdminSessionToken } from '../../lib/adminAuth';

export function GET(request: Request): Response {
  const authenticated = verifyAdminSessionToken(
    readAdminSession(request.headers.get('cookie')),
    process.env.ADMIN_PASSWORD,
  );
  return Response.json({ authenticated }, { headers: { 'Cache-Control': 'no-store' } });
}
