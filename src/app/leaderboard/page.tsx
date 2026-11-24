import React from 'react';
import Link from 'next/link';
import { Trophy, Medal, Crown, ArrowRight } from 'lucide-react';
import { getLeaderboard, getCompletedBattleHistory } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function LeaderboardPage() {
  const [leaderboard, history] = await Promise.all([
    getLeaderboard(),
    getCompletedBattleHistory(),
  ]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 bg-[#000000] text-white">
      
      {/* Header */}
      <div className="mb-16 pb-8 border-b border-neutral-900">
        <span className="text-xs font-black uppercase tracking-widest text-[#ec008c] block mb-2">
          Rankings & Standings
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
          Leaderboard.
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 mt-3 max-w-xl font-medium">
          Sanctioned win standings maintained automatically by battle outcomes. Who holds supreme school aura?
        </p>
      </div>

      {/* Top 3 Podium Highlights */}
      {topThree.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 items-end">
          
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="order-2 md:order-1 rounded-2xl p-7 bg-[#0a0a0a] border border-neutral-800 text-center relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-300">
                <Medal className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
                #2 • Silver
              </span>
              <h3 className="text-2xl font-black text-white mt-4 tracking-tight">{topThree[1].student_name}</h3>
              <div className="mt-5 pt-4 border-t border-neutral-900">
                <span className="text-3xl font-black text-neutral-200">{topThree[1].total_wins}</span>
                <span className="block text-[10px] uppercase font-black text-neutral-500 mt-0.5">Wins</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="order-1 md:order-2 rounded-2xl p-8 sm:p-10 bg-[#0d0d0d] border-2 border-[#ec008c]/60 text-center relative overflow-hidden shadow-2xl shadow-[#ec008c]/10 scale-100 md:scale-105 z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#ec008c]/20 border border-[#ec008c]/40 flex items-center justify-center mx-auto mb-4 text-[#ec008c]">
                <Crown className="w-8 h-8 animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ec008c] px-3.5 py-1 rounded-full bg-[#ec008c]/15 border border-[#ec008c]/30">
                ★ #1 • Supreme Champion ★
              </span>
              <h3 className="text-3xl font-black text-white mt-4 tracking-tight">{topThree[0].student_name}</h3>
              <div className="mt-5 pt-5 border-t border-neutral-900">
                <span className="text-4xl font-black text-[#ec008c]">{topThree[0].total_wins}</span>
                <span className="block text-[10px] uppercase font-black text-neutral-400 mt-1">Undefeated Wins</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="order-3 rounded-2xl p-7 bg-[#0a0a0a] border border-neutral-800 text-center relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4 text-amber-600">
                <Medal className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
                #3 • Bronze
              </span>
              <h3 className="text-2xl font-black text-white mt-4 tracking-tight">{topThree[2].student_name}</h3>
              <div className="mt-5 pt-4 border-t border-neutral-900">
                <span className="text-3xl font-black text-neutral-300">{topThree[2].total_wins}</span>
                <span className="block text-[10px] uppercase font-black text-neutral-500 mt-0.5">Wins</span>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="rounded-2xl p-16 text-center max-w-md mx-auto mb-20 bg-[#0a0a0a] border border-neutral-900">
          <Trophy className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-black text-white mb-1">Leaderboard is Fresh</h3>
          <p className="text-xs text-neutral-500">
            No battle results recorded yet. Completed arena matches will automatically rank participants here.
          </p>
        </div>
      )}

      {/* Full Leaderboard Table */}
      {remaining.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-neutral-900 bg-[#0a0a0a] mb-20">
          <div className="px-6 py-4 border-b border-neutral-900 bg-neutral-950">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">All Contender Rankings</h3>
          </div>
          <div className="divide-y divide-neutral-900">
            {remaining.map((student, idx) => (
              <div
                key={student.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-neutral-900/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-neutral-500 w-8">
                    #{idx + 4}
                  </span>
                  <span className="text-base font-black text-white tracking-tight">
                    {student.student_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#ec008c]">
                    {student.total_wins}
                  </span>
                  <span className="text-[10px] uppercase font-black text-neutral-500">
                    wins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Battle Results & History Log */}
      <div>
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-neutral-900">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#ec008c] block mb-1">
              Archive
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Recent Matches.
            </h2>
          </div>
          <Link
            href="/battles"
            className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 group"
          >
            <span>All Matches</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((h) => (
              <div
                key={h.id}
                className="rounded-2xl p-5 bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-800 transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1 font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 text-[10px] font-bold">
                      {h.category}
                    </span>
                    <span>•</span>
                    <span>{h.location?.name || 'Campus'}</span>
                  </div>
                  <p className="text-sm font-black text-white tracking-tight">
                    {h.person_one} <span className="text-neutral-500 font-normal">vs</span> {h.person_two}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-[#ec008c]">
                    <Trophy className="w-3.5 h-3.5 text-[#ec008c]" />
                    <span>{h.winner_name}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-8 bg-[#0a0a0a] border border-neutral-900 text-center text-xs text-neutral-500">
            No completed matches in history yet.
          </div>
        )}
      </div>

    </div>
  );
}
