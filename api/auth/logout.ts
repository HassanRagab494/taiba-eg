import { clearAdminSessionCookie } from '../../lib/adminAuth';
import { isSecureRequest, sendJson } from '../../lib/adminAuth';
import type { AdminApiRequest } from '../../lib/adminAuth';
import type { ServerResponse } from 'node:http';

export default function handler(req: AdminApiRequest, res: ServerResponse): void {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' }, { Allow: 'POST' });
    return;
  }

  sendJson(res, 200, { success: true }, {
    'Set-Cookie': clearAdminSessionCookie(isSecureRequest(req)),
    'Cache-Control': 'no-store',
  });
}
