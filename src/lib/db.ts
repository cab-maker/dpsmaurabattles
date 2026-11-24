import { supabase } from '@/lib/supabase';
import { Battle, Announcement, LeaderboardEntry, Location, Meme } from '@/types/database';


export async function getPublicAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
  return data || [];
}

export async function getApprovedBattles(): Promise<Battle[]> {
  const { data, error } = await supabase
    .from('battles')
    .select(`
      *,
      location:locations(*)
    `)
    .in('status', ['Upcoming', 'Live', 'Completed'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching battles:', error);
    return [];
  }
  return (data as Battle[]) || [];
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_wins', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data || [];
}

export async function getActiveLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
  return data || [];
}

export async function getCompletedBattleHistory(): Promise<Battle[]> {
  const { data, error } = await supabase
    .from('battles')
    .select(`
      *,
      location:locations(*)
    `)
    .eq('status', 'Completed')
    .order('updated_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching battle history:', error);
    return [];
  }
  return (data as Battle[]) || [];
}

export async function getPublicMemes(): Promise<Meme[]> {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching memes:', error);
    return [];
  }
  return data || [];
}

