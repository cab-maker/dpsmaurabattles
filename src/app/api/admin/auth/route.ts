import { cookies } from 'next/headers';
import { createSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { validateMutationRequest, createSecureResponse } from '@/lib/security';

// Rate limiting in-memory map for basic brute-force protection
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  try {
    const originCheck = validateMutationRequest(request);
    if (!originCheck.valid) {
      return createSecureResponse(
        { error: originCheck.reason || 'Forbidden: DPSM SUCKS' },
        { status: 403 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();
    const rateLimit = loginAttempts.get(ip) || { count: 0, resetAt: now + 60000 };

    if (now > rateLimit.resetAt) {
      rateLimit.count = 0;
      rateLimit.resetAt = now + 60000;
    }

    if (rateLimit.count >= 5) {
      return createSecureResponse(
        { error: 'Too many attempts. Please try again in 1 minute.' },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'auraadmin2026!';

    if (!password || password !== expectedPassword) {
      rateLimit.count += 1;
      loginAttempts.set(ip, rateLimit);
      return createSecureResponse(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Reset rate limit on success
    loginAttempts.delete(ip);

    const token = createSessionToken();
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // allow local development and http testing; Vercel handles HTTPS termination
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return createSecureResponse({ success: true, message: 'Logged in successfully' });
  } catch {
    return createSecureResponse(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const isValid = verifySessionToken(token);

    return createSecureResponse({ authenticated: isValid });
  } catch {
    return createSecureResponse({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return createSecureResponse({ success: true, message: 'Logged out successfully' });
  } catch {
    return createSecureResponse({ error: 'Failed to logout' }, { status: 500 });
  }
}
