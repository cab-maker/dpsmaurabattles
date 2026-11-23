import { supabase } from '@/lib/supabase';
import { validateMutationRequest, createSecureResponse } from '@/lib/security';

const ALLOWED_REACTIONS = ['🔥', '🗿', '💀', '⚡', '👑', '🧢', '💯'];

export async function POST(request: Request) {
  try {
    const originCheck = validateMutationRequest(request);
    if (!originCheck.valid) {
      return createSecureResponse(
        { error: originCheck.reason || 'Forbidden: DPSM SUCKS' },
        { status: 403 }
      );
    }

    const { message_id, emoji } = await request.json();

    if (!message_id || !ALLOWED_REACTIONS.includes(emoji)) {
      return createSecureResponse({ error: 'Invalid reaction parameters.' }, { status: 400 });
    }

    // Fetch current reactions
    const { data: msg, error: fetchErr } = await supabase
      .from('chat_messages')
      .select('reactions')
      .eq('id', message_id)
      .single();

    if (fetchErr || !msg) {
      return createSecureResponse({ error: 'Message not found.' }, { status: 404 });
    }

    const currentReactions: Record<string, number> = msg.reactions || {};
    currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;

    const { data, error } = await supabase
      .from('chat_messages')
      .update({ reactions: currentReactions })
      .eq('id', message_id)
      .select()
      .single();

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    return createSecureResponse({ success: true, reactions: data.reactions });
  } catch {
    return createSecureResponse({ error: 'Failed to react.' }, { status: 500 });
  }
}
