import { supabase } from '@/lib/supabase';
import { validateMutationRequest, sanitizeInput, createSecureResponse } from '@/lib/security';

export async function GET() {
  try {
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

    const ip = request.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();
    const lastSent = spamMap.get(ip) || 0;

    if (now - lastSent < 800) {
      return createSecureResponse(
        { error: 'Slow down! Please wait a moment between messages.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sender_name = sanitizeInput(body.sender_name) || 'Anonymous Mogger';
    const sender_badge = sanitizeInput(body.sender_badge) || 'Challenger';
    const message = sanitizeInput(body.message);

    if (!message || message.length < 1) {
      return createSecureResponse({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    if (message.length > 400) {
      return createSecureResponse({ error: 'Message must be under 400 characters.' }, { status: 400 });
    }

    spamMap.set(ip, now);

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_name: sender_name.slice(0, 30),
        sender_badge: sender_badge.slice(0, 30),
        message: message.slice(0, 400),
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
