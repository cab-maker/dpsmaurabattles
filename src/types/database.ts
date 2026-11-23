export type BattleCategory = 'Mog Battle' | 'Aura Battle';

export type BattleStatus = 'Pending' | 'Upcoming' | 'Live' | 'Completed' | 'Rejected';

export type AnnouncementPriority = 'Normal' | 'High' | 'Urgent';

export interface Location {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  student_name: string;
  total_wins: number;
  created_at: string;
  updated_at: string;
}

export interface Battle {
  id: string;
  person_one: string;
  person_two: string;
  category: BattleCategory;
  description: string | null;
  location_id: string | null;
  status: BattleStatus;
  winner_id: string | null;
  winner_name: string | null;
  scheduled_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  votes_person_one?: number;
  votes_person_two?: number;
  location?: Location | null;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface BattleResult {
  id: string;
  battle_id: string;
  winner_id: string;
  winner_name: string;
  created_at: string;
}

export interface AdminStats {
  totalBattles: number;
  pendingSubmissions: number;
  activeBattles: number;
  completedBattles: number;
  totalStudents: number;
  totalWins: number;
}

export interface ChatMessage {
  id: string;
  sender_name: string;
  sender_badge: string;
  sender_pfp?: string | null;
  sender_ip?: string | null;
  message: string;
  reactions: Record<string, number>;
  is_pinned: boolean;
  created_at: string;
}

export interface ChatUser {
  ip: string;
  name: string;
  pfp_url: string;
  is_banned: boolean;
  ban_reason?: string | null;
  created_at: string;
}
