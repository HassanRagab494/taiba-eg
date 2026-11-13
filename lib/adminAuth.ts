import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

export const ADMIN_SESSION_COOKIE = 'taiba_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

export type AdminApiRequest = IncomingMessage & { body?: unknown };

export function sendJson(res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}): void {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
}

export async function readJsonBody(req: AdminApiRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') return JSON.parse(req.body) as Record<string, unknown>;

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) as Record<string, unknown> : {};
}

export function isSecureRequest(req: IncomingMessage): boolean {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  return protocol?.split(',')[0].trim() === 'https';
}

export function verifyAdminPassword(candidate: unknown, configuredPassword: string | undefined): boolean {
  if (typeof candidate !== 'string' || !candidate || !configuredPassword) return false;

  const candidateHash = createHash('sha256').update(candidate).digest();
  const configuredHash = createHash('sha256').update(configuredPassword).digest();
  return timingSafeEqual(candidateHash, configuredHash);
}

export function createAdminSessionToken(secret: string, now = Date.now()): string {
  const expiresAt = Math.floor(now / 1000) + ADMIN_SESSION_MAX_AGE;
  const signature = createHmac('sha256', secret).update(String(expiresAt)).digest('base64url');
  return `${expiresAt}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined, secret: string | undefined, now = Date.now()): boolean {
  if (!token || !secret) return false;

  const [expiresAt, signature, extra] = token.split('.');
  if (!expiresAt || !signature || extra !== undefined) return false;

  const expiration = Number(expiresAt);
  if (!Number.isSafeInteger(expiration) || expiration <= Math.floor(now / 1000)) return false;

  const expected = createHmac('sha256', secret).update(expiresAt).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function readAdminSession(cookieHeader: string | string[] | null | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  const header = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader;
  const prefix = `${ADMIN_SESSION_COOKIE}=`;
  const cookie = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return cookie?.slice(prefix.length);
}

export function createAdminSessionCookie(token: string, secure: boolean): string {
  return `${ADMIN_SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${ADMIN_SESSION_MAX_AGE}${secure ? '; Secure' : ''}`;
}

export function clearAdminSessionCookie(secure: boolean): string {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`;
}
