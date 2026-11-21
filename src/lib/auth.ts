import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'aura_arena_admin_session';
const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.SESSION_SECRET || 'aura-arena-default-secret-fallback-key-2026';
}

/**
 * Creates an HMAC signed session token containing timestamp and signature
 */
export function createSessionToken(): string {
  const payload = JSON.stringify({
    role: 'admin',
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY_MS,
  });

  const encoded = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(encoded)
    .digest('base64url');

  return `${encoded}.${signature}`;
}

/**
 * Verifies if the session token is valid and unexpired
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encoded, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getSecret())
    .update(encoded)
    .digest('base64url');

  if (signature !== expectedSig) return false;

  try {
    const jsonStr = Buffer.from(encoded, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);
    if (data.role !== 'admin') return false;
    if (typeof data.expiresAt === 'number' && Date.now() > data.expiresAt) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks cookie in Server Actions or Route Handlers
 */
export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
