import { supabase } from '@/lib/supabase';
import { validateMutationRequest, sanitizeInput, createSecureResponse } from '@/lib/security';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);

    // Check if requester IP is banned
    const { data: userProfile } = await supabase
      .from('chat_users')
      .select('is_banned, ban_reason')
      .eq('ip', ip)
      .maybeSingle();

    if (userProfile?.is_banned) {
      return createSecureResponse(
        {
          error: 'Your IP has been banned from the GC for Aura violations.',
          is_banned: true,
          ban_reason: userProfile.ban_reason || 'Banned by Admin',
          messages: [],
        },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    return createSecureResponse({ messages: data || [] });
  } catch {
    return createSecureResponse({ error: 'Failed to fetch chat messages' }, { status: 500 });
  }
}

// In-memory spam prevention map: IP -> last timestamp
const spamMap = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const originCheck = validateMutationRequest(request);
    if (!originCheck.valid) {
      return createSecureResponse(
        { error: originCheck.reason || 'Forbidden: DPSM SUCKS' },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);

    // 1. Verify user profile exists and is NOT banned
    const { data: userProfile } = await supabase
      .from('chat_users')
      .select('*')
      .eq('ip', ip)
      .maybeSingle();

    if (!userProfile) {
      return createSecureResponse(
        { error: 'Profile required. Please enter your name and choose a profile picture first.' },
        { status: 401 }
      );
    }

    if (userProfile.is_banned) {
      return createSecureResponse(
        {
          error: 'Your IP has been banned from the GC for Aura violations.',
          is_banned: true,
        },
        { status: 403 }
      );
    }

    // 2. Anti-spam throttle (800ms)
    const now = Date.now();
    const lastSent = spamMap.get(ip) || 0;

    if (now - lastSent < 800) {
      return createSecureResponse(
        { error: 'Slow down! Please wait a moment between messages.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sender_badge = sanitizeInput(body.sender_badge) || 'Challenger';
    const message = sanitizeInput(body.message);

    if (!message || message.length < 1) {
      return createSecureResponse({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    if (message.length > 500) {
      return createSecureResponse({ error: 'Message must be under 500 characters.' }, { status: 400 });
    }

    spamMap.set(ip, now);

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_name: userProfile.name,
        sender_pfp: userProfile.pfp_url,
        sender_ip: ip,
        sender_badge: sender_badge.slice(0, 30),
        message: message.slice(0, 500),
        reactions: {},
      })
      .select()
      .single();

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    return createSecureResponse({ success: true, message: data });
  } catch {
    return createSecureResponse({ error: 'Failed to send message.' }, { status: 500 });
  }
}
