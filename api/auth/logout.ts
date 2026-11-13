import { clearAdminSessionCookie } from '../../lib/adminAuth.js';
import { isSecureRequest, sendJson } from '../../lib/adminAuth.js';
import type { AdminApiRequest } from '../../lib/adminAuth.js';
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
