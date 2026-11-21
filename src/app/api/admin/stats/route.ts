import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [battlesRes, leaderboardRes] = await Promise.all([
      supabase.from('battles').select('status'),
      supabase.from('leaderboard').select('total_wins'),
    ]);

    const battles = battlesRes.data || [];
    const leaderboard = leaderboardRes.data || [];

    const stats = {
      totalBattles: battles.length,
      pendingSubmissions: battles.filter((b) => b.status === 'Pending').length,
      activeBattles: battles.filter((b) => b.status === 'Upcoming' || b.status === 'Live').length,
      completedBattles: battles.filter((b) => b.status === 'Completed').length,
      totalStudents: leaderboard.length,
      totalWins: leaderboard.reduce((acc, curr) => acc + (curr.total_wins || 0), 0),
    };

    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
