import type { AdminApiRequest } from '../../lib/adminAuth.js';
import {
  createAdminSessionCookie,
  createAdminSessionToken,
  isSecureRequest,
  readJsonBody,
  sendJson,
  verifyAdminPassword,
} from '../../lib/adminAuth.js';

import type { ServerResponse } from 'node:http';

export default async function handler(req: AdminApiRequest, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' }, { Allow: 'POST' });
    return;
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    sendJson(res, 503, { success: false, message: 'Admin password is not configured.' });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { success: false, message: 'Invalid JSON body.' });
    return;
  }

  if (!verifyAdminPassword(body.password, password)) {
    sendJson(res, 401, { success: false });
    return;
  }

  const token = createAdminSessionToken(password);
  sendJson(res, 200, { success: true }, {
    'Set-Cookie': createAdminSessionCookie(token, isSecureRequest(req)),
    'Cache-Control': 'no-store',
  });
}
