import { supabase } from '@/lib/supabase';
import { validateMutationRequest, sanitizeInput, createSecureResponse } from '@/lib/security';

// Rate limiting map for battle submissions
const submissionMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  try {
    // 1. Origin verification against cross-origin attacks
    const originCheck = validateMutationRequest(request);
    if (!originCheck.valid) {
      return createSecureResponse(
        { error: originCheck.reason || 'Forbidden: DPSM SUCKS' },
        { status: 403 }
      );
    }

    // 2. IP Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();
    const rateLimit = submissionMap.get(ip) || { count: 0, resetAt: now + 60000 };

    if (now > rateLimit.resetAt) {
      rateLimit.count = 0;
      rateLimit.resetAt = now + 60000;
    }

    if (rateLimit.count >= 10) {
      return createSecureResponse(
        { error: 'You are submitting too fast. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const person_one = sanitizeInput(body.person_one);
    const person_two = sanitizeInput(body.person_two);
    const category = sanitizeInput(body.category);
    const description = body.description ? sanitizeInput(body.description).slice(0, 300) : null;

    if (!person_one || person_one.length < 2) {
      return createSecureResponse({ error: 'Person 1 name must be at least 2 characters.' }, { status: 400 });
    }

    if (!person_two || person_two.length < 2) {
      return createSecureResponse({ error: 'Person 2 name must be at least 2 characters.' }, { status: 400 });
    }

    if (person_one.toLowerCase() === person_two.toLowerCase()) {
      return createSecureResponse({ error: 'Contestants must be two different individuals.' }, { status: 400 });
    }

    if (!['Mog Battle', 'Aura Battle'].includes(category)) {
      return createSecureResponse({ error: 'Category must be either "Mog Battle" or "Aura Battle".' }, { status: 400 });
    }

    rateLimit.count += 1;
    submissionMap.set(ip, rateLimit);

    // Save as Pending status
    const { data, error } = await supabase
      .from('battles')
      .insert({
        person_one,
        person_two,
        category,
        description,
        status: 'Pending',
      })
      .select()
      .single();

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    return createSecureResponse({
      success: true,
      message: 'Battle submitted successfully and is awaiting admin approval!',
      battle: data,
    });
  } catch {
    return createSecureResponse(
      { error: 'Failed to process battle submission.' },
      { status: 500 }
    );
  }
}
