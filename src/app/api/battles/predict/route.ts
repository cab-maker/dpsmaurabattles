import { supabase } from '@/lib/supabase';
import { validateMutationRequest, createSecureResponse } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const originCheck = validateMutationRequest(request);
    if (!originCheck.valid) {
      return createSecureResponse(
        { error: originCheck.reason || 'Forbidden: DPSM SUCKS' },
        { status: 403 }
      );
    }

    const { battle_id, choice } = await request.json();

    if (!battle_id || (choice !== 1 && choice !== 2)) {
      return createSecureResponse({ error: 'Invalid prediction parameters.' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('predict_battle_winner', {
      battle_id,
      person_choice: choice,
    });

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    const result = Array.isArray(data) ? data[0] : data;

    return createSecureResponse({
      success: true,
      votes_person_one: result?.new_votes_one ?? 0,
      votes_person_two: result?.new_votes_two ?? 0,
    });
  } catch {
    return createSecureResponse({ error: 'Failed to record prediction.' }, { status: 500 });
  }
}
