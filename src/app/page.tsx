import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swords, Trophy, ArrowRight, Flame, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { getPublicAnnouncements, getApprovedBattles, getLeaderboard } from '@/lib/db';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import BattleCard from '@/components/BattleCard';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function HomePage() {
  const [announcements, battles, leaderboard] = await Promise.all([
    getPublicAnnouncements(),
    getApprovedBattles(),
    getLeaderboard(),
  ]);

  const activeBattles = battles.filter((b) => b.status === 'Live' || b.status === 'Upcoming').slice(0, 6);
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#000000] text-white selection:bg-[#ec008c] selection:text-white">
      
      {/* ================= HUGE INC HERO SECTION ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-20 relative">
        <div className="relative w-full min-h-[500px] sm:min-h-[640px] flex flex-col justify-end">
          
          {/* Centered / Right-Aligned 3D Inflated Foil Aura Mascot & Letterpiece */}
          <div className="absolute top-0 right-0 left-0 sm:left-auto sm:right-6 flex justify-center sm:justify-end items-center pointer-events-none select-none z-0">
            <div className="relative w-[300px] sm:w-[460px] md:w-[540px] aspect-square flex items-center justify-center">
              
              {/* Hot pink ambient lighting glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ec008c]/25 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-70 animate-pulse" />

              {/* Realistic 3D Puffy Inflated Metallic Foil 'A' with Silver Foil Crinkle Border */}
              <div className="relative w-64 h-72 sm:w-84 sm:h-96 md:w-96 md:h-110 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 220"
                  className="w-full h-full drop-shadow-[0_20px_50px_rgba(236,0,140,0.4)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Metallic Silver Crinkled Foil Edge Gradient */}
                    <linearGradient id="crinkleSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f5f5f5" />
                      <stop offset="20%" stopColor="#a3a3a3" />
                      <stop offset="40%" stopColor="#ffffff" />
                      <stop offset="60%" stopColor="#737373" />
                      <stop offset="80%" stopColor="#e5e5e5" />
                      <stop offset="100%" stopColor="#525252" />
                    </linearGradient>

                    {/* Deep Quilted Hot-Pink Fabric Gradient */}
                    <radialGradient id="quiltedPink" cx="50%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#ff40a4" />
                      <stop offset="45%" stopColor="#ec008c" />
                      <stop offset="85%" stopColor="#9b0058" />
                      <stop offset="100%" stopColor="#5c0034" />
                    </radialGradient>

                    {/* Specular Highlight */}
                    <linearGradient id="foilHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </linearGradient>

                    <filter id="puffyDepth" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                      <feOffset dx="0" dy="8" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.4" />
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer Inflated Silver Foil Border */}
                  <path
                    d="M 100 12 L 182 195 C 185 202 178 208 170 208 L 140 208 C 135 208 130 204 128 199 L 118 170 L 82 170 L 72 199 C 70 204 65 208 60 208 L 30 208 C 22 208 15 202 18 195 L 100 12 Z"
                    fill="url(#crinkleSilver)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#puffyDepth)"
                  />

                  {/* Inner Quilted Hot Pink Pillow Fabric */}
                  <path
                    d="M 100 24 L 170 193 C 172 197 168 200 164 200 L 142 200 C 139 200 136 198 135 195 L 123 162 L 77 162 L 65 195 C 64 198 61 200 58 200 L 36 200 C 32 200 28 197 30 193 L 100 24 Z"
                    fill="url(#quiltedPink)"
                  />

                  {/* Triangular Cutout In Inflated 'A' */}
                  <path
                    d="M 100 70 L 114 135 L 86 135 Z"
                    fill="#000000"
                    stroke="url(#crinkleSilver)"
                    strokeWidth="4"
                  />

                  {/* Quilted Creases & Balloon Seams */}
                  <path d="M 100 28 L 100 68" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 55 162 L 78 162" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" />
                  <path d="M 122 162 L 145 162" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" />
                  <path d="M 75 110 C 85 115 115 115 125 110" stroke="#ff85c8" strokeOpacity="0.4" strokeWidth="3" />
                  <circle cx="100" cy="55" r="3" fill="#ffffff" opacity="0.8" />
                  <circle cx="70" cy="140" r="2.5" fill="#ffffff" opacity="0.6" />
                  <circle cx="130" cy="140" r="2.5" fill="#ffffff" opacity="0.6" />
                </svg>

                {/* DPSM Mascot Floating Badge */}
                <div className="absolute -bottom-2 -left-6 sm:-left-10 w-24 sm:w-32 aspect-square rounded-2xl border-2 border-neutral-800 bg-[#0a0a0a] p-1.5 shadow-2xl overflow-hidden pointer-events-auto transform hover:scale-105 transition-transform duration-300">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-900">
                    <Image
                      src="/monkey.png"
                      alt="DPSM Aura Mascot"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 120px, 150px"
                    />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Foreground Huge Statement: "Hello." + "At this point, we should battle. Let's do it." */}
          <div className="relative z-10 max-w-2xl mt-36 sm:mt-48 pb-4">
            
            {/* Massive "Hello." */}
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white leading-none">
              Hello.
            </h1>

            {/* Sub-headline: "At this point, we should battle. Let's do it." */}
            <div className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>At this point, we should battle.</span>
              <Link
                href="/submit"
                className="text-white underline decoration-white decoration-[3px] underline-offset-8 hover:text-[#ec008c] hover:decoration-[#ec008c] transition-colors inline-block"
              >
                Let&apos;s do it.
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ================= HUGE INC MASSIVE TYPOGRAPHY STATEMENT SECTION ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-20 sm:pb-32 border-t border-neutral-900">
        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.92] text-[#d4d4d8]">
          We make battles that <br className="hidden sm:inline" />
          matter to <span className="text-[#ec008c]">aura.</span>
        </h2>
      </section>

      {/* ================= HUGE INC TWO-COLUMN EDITORIAL SECTION ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 pb-24 sm:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Big Editorial Muted Paragraph */}
          <div className="lg:col-span-7">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#45454c] leading-[1.2] max-w-xl">
              Anyone can talk. Creating showdowns that resonate with school spirit and peer respect is the hard part. It takes courage, aura and human energy.
            </p>
          </div>

          {/* Right Column: Sleek Editorial Arrow Links List */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            <Link
              href="/battles"
              className="group flex items-center justify-between py-2 text-base sm:text-lg font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-3"
            >
              <span>See the work and battles.</span>
              <span className="text-xl transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/leaderboard"
              className="group flex items-center justify-between py-2 text-base sm:text-lg font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-3"
            >
              <span>Discover our top champions.</span>
              <span className="text-xl transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/gc"
              className="group flex items-center justify-between py-2 text-base sm:text-lg font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-3"
            >
              <span>Student direct group chat.</span>
              <span className="text-xl transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/call"
              className="group flex items-center justify-between py-2 text-base sm:text-lg font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-3"
            >
              <span>Live 10X call arena.</span>
              <span className="text-xl transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/submit"
              className="group flex items-center justify-between py-2 text-base sm:text-lg font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-3"
            >
              <span>Want to challenge someone?</span>
              <span className="text-xl transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/admin"
              className="group flex items-center justify-between py-2 text-base sm:text-lg font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-3"
            >
              <span>Official admin portal.</span>
              <span className="text-xl transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

          </div>

        </div>

        {/* The Signature Huge Inc Floating Pill CTA Button Centered */}
        <div className="mt-16 sm:mt-24 flex justify-center">
          <Link
            href="/battles"
            className="huge-pill-glass inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-black tracking-tight"
          >
            <span>See the full arena</span>
          </Link>
        </div>

      </section>

      {/* ================= ANNOUNCEMENTS ================= */}
      {announcements.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <AnnouncementBanner announcements={announcements} />
        </section>
      )}

      {/* ================= PODIUM HIGHLIGHTS (HUGE INC MINIMALIST) ================= */}
      {topThree.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-neutral-900">
            <div>
              <span className="text-xs font-bold text-[#ec008c] tracking-widest uppercase block mb-1">
                Aura Leaders
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                School Champions.
              </h3>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 group"
            >
              <span>Full Leaderboard</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {topThree.map((student, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={student.id}
                  className="rounded-2xl p-6 bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-black border border-neutral-800 flex items-center justify-center font-black text-lg text-white group-hover:border-[#ec008c] transition-colors">
                      #{rank}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base sm:text-lg tracking-tight">
                        {student.student_name}
                      </h4>
                      <p className="text-xs text-neutral-500 font-medium">Official Victories</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#ec008c]">
                      {student.total_wins}
                    </span>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-500">
                      Wins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= ACTIVE BATTLES LIST ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mb-24">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-neutral-900">
          <div>
            <span className="text-xs font-bold text-[#ec008c] tracking-widest uppercase block mb-1">
              Active Showdowns
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Current Battles.
            </h3>
          </div>
          <Link
            href="/battles"
            className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {activeBattles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBattles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-12 text-center bg-[#0a0a0a] border border-neutral-900 max-w-lg mx-auto">
            <Swords className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <h4 className="text-lg font-black text-white mb-1">No Active Battles Listed</h4>
            <p className="text-xs text-neutral-500 mb-6 font-medium">
              Be the first to step into the arena and propose the next match.
            </p>
            <Link
              href="/submit"
              className="rounded-full bg-white text-black px-6 py-2.5 text-xs font-black hover:bg-neutral-200 transition-all shadow-md inline-block"
            >
              Submit a Battle
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
