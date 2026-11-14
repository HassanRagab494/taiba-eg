import { get, put } from '@vercel/blob';
import type { AdminApiRequest } from '../lib/adminAuth.js';
import { readAdminSession, readJsonBody, sendJson, verifyAdminSessionToken } from '../lib/adminAuth.js';
import type { ServerResponse } from 'node:http';

const STATE_PATH = 'taiba/site-state.json';

export default async function handler(req: AdminApiRequest, res: ServerResponse): Promise<void> {
  if (req.method === 'GET') {
    try {
      const blob = await get(STATE_PATH, { access: 'private' });
      if (!blob) {
        sendJson(res, 200, { hasSavedData: false }, { 'Cache-Control': 'no-store' });
        return;
      }
      const text = await new Response(blob.stream).text();
      sendJson(res, 200, { ...JSON.parse(text), hasSavedData: true }, { 'Cache-Control': 'no-store' });
    } catch (error) {
      console.error('Shared data read failed:', error);
      sendJson(res, 503, { error: 'Shared site storage is unavailable.' }, { 'Cache-Control': 'no-store' });
    }
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed.' }, { Allow: 'GET, POST' });
    return;
  }

  if (!verifyAdminSessionToken(readAdminSession(req.headers.cookie), process.env.ADMIN_PASSWORD)) {
    sendJson(res, 401, { success: false, error: 'Authentication required.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const blob = await put(STATE_PATH, JSON.stringify(body), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
    sendJson(res, 200, { success: true, savedAt: new Date().toISOString() }, { 'Cache-Control': 'no-store' });
  } catch (error) {
    console.error('Shared data save failed:', error);
    sendJson(res, 500, { success: false, error: 'Could not save shared site data.' });
  }
}
