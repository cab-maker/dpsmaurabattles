import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { battle_id, choice } = await request.json();

    if (!battle_id || (choice !== 1 && choice !== 2)) {
      return NextResponse.json({ error: 'Invalid prediction parameters.' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('predict_battle_winner', {
      battle_id,
      person_choice: choice,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      success: true,
      votes_person_one: result?.new_votes_one ?? 0,
      votes_person_two: result?.new_votes_two ?? 0,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to record prediction.' }, { status: 500 });
  }
}
