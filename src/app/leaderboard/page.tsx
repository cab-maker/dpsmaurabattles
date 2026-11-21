import React from 'react';
import Link from 'next/link';
import { Trophy, Medal, Crown, Flame, Swords, ArrowRight } from 'lucide-react';
import { getLeaderboard, getCompletedBattleHistory } from '@/lib/db';


export default async function LeaderboardPage() {
  const [leaderboard, history] = await Promise.all([
    getLeaderboard(),
    getCompletedBattleHistory(),
  ]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
          Hall of Legends
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          The Official <span className="aura-text">Aura</span> Leaderboard
        </h1>
        <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
          Sanctioned win standings maintained automatically by battle outcomes. Who holds supreme school aura?
        </p>
      </div>

      {/* Top 3 Podium Highlights */}
      {topThree.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end">
          
          {/* 2nd Place - Silver (order-2 on mobile, left on desktop) */}
          {topThree[1] && (
            <div className="order-2 md:order-1 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-300/30 bg-gradient-to-t from-slate-400/10 via-transparent to-transparent text-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-slate-300/10 border border-slate-300/30 flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Medal className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-2.5 py-1 rounded-full bg-slate-400/10 border border-slate-400/20">
                2nd Place — Silver
              </span>
              <h3 className="text-2xl font-black text-white mt-4">{topThree[1].student_name}</h3>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <span className="text-3xl font-black text-slate-200">{topThree[1].total_wins}</span>
                <span className="block text-xs uppercase font-bold text-neutral-400 mt-0.5">Sanctioned Wins</span>
              </div>
            </div>
          )}

          {/* 1st Place - Gold (order-1 on mobile, center on desktop) */}
          {topThree[0] && (
            <div className="order-1 md:order-2 glass-panel rounded-3xl p-8 sm:p-10 border border-amber-400/40 bg-gradient-to-t from-amber-500/15 via-transparent to-transparent text-center relative overflow-hidden shadow-2xl shadow-amber-500/10 group scale-100 md:scale-105 z-10">
              <div className="w-20 h-20 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto mb-4 text-amber-400">
                <Crown className="w-10 h-10 animate-bounce" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30">
                ★ 1st Place — Gold King ★
              </span>
              <h3 className="text-3xl font-black text-white mt-4">{topThree[0].student_name}</h3>
              <div className="mt-5 pt-5 border-t border-white/[0.08]">
                <span className="text-4xl font-black aura-text">{topThree[0].total_wins}</span>
                <span className="block text-xs uppercase font-extrabold text-neutral-300 mt-1">Undefeated Wins</span>
              </div>
            </div>
          )}

          {/* 3rd Place - Bronze (order-3) */}
          {topThree[2] && (
            <div className="order-3 glass-panel rounded-3xl p-6 sm:p-8 border border-amber-700/30 bg-gradient-to-t from-amber-800/10 via-transparent to-transparent text-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-amber-700/10 border border-amber-700/30 flex items-center justify-center mx-auto mb-4 text-amber-500">
                <Medal className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 px-2.5 py-1 rounded-full bg-amber-700/10 border border-amber-700/20">
                3rd Place — Bronze
              </span>
              <h3 className="text-2xl font-black text-white mt-4">{topThree[2].student_name}</h3>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <span className="text-3xl font-black text-amber-500">{topThree[2].total_wins}</span>
                <span className="block text-xs uppercase font-bold text-neutral-400 mt-0.5">Sanctioned Wins</span>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto mb-16">
          <Trophy className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Leaderboard is Fresh</h3>
          <p className="text-xs text-neutral-400">
            No battle results recorded yet. Completed arena matches will automatically rank participants here.
          </p>
        </div>
      )}

      {/* Full Leaderboard Table */}
      {remaining.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08] mb-16">
          <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <h3 className="text-base font-bold text-white">Full Contender Rankings</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {remaining.map((student, idx) => (
              <div
                key={student.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-neutral-400 w-8">
                    #{idx + 4}
                  </span>
                  <span className="text-base font-bold text-white">
                    {student.student_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-neutral-200">
                    {student.total_wins}
                  </span>
                  <span className="text-xs uppercase font-semibold text-neutral-400">
                    wins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Battle Results & History Log */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Archive</span>
            <h2 className="text-2xl font-black text-white">
              Recent Battle History & Winners
            </h2>
          </div>
          <Link
            href="/battles"
            className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>All Matches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((h) => (
              <div
                key={h.id}
                className="glass-panel rounded-2xl p-5 border border-white/[0.06] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-neutral-300 font-medium">
                      {h.category}
                    </span>
                    <span>•</span>
                    <span>{h.location?.name || 'School Campus'}</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {h.person_one} <span className="text-neutral-400 font-normal">vs</span> {h.person_two}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{h.winner_name}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-6 text-center text-xs text-neutral-400">
            No completed matches in history yet.
          </div>
        )}
      </div>

    </div>
  );
}
