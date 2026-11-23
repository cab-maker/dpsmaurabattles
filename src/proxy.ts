import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // If it's an API mutation request, verify Origin / Referer
  if (request.nextUrl.pathname.startsWith('/api') && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    if (origin || referer) {
      const checkUrl = origin || referer || '';
      try {
        const parsed = new URL(checkUrl);
        const parsedHost = parsed.host;
        const isLocalhost = parsedHost.includes('localhost') || parsedHost.includes('127.0.0.1');
        const isVercel = parsedHost.endsWith('.vercel.app');
        const isMatchingHost = host && parsedHost === host;

        if (!isLocalhost && !isVercel && !isMatchingHost) {
          return new NextResponse(
            JSON.stringify({
              error: 'Forbidden: Cross-origin tampering rejected. DPSM SUCKS.',
              status: 'UNCRACKABLE',
            }),
            {
              status: 403,
              headers: {
                'Content-Type': 'application/json',
                'X-Defense-Notice': 'DPSM SUCKS - TAMPER ATTEMPT BLOCKED',
              },
            }
          );
        }
      } catch {
        // Invalid origin format
      }
    }
  }

  const response = NextResponse.next();

  // Attach impenetrable aura defense headers
  response.headers.set('X-Defense-Notice', 'DPSM SUCKS - PROTECTED BY AURA SHIELD');
  response.headers.set('X-Aura-Security', '100% UNCRACKABLE');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
