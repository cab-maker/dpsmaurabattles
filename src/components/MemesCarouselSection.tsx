'use client';

import React from 'react';
import Image from 'next/image';
import { Meme } from '@/types/database';
import CircularCarousel, { CarouselItem } from '@/components/CircularCarousel';
import { ShieldAlert, AlertTriangle, Flame, Sparkles } from 'lucide-react';

interface MemesCarouselSectionProps {
  memes: Meme[];
}

export default function MemesCarouselSection({ memes }: MemesCarouselSectionProps) {
  // Convert memes to CarouselItem format
  const carouselItems: CarouselItem[] = (memes && memes.length > 0 ? memes : []).map((m) => ({
    src: m.image_url,
    alt: m.title,
    title: m.title,
    subtitle: m.subtitle || m.caption || undefined,
  }));

  // Ensure hypergamy is always in the items if not already present
  if (!carouselItems.some((item) => item.src.includes('hypergamy'))) {
    carouselItems.unshift({
      src: '/memes/hypergamy.png',
      alt: 'Hypergamy Diagram',
      title: 'Hypergamy Is Bad',
      subtitle: 'Aura Battles Corp Is Strictly Against It',
    });
  }

  return (
    <div className="w-full">
      
      {/* ================= OFFICIAL ANTI-HYPERGAMY DECLARATION ================= */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#140206] via-[#0a0a0a] to-[#0a0a0a] border-2 border-red-700/50 shadow-2xl relative overflow-hidden mb-12">
        
        {/* Warning Accent Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-[10px] font-mono font-black uppercase tracking-wider text-red-300 mb-4">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>OFFICIAL AURA BATTLES CORP DIRECTIVE #001</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Bold Anti-Hypergamy Text */}
          <div className="md:col-span-7">
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              HYPERGAMY IS BAD.
            </h3>
            <p className="text-sm sm:text-base font-black text-[#ec008c] mt-2 uppercase tracking-wide">
              AURA BATTLES CORP IS STRICTLY AGAINST HYPERGAMY.
            </p>
            
            <p className="text-xs sm:text-sm text-neutral-300 mt-4 leading-relaxed font-medium">
              The diagram illustrates the artificial consolidation where the majority chases a tiny minority, completely dismantling genuine respect, peer loyalty, and natural school equilibrium.
            </p>

            <div className="mt-5 p-3.5 rounded-2xl bg-black/70 border border-red-900/50 text-xs text-neutral-400 leading-relaxed font-mono">
              <strong className="text-white">OUR STANCE:</strong> In the Aura Arena, value is earned through voluntary showdowns, peer spirit, and authentic charisma—never skewed disparity. Everyone deserves equal respect.
            </div>
          </div>

          {/* Right Column: The Hypergamy Evidence Diagram */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[260px] aspect-[1/2] rounded-2xl overflow-hidden bg-black border border-neutral-800 p-2 shadow-2xl">
              <Image
                src="/memes/hypergamy.png"
                alt="Hypergamy Diagram - Aura Battles Corp Condemnation"
                fill
                priority
                className="object-contain p-2"
                sizes="(max-width: 768px) 260px, 300px"
              />
            </div>
            <span className="text-[10px] font-mono text-neutral-500 mt-2 text-center uppercase tracking-wider">
              FIG 1.0: THE HYPERGAMY CONCENTRATION VECTOR
            </span>
          </div>

        </div>
      </div>

      {/* ================= 3D CIRCULAR CAROUSEL FROM REACT BITS ================= */}
      <div className="rounded-3xl p-6 sm:p-10 bg-[#0a0a0a] border border-neutral-900 overflow-hidden relative">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-neutral-900">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#ec008c] block mb-1">
              Admin & Community Memes
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Meme Orbit Arena.
            </h4>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Interactive 3D cylinder carousel. Drag or fling to spin through GIFs and memes posted by administrators.
            </p>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            {carouselItems.length} ITEMS LOADED
          </span>
        </div>

        {/* The React Bits Circular Carousel Container */}
        <div className="w-full h-[460px] sm:h-[540px] relative select-none">
          <CircularCarousel
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            cardWidth={220}
            aspectRatio={1}
            speed={12}
            captions={true}
            draggable={true}
            pauseOnHover={true}
            fadeColor="#0a0a0a"
          />
        </div>

        {/* Carousel Hint */}
        <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>DRAG OR FLING TO ROTATE</span>
          <span className="text-[#ec008c]">AURA BATTLES CORP MEME VAULT</span>
        </div>
      </div>

    </div>
  );
}
