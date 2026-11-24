import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swords, Trophy, ArrowRight, Flame, Zap, ShieldAlert, Sparkles, AlertTriangle, Calendar } from 'lucide-react';
import { getPublicAnnouncements, getApprovedBattles, getLeaderboard } from '@/lib/db';
import AnnouncementPopup from '@/components/AnnouncementPopup';
import AuraTicker from '@/components/AuraTicker';
import { formatScheduledDate } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function HomePage() {
  const [announcements, battles, leaderboard] = await Promise.all([
    getPublicAnnouncements(),
    getApprovedBattles(),
    getLeaderboard(),
  ]);

  const liveBattles = battles.filter((b) => b.status === 'Live');
  const featuredBattle = liveBattles[0] || battles[0];
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#000000] text-white selection:bg-[#ec008c] selection:text-white">
      
      {/* Interactive Announcement Popup Dialog */}
      <AnnouncementPopup announcements={announcements} />

      {/* ================= HERO SECTION (OPTIMIZED FOR MOBILE & CLEAN DESKTOP) ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-14 sm:pb-20 relative">
        <div className="relative w-full min-h-[380px] sm:min-h-[500px] flex flex-col justify-end">
          
          {/* Centered / Right-Aligned 3D Inflated Foil Aura Mascot & Letterpiece (Scaled for Mobile) */}
          <div className="absolute top-0 right-0 left-0 sm:left-auto sm:right-4 flex justify-center sm:justify-end items-center pointer-events-none select-none z-0">
            <div className="relative w-[240px] sm:w-[380px] md:w-[460px] aspect-square flex items-center justify-center">
              
              {/* Hot pink ambient lighting glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ec008c]/25 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-70 animate-pulse" />

              {/* Realistic 3D Puffy Inflated Metallic Foil 'A' with Silver Foil Crinkle Border */}
              <div className="relative w-48 h-56 sm:w-72 sm:h-84 md:w-80 md:h-96 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 220"
                  className="w-full h-full drop-shadow-[0_15px_40px_rgba(236,0,140,0.35)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="crinkleSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f5f5f5" />
                      <stop offset="20%" stopColor="#a3a3a3" />
                      <stop offset="40%" stopColor="#ffffff" />
                      <stop offset="60%" stopColor="#737373" />
                      <stop offset="80%" stopColor="#e5e5e5" />
                      <stop offset="100%" stopColor="#525252" />
                    </linearGradient>

                    <radialGradient id="quiltedPink" cx="50%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#ff40a4" />
                      <stop offset="45%" stopColor="#ec008c" />
                      <stop offset="85%" stopColor="#9b0058" />
                      <stop offset="100%" stopColor="#5c0034" />
                    </radialGradient>

                    <filter id="puffyDepth" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                      <feOffset dx="0" dy="6" result="offsetblur" />
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
                    strokeWidth="3.5"
                  />

                  {/* Quilted Creases & Balloon Seams */}
                  <path d="M 100 28 L 100 68" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 55 162 L 78 162" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" />
                  <path d="M 122 162 L 145 162" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" />
                  <circle cx="100" cy="55" r="3" fill="#ffffff" opacity="0.8" />
                  <circle cx="70" cy="140" r="2.5" fill="#ffffff" opacity="0.6" />
                  <circle cx="130" cy="140" r="2.5" fill="#ffffff" opacity="0.6" />
                </svg>

                {/* DPSM Mascot Floating Badge */}
                <div className="absolute -bottom-1 -left-4 sm:-left-8 w-20 sm:w-28 aspect-square rounded-2xl border-2 border-neutral-800 bg-[#0a0a0a] p-1 shadow-2xl overflow-hidden pointer-events-auto transform hover:scale-105 transition-transform duration-300">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-900">
                    <Image
                      src="/monkey.png"
                      alt="DPSM Aura Mascot"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100px, 130px"
                    />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Foreground Statement: "Hello." + "At this point, we should battle. Let's do it." */}
          <div className="relative z-10 max-w-xl mt-24 sm:mt-36 pb-2">
            
            {/* Scaled-down mobile-friendly "Hello." */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
              Hello.
            </h1>

            {/* Sub-headline */}
            <div className="mt-3 sm:mt-5 text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>At this point, we should battle.</span>
              <Link
                href="/submit"
                className="text-white underline decoration-white decoration-[3px] underline-offset-4 sm:underline-offset-8 hover:text-[#ec008c] hover:decoration-[#ec008c] transition-colors inline-block"
              >
                Let&apos;s do it.
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ================= AURA TICKER (LIVE MARQUEE) ================= */}
      <section className="w-full">
        <AuraTicker />
      </section>

      {/* ================= MASSIVE TYPOGRAPHY STATEMENT (BALANCED MOBILE SCALE) ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 sm:pb-24">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02] text-[#d4d4d8]">
          We make battles that <br className="hidden sm:inline" />
          matter to <span className="text-[#ec008c]">aura.</span>
        </h2>
      </section>

      {/* ================= EDITORIAL TWO-COLUMN SECTION ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Editorial Muted Paragraph */}
          <div className="lg:col-span-7">
            <p className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-[#52525b] leading-[1.25] max-w-xl">
              Anyone can talk. Creating showdowns that resonate with school spirit and peer respect is the hard part. It takes courage, aura and human energy.
            </p>
          </div>

          {/* Right Column: Sleek Editorial Arrow Links List */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            
            <Link
              href="/battles"
              className="group flex items-center justify-between py-2 text-sm sm:text-base font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-2.5"
            >
              <span>See the arena battles board.</span>
              <span className="text-base sm:text-lg transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/leaderboard"
              className="group flex items-center justify-between py-2 text-sm sm:text-base font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-2.5"
            >
              <span>Discover school champions.</span>
              <span className="text-base sm:text-lg transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/gc"
              className="group flex items-center justify-between py-2 text-sm sm:text-base font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-2.5"
            >
              <span>Direct student group chat.</span>
              <span className="text-base sm:text-lg transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/call"
              className="group flex items-center justify-between py-2 text-sm sm:text-base font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-2.5"
            >
              <span>Live 10X call arena.</span>
              <span className="text-base sm:text-lg transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/memes"
              className="group flex items-center justify-between py-2 text-sm sm:text-base font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-2.5"
            >
              <span>Hypergamy directive & memes vault.</span>
              <span className="text-base sm:text-lg transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

            <Link
              href="/submit"
              className="group flex items-center justify-between py-2 text-sm sm:text-base font-bold text-neutral-400 hover:text-white transition-colors duration-150 border-b border-neutral-900 pb-2.5"
            >
              <span>Propose a new battle.</span>
              <span className="text-base sm:text-lg transform group-hover:translate-x-2 transition-transform duration-200 text-neutral-500 group-hover:text-[#ec008c]">
                →
              </span>
            </Link>

          </div>

        </div>

        {/* Floating Pill CTA Button Centered */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <Link
            href="/battles"
            className="huge-pill-glass inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-black tracking-tight"
          >
            <span>Explore all arena battles ({battles.length})</span>
          </Link>
        </div>

      </section>

      {/* ================= DIRECTIVE & MEMES SPOTLIGHT ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#180308] via-[#0d0d0d] to-[#0a0a0a] border-2 border-red-700/60 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-700 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              DIRECTIVE #001 • TOP PRIORITY
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              HYPERGAMY IS BAD.
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[#ec008c] mt-1 uppercase">
              AURA BATTLES CORP IS STRICTLY AGAINST HYPERGAMY.
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 mt-3 font-medium leading-relaxed">
              We condemn skewed concentration vectors where majority attention is funneled into artificial inequality. Explore the full directive breakdown and spin the 3D Meme Orbit Arena on our dedicated memes page.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/memes"
                className="rounded-full bg-white text-black hover:bg-neutral-200 px-6 py-3 text-xs font-black tracking-tight transition-all active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                <span>View Directive & 3D Meme Orbit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* High-Contrast White Background Card for Diagram Visibility */}
          <div className="w-full max-w-[210px] sm:max-w-[240px] rounded-3xl p-4 bg-white border-2 border-neutral-200 shadow-2xl flex flex-col items-center shrink-0">
            <div className="text-center mb-1.5">
              <span className="text-[9px] font-mono font-black text-neutral-600 uppercase">
                Figure 1.0 Breakdown
              </span>
            </div>
            <div className="relative w-full aspect-[1/1.7] bg-white">
              <Image
                src="/memes/hypergamy.png"
                alt="Hypergamy diagram - clear visibility with black arrows"
                fill
                priority
                className="object-contain"
                sizes="240px"
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-red-600 uppercase mt-1.5 text-center">
              Divergence Vector
            </span>
          </div>
        </div>
      </section>

      {/* ================= SPOTLIGHT FEATURED BATTLE (TEASER LINKING TO /battles) ================= */}
      {featuredBattle && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
          <div className="rounded-3xl p-6 sm:p-10 bg-[#0a0a0a] border border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ec008c]/20 text-[#ec008c] border border-[#ec008c]/30">
                  <Flame className="w-3.5 h-3.5" />
                  {featuredBattle.category}
                </span>
                {featuredBattle.scheduled_at ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight bg-white/[0.08] border border-white/[0.12] text-white">
                    <Calendar className="w-3.5 h-3.5 text-[#ec008c]" />
                    <span>{formatScheduledDate(featuredBattle.scheduled_at)}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <span>Date TBA</span>
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {featuredBattle.person_one} <span className="text-neutral-500 font-normal">vs</span> {featuredBattle.person_two}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">
                {featuredBattle.description || 'Step into the dedicated battles page to cast your prediction and see the live vote ratio.'}
              </p>
            </div>

            <Link
              href="/battles"
              className="rounded-full bg-white text-black hover:bg-neutral-200 px-7 py-3.5 text-xs sm:text-sm font-black tracking-tight transition-all shadow-md shrink-0 active:scale-95 flex items-center gap-2"
            >
              <span>Go to Battles Arena</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ================= SCHOOL AURA CHAMPIONS (PODIUM) ================= */}
      {topThree.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
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
              <span>Full Standings</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {topThree.map((student, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={student.id}
                  className="rounded-2xl p-5 sm:p-6 bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-black border border-neutral-800 flex items-center justify-center font-black text-base text-white group-hover:border-[#ec008c] transition-colors">
                      #{rank}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base tracking-tight">
                        {student.student_name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium">Official Victories</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#ec008c]">
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

    </div>
  );
}
