'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Sparkles, ExternalLink, Flame, Zap, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuraVideoSectionProps {
  compact?: boolean;
}

export default function AuraVideoSection({ compact = false }: AuraVideoSectionProps) {
  return (
    <div className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-[#111116] via-[#0a0a0d] to-[#070709] border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
      
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ec008c]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ec008c]/15 border border-[#ec008c]/40 text-[#ec008c] text-[11px] font-mono font-black uppercase tracking-wider shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-[#ec008c]" />
          <span>OFFICIAL AURA SYLLABUS • REQUIRED VIEWING</span>
        </div>

        <a
          href="https://www.youtube.com/watch?v=5ctTVpQstC0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <span>Watch on YouTube</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#ec008c]" />
        </a>
      </div>

      {/* Main Grid: Video Player + Educational Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left: Responsive Video Embed */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-neutral-800 group hover:border-[#ec008c]/50 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-black">
            <iframe
              src="https://www.youtube.com/embed/5ctTVpQstC0?rel=0&modestbranding=1"
              title="Lessons in Meme Culture — Aura Farm Battles Are Here"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full border-0 absolute inset-0"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono px-1 gap-2">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-[#ec008c]" />
              <strong>Author:</strong> Lessons in Meme Culture (LIMC)
            </span>
            <a
              href="https://www.youtube.com/watch?v=5ctTVpQstC0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ec008c] hover:underline font-bold flex items-center gap-1 shrink-0"
            >
              <span>Watch directly on YouTube (5ctTVpQstC0) ↗</span>
            </a>
          </div>
        </div>

        {/* Right: Educational Explainer Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Aura Farm Battles Are Here.
            </h3>
            <p className="text-xs sm:text-sm text-[#ec008c] font-bold uppercase tracking-wider mt-1">
              The Definitive Science & Lore Behind Aura Ranking
            </p>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
            In this official educational briefing, <strong>Lessons in Meme Culture</strong> deconstructs how intangible social charisma, anime energy dynamics, and hallway standoff rituals solidified into the modern phenomenon of <em>Aura Battles</em>.
          </p>

          {/* Curriculum Points */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-[#ec008c]/20 text-[#ec008c] shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Quantified Aura Ledger</h4>
                <p className="text-neutral-400 mt-0.5">
                  Every action has an aura coefficient—flawless saves grant +1,000,000 aura, while stumbling or fumbling drains critical aura balance.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Hallway Farm Battles</h4>
                <p className="text-neutral-400 mt-0.5">
                  Two contenders lock eyes without speaking; bystanders judge poise, jawline, posture, and sheer presence to determine who mogs whom.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Ethical School Battles Only</h4>
                <p className="text-neutral-400 mt-0.5">
                  Our arena enforces consensual, respectful showdowns—no bullying or toxic disparity, standing firmly in line with our Anti-Hypergamy stance.
                </p>
              </div>
            </div>
          </div>

          {/* Action Link */}
          {!compact && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/battles"
                className="rounded-full bg-white text-black hover:bg-neutral-200 px-6 py-2.5 text-xs font-black tracking-tight transition-all active:scale-95 shadow-md inline-flex items-center gap-1.5"
              >
                <span>Put It Into Practice in Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/gc"
                className="rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-5 py-2.5 text-xs font-bold transition-all"
              >
                Discuss in /gc
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
