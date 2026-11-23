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

    const { data: user, error } = await supabase
      .from('chat_users')
      .select('*')
      .eq('ip', ip)
      .maybeSingle();

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    return createSecureResponse({ user: user || null, ip });
  } catch {
    return createSecureResponse({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

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

    // Check if an account already exists for this IP
    const { data: existingUser } = await supabase
      .from('chat_users')
      .select('*')
      .eq('ip', ip)
      .maybeSingle();

    if (existingUser) {
      return createSecureResponse(
        {
          error: 'An account is already bound to your IP. Multiple accounts are strictly prohibited.',
          user: existingUser,
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const name = sanitizeInput(body.name);
    const pfp_url = String(body.pfp_url || '').trim();

    if (!name || name.length < 2) {
      return createSecureResponse({ error: 'Name must be at least 2 characters.' }, { status: 400 });
    }

    if (name.length > 25) {
      return createSecureResponse({ error: 'Name must be 25 characters or less.' }, { status: 400 });
    }

    const defaultPfp = pfp_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(name);

    const { data: newUser, error: insertError } = await supabase
      .from('chat_users')
      .insert({
        ip,
        name,
        pfp_url: defaultPfp,
        is_banned: false,
      })
      .select()
      .single();

    if (insertError) {
      return createSecureResponse({ error: insertError.message }, { status: 500 });
    }

    return createSecureResponse({ success: true, user: newUser });
  } catch {
    return createSecureResponse({ error: 'Failed to register chat profile.' }, { status: 500 });
  }
}
