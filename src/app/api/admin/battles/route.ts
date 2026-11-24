import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET all battles (including Pending and Rejected for admin)
export async function GET() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('battles')
    .select(`
      *,
      location:locations(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ battles: data });
}

// POST create battle directly from admin
export async function POST(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { person_one, person_two, category, description, location_id, status, scheduled_at } = body;

    if (!person_one?.trim() || !person_two?.trim()) {
      return NextResponse.json({ error: 'Both contestants are required' }, { status: 400 });
    }

    if (!['Mog Battle', 'Aura Battle'].includes(category)) {
      return NextResponse.json({ error: 'Valid category is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('battles')
      .insert({
        person_one: person_one.trim(),
        person_two: person_two.trim(),
        category,
        description: description?.trim() || null,
        location_id: location_id || null,
        status: status || 'Upcoming',
        scheduled_at: scheduled_at || null,
        approved_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ battle: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PATCH update battle status, location, category, schedule or award winner
export async function PATCH(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Battle ID is required' }, { status: 400 });
    }

    // Handle winner completion action with duplicate-win prevention
    if (action === 'complete_with_winner') {
      const { winner_name } = updates;
      if (!winner_name?.trim()) {
        return NextResponse.json({ error: 'Winner name is required' }, { status: 400 });
      }

      // Check current battle
      const { data: currentBattle, error: fetchErr } = await supabase
        .from('battles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchErr || !currentBattle) {
        return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
      }

      // Check if already completed to prevent accidental double-increment
      if (currentBattle.status === 'Completed') {
        return NextResponse.json(
          { error: 'Battle is already completed. To change winner, please revert or edit.' },
          { status: 400 }
        );
      }

      // Find or create leaderboard record for student
      let winnerId = null;
      const cleanWinnerName = winner_name.trim();

      const { data: existingLeader, error: leaderFindErr } = await supabase
        .from('leaderboard')
        .select('*')
        .ilike('student_name', cleanWinnerName)
        .maybeSingle();

      if (leaderFindErr) {
        return NextResponse.json({ error: leaderFindErr.message }, { status: 500 });
      }

      if (existingLeader) {
        winnerId = existingLeader.id;
        const { error: incErr } = await supabase
          .from('leaderboard')
          .update({
            total_wins: (existingLeader.total_wins || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingLeader.id);

        if (incErr) return NextResponse.json({ error: incErr.message }, { status: 500 });
      } else {
        const { data: newLeader, error: insertLeaderErr } = await supabase
          .from('leaderboard')
          .insert({
            student_name: cleanWinnerName,
            total_wins: 1,
          })
          .select()
          .single();

        if (insertLeaderErr) return NextResponse.json({ error: insertLeaderErr.message }, { status: 500 });
        winnerId = newLeader.id;
      }

      // Update the battle status
      const { data: updatedBattle, error: updateBattleErr } = await supabase
        .from('battles')
        .update({
          status: 'Completed',
          winner_id: winnerId,
          winner_name: cleanWinnerName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateBattleErr) return NextResponse.json({ error: updateBattleErr.message }, { status: 500 });

      // Record in battle_results
      await supabase
        .from('battle_results')
        .upsert(
          {
            battle_id: id,
            winner_id: winnerId,
            winner_name: cleanWinnerName,
          },
          { onConflict: 'battle_id' }
        );

      return NextResponse.json({ success: true, battle: updatedBattle });
    }

    // Revert a completed battle win
    if (action === 'revert_completion') {
      const { data: currentBattle } = await supabase
        .from('battles')
        .select('*')
        .eq('id', id)
        .single();

      if (currentBattle && currentBattle.status === 'Completed' && currentBattle.winner_id) {
        // Decrement the student's win count
        const { data: leader } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('id', currentBattle.winner_id)
          .single();

        if (leader) {
          const newWins = Math.max(0, (leader.total_wins || 1) - 1);
          await supabase
            .from('leaderboard')
            .update({ total_wins: newWins, updated_at: new Date().toISOString() })
            .eq('id', leader.id);
        }

        await supabase.from('battle_results').delete().eq('battle_id', id);
      }

      const { data: revertedBattle, error: revErr } = await supabase
        .from('battles')
        .update({
          status: 'Upcoming',
          winner_id: null,
          winner_name: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (revErr) return NextResponse.json({ error: revErr.message }, { status: 500 });

      return NextResponse.json({ success: true, battle: revertedBattle });
    }

    // General update (Approve, reject, change location, reschedule date, etc.)
    const payload: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if ('scheduled_at' in updates) {
      if (!updates.scheduled_at || updates.scheduled_at === '' || updates.scheduled_at === 'null') {
        payload.scheduled_at = null;
      } else {
        const parsed = new Date(updates.scheduled_at as string);
        payload.scheduled_at = isNaN(parsed.getTime()) ? null : parsed.toISOString();
      }
    }

    if (updates.status === 'Upcoming' || updates.status === 'Live') {
      payload.approved_at = new Date().toISOString();
    }

    const { data: updatedBattle, error: updateErr } = await supabase
      .from('battles')
      .update(payload)
      .eq('id', id)
      .select(`*, location:locations(*)`)
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, battle: updatedBattle });
  } catch {
    return NextResponse.json({ error: 'Failed to update battle' }, { status: 500 });
  }
}

// DELETE a battle
export async function DELETE(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const { error } = await supabase.from('battles').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Battle deleted' });
}
