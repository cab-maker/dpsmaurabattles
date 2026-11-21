import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Rate limiting map for battle submissions
const submissionMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();
    const rateLimit = submissionMap.get(ip) || { count: 0, resetAt: now + 60000 };

    if (now > rateLimit.resetAt) {
      rateLimit.count = 0;
      rateLimit.resetAt = now + 60000;
    }

    if (rateLimit.count >= 10) {
      return NextResponse.json(
        { error: 'You are submitting too fast. Please wait a minute.' },
        { status: 429 }
      );
    }

    const { person_one, person_two, category, description } = await request.json();

    if (!person_one || typeof person_one !== 'string' || person_one.trim().length < 2) {
      return NextResponse.json({ error: 'Person 1 name must be at least 2 characters.' }, { status: 400 });
    }

    if (!person_two || typeof person_two !== 'string' || person_two.trim().length < 2) {
      return NextResponse.json({ error: 'Person 2 name must be at least 2 characters.' }, { status: 400 });
    }

    const p1 = person_one.trim();
    const p2 = person_two.trim();

    if (p1.toLowerCase() === p2.toLowerCase()) {
      return NextResponse.json({ error: 'Contestants must be two different individuals.' }, { status: 400 });
    }

    if (!['Mog Battle', 'Aura Battle'].includes(category)) {
      return NextResponse.json({ error: 'Category must be either "Mog Battle" or "Aura Battle".' }, { status: 400 });
    }

    rateLimit.count += 1;
    submissionMap.set(ip, rateLimit);

    // Save as Pending status
    const { data, error } = await supabase
      .from('battles')
      .insert({
        person_one: p1,
        person_two: p2,
        category,
        description: description ? String(description).slice(0, 300).trim() : null,
        status: 'Pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Battle submitted successfully and is awaiting admin approval!',
      battle: data,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process battle submission.' },
      { status: 500 }
    );
  }
}
