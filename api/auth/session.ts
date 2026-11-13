import { readAdminSession, verifyAdminSessionToken } from '../../lib/adminAuth.js';
import type { AdminApiRequest } from '../../lib/adminAuth.js';
import { sendJson } from '../../lib/adminAuth.js';
import type { ServerResponse } from 'node:http';

export default function handler(req: AdminApiRequest, res: ServerResponse): void {
  if (req.method !== 'GET') {
    sendJson(res, 405, { authenticated: false, message: 'Method not allowed.' }, { Allow: 'GET' });
    return;
  }

  const authenticated = verifyAdminSessionToken(
    readAdminSession(req.headers.cookie),
    process.env.ADMIN_PASSWORD,
  );
  sendJson(res, 200, { authenticated }, { 'Cache-Control': 'no-store' });
}
