import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_wins', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leaderboard: data });
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { student_name, total_wins } = await request.json();

    if (!student_name?.trim()) {
      return NextResponse.json({ error: 'Student name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .insert({
        student_name: student_name.trim(),
        total_wins: Number(total_wins) || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entry: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create student entry' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, action, student_name, total_wins } = await request.json();

    if (action === 'reset_all') {
      const { error } = await supabase
        .from('leaderboard')
        .update({ total_wins: 0, updated_at: new Date().toISOString() })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, message: 'All statistics reset to 0' });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (action === 'increment_win') {
      const { data: current } = await supabase
        .from('leaderboard')
        .select('total_wins')
        .eq('id', id)
        .single();

      const nextWins = (current?.total_wins || 0) + 1;
      const { data, error } = await supabase
        .from('leaderboard')
        .update({ total_wins: nextWins, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ entry: data });
    }

    if (action === 'decrement_win') {
      const { data: current } = await supabase
        .from('leaderboard')
        .select('total_wins')
        .eq('id', id)
        .single();

      const nextWins = Math.max(0, (current?.total_wins || 0) - 1);
      const { data, error } = await supabase
        .from('leaderboard')
        .update({ total_wins: nextWins, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ entry: data });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (student_name !== undefined) updates.student_name = student_name.trim();
    if (total_wins !== undefined) updates.total_wins = Math.max(0, Number(total_wins));

    const { data, error } = await supabase
      .from('leaderboard')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entry: data });
  } catch {
    return NextResponse.json({ error: 'Failed to update leaderboard entry' }, { status: 400 });
  }
}

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

  const { error } = await supabase.from('leaderboard').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
