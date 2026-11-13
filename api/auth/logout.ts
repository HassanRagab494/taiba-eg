import { clearAdminSessionCookie } from '../../lib/adminAuth';

export function POST(request: Request): Response {
  const secure = new URL(request.url).protocol === 'https:';
  return Response.json(
    { success: true },
    { headers: { 'Set-Cookie': clearAdminSessionCookie(secure), 'Cache-Control': 'no-store' } },
  );
}
