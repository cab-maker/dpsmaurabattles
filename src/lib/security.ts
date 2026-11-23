import { NextResponse } from 'next/server';

/**
 * Security headers attached to all API responses
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Defense-Matrix': 'DPSM SUCKS - PROTECTED BY AURA SHIELD',
  'X-Security-Status': 'UNCRACKABLE-100%',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
};

/**
 * Validates request Origin and Referer for POST/PATCH/DELETE mutations
 * Prevents Cross-Site Request Forgery (CSRF) and cross-origin hijacking
 */
export function validateMutationRequest(request: Request): { valid: boolean; reason?: string } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // If both origin and referer are absent (like direct same-origin fetch in certain browsers or non-browser curl)
  if (!origin && !referer) {
    return { valid: true };
  }

  const checkUrl = origin || referer || '';

  try {
    const parsed = new URL(checkUrl);
    const parsedHost = parsed.host;

    // Allowed hosts
    const isLocalhost = parsedHost.includes('localhost') || parsedHost.includes('127.0.0.1');
    const isVercel = parsedHost.endsWith('.vercel.app');
    const isMatchingHost = host && parsedHost === host;

    if (isLocalhost || isVercel || isMatchingHost) {
      return { valid: true };
    }

    return {
      valid: false,
      reason: 'Cross-origin mutation rejected. DPSM SUCKS - Tamper attempt blocked.',
    };
  } catch {
    return { valid: false, reason: 'Invalid origin or referer header format.' };
  }
}

/**
 * Sanitizes text input to prevent XSS, HTML injection, and malicious scripts
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove <iframe> tags
    .replace(/javascript:/gi, '') // Strip javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Strip event handlers like onerror=, onload=
    .replace(/[<>]/g, '') // Strip angle brackets to prevent any HTML tag rendering
    .trim();
}

/**
 * Helper to build a hardened JSON response with security headers
 */
export function createSecureResponse<T>(data: T, init?: ResponseInit): NextResponse<T> {
  const response = NextResponse.json(data, init);
  
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}
