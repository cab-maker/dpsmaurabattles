import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swords, Trophy, ArrowRight, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { getPublicAnnouncements, getApprovedBattles, getLeaderboard } from '@/lib/db';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import BattleCard from '@/components/BattleCard';


export default async function HomePage() {
  const [announcements, battles, leaderboard] = await Promise.all([
    getPublicAnnouncements(),
    getApprovedBattles(),
    getLeaderboard(),
  ]);

  const activeBattles = battles.filter((b) => b.status === 'Live' || b.status === 'Upcoming').slice(0, 6);
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden flex flex-col items-center text-center px-4">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-pink-600/15 via-purple-600/15 to-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-300">
              The Official School Championship
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.1]">
            THE <span className="aura-text">AURA</span> ARENA.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-xl text-neutral-300 max-w-2xl font-medium leading-relaxed">
            Every battle has a story. Every winner has an <span className="aura-text font-bold">aura</span>.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 shadow-xl shadow-purple-600/25 active:scale-95 transition-all"
            >
              <Swords className="w-5 h-5" />
              <span>Enter the Arena</span>
            </Link>

            <Link
              href="/leaderboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-neutral-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] active:scale-95 transition-all"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>View Leaderboard</span>
            </Link>
          </div>

          {/* Official Mascot Showcase: The Supplied Monkey Photograph */}
          <div className="mt-12 relative group">
            {/* Multi-layered dynamic rainbow aura glow behind the photo */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
            
            <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#0c0d14] p-2 shadow-2xl">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-xl overflow-hidden bg-neutral-900">
                <Image
                  src="/monkey.png"
                  alt="Aura Arena Official Mascot"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Integrated Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#060709]/80 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-pink-400">Chief Aura Officer</p>
                  <p className="text-xs font-black text-white">Supreme Mascot</p>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                  +100,000 AURA
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Permanent Announcement Section */}
      <section className="w-full">
        <AnnouncementBanner announcements={announcements} />
      </section>

      {/* Top 3 Aura Legends Preview */}
      {topThree.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Podium</span>
              <h2 className="text-2xl font-black text-white">
                Current <span className="aura-text">Aura</span> Kings
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Full Standings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topThree.map((student, idx) => {
              const rank = idx + 1;
              const medalColor =
                rank === 1
                  ? 'border-amber-400/40 bg-gradient-to-b from-amber-500/10 to-transparent text-amber-300'
                  : rank === 2
                  ? 'border-slate-300/40 bg-gradient-to-b from-slate-400/10 to-transparent text-slate-200'
                  : 'border-amber-700/40 bg-gradient-to-b from-amber-800/10 to-transparent text-amber-500';

              return (
                <div
                  key={student.id}
                  className={`glass-panel rounded-2xl p-6 border ${medalColor} relative flex items-center justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-black text-xl">
                      #{rank}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{student.student_name}</h4>
                      <p className="text-xs text-neutral-400">Total Victories</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black aura-text">{student.total_wins}</span>
                    <span className="block text-[10px] uppercase font-bold text-neutral-400">Wins</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Current Battles Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Arena Matches</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Active & Upcoming <span className="aura-text">Aura</span> Battles
            </h2>
          </div>
          <Link
            href="/battles"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-semibold text-neutral-200 border border-white/[0.08]"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeBattles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBattles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto">
            <Swords className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">No Public Battles Active</h4>
            <p className="text-xs text-neutral-400 mb-6">
              Be the first to challenge someone in the school arena!
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/20"
            >
              <span>Submit a Battle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/battles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
