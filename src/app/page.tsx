import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swords, Trophy, ArrowRight, ShieldCheck, Flame, Zap, MapPin } from 'lucide-react';
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
    <div className="flex flex-col items-center w-full min-h-screen">
      
      {/* Hero Section: Clean 2-Column Desktop Layout with Mascot on Right Side */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* School Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-300">
                DPSM Official Arena
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
              THE <span className="aura-text">AURA</span> ARENA.
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed">
              Every battle has a story. Every winner has an <span className="aura-text font-bold">aura</span>.
            </p>

            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-lg leading-relaxed">
              Sanctioned school challenges, voluntary stage showdowns, campus arena locations, and the official live leaderboard.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-90 shadow-md active:scale-98 transition-all"
              >
                <Swords className="w-4 h-4" />
                <span>Enter the Arena</span>
              </Link>

              <Link
                href="/leaderboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-neutral-200 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] active:scale-98 transition-all"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Leaderboard</span>
              </Link>
            </div>

            {/* Quick Stats Strip */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-md">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">{battles.length}</p>
                <p className="text-[11px] font-medium text-neutral-400">Total Battles</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">{leaderboard.length}</p>
                <p className="text-[11px] font-medium text-neutral-400">Contenders</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-cyan-400">5</p>
                <p className="text-[11px] font-medium text-neutral-400">Arena Arenas</p>
              </div>
            </div>

          </div>

          {/* Right Column: Prominent Mascot Image Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
              
              {/* Subtle back ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-600/30 to-cyan-400/30 rounded-3xl blur-xl opacity-75" />

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0c0d14] p-3 shadow-xl">
                
                {/* Official Mascot Photo */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-900">
                  <Image
                    src="/monkey.png"
                    alt="Official DPSM Aura Arena Mascot"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Clean Mascot Identifier Bar */}
                <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 block">
                      DPSM Official Mascot
                    </span>
                    <span className="text-xs font-bold text-white">Chief Aura Officer</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-white/[0.06] text-white text-[11px] font-bold border border-white/[0.08]">
                    +100K AURA
                  </div>
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

      {/* Podium Highlights */}
      {topThree.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">Current Podium</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                School <span className="aura-text">Aura</span> Champions
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((student, idx) => {
              const rank = idx + 1;
              const borderStyling =
                rank === 1
                  ? 'border-amber-400/40 bg-amber-500/[0.04]'
                  : rank === 2
                  ? 'border-slate-300/30 bg-slate-400/[0.04]'
                  : 'border-amber-700/30 bg-amber-700/[0.04]';

              return (
                <div
                  key={student.id}
                  className={`rounded-2xl p-5 border ${borderStyling} bg-[#0c0d14] flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-black text-base text-white">
                      #{rank}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-snug">{student.student_name}</h4>
                      <p className="text-xs text-neutral-400">Official Victories</p>
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

      {/* Active & Scheduled Battles */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">Arena Matches</span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Current & Upcoming <span className="aura-text">Aura</span> Battles
            </h2>
          </div>
          <Link
            href="/battles"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-neutral-200 border border-white/[0.08]"
          >
            <span>View All Battles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeBattles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeBattles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center max-w-md mx-auto bg-[#0c0d14] border border-white/[0.08]">
            <Swords className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No Public Battles Active</h4>
            <p className="text-xs text-neutral-400 mb-5">
              Submit the next clash to see it featured on the arena board!
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold"
            >
              <span>Submit a Battle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
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
