import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicMemes } from '@/lib/db';
import CircularCarousel, { CarouselItem } from '@/components/CircularCarousel';
import AuraVideoSection from '@/components/AuraVideoSection';
import { AlertTriangle, Sparkles, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Meme Vault & Hypergamy Directive — Aura Battles Corp',
  description: 'Official Aura Battles Corp position on hypergamy and 3D interactive meme orbit arena.',
};

export default async function MemesPage() {
  const memes = await getPublicMemes();

  // Convert memes to CarouselItem format
  const carouselItems: CarouselItem[] = memes.map((m) => ({
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 bg-[#000000] text-white selection:bg-[#ec008c] selection:text-white">
      
      {/* ================= TOP SECTION: HYPERGAMY IS BAD (HIGH-CONTRAST WHITE CARD) ================= */}
      <section className="mb-16 sm:mb-24">
        <div className="rounded-3xl p-6 sm:p-12 bg-gradient-to-b from-[#180308] via-[#0d0d0d] to-[#0a0a0a] border-2 border-red-700/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
          
          {/* Top Status Alert Strip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950 border border-red-700 text-[10px] font-mono font-black uppercase tracking-wider text-red-300 mb-6 shadow-inner">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>AURA BATTLES CORP DIRECTIVE #001 • TOP PRIORITY</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Bold Stance */}
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]">
                HYPERGAMY <br />
                <span className="text-red-500 underline decoration-red-600 decoration-4 underline-offset-8">IS BAD.</span>
              </h1>

              <div className="mt-4 sm:mt-6 inline-block px-3 py-1.5 rounded-lg bg-[#ec008c]/20 border border-[#ec008c]/40 text-[#ec008c] text-xs sm:text-sm font-black tracking-wider uppercase">
                AURA BATTLES CORP IS STRICTLY AGAINST HYPERGAMY.
              </div>

              <p className="text-sm sm:text-base text-neutral-300 mt-5 leading-relaxed font-medium">
                The diagram on the right reveals the skewed 80/20 concentration phenomenon, where collective attention is artificially funneled to a fractional elite, destroying genuine school camaraderie, peer mutual respect, and natural social equilibrium.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-black/80 border border-neutral-800 text-xs text-neutral-300 font-mono leading-relaxed space-y-2">
                <p>
                  <strong className="text-white uppercase">OUR CORE PHILOSOPHY:</strong> In the Aura Arena, respect and aura must be <span className="text-[#ec008c] font-bold">earned</span> on a level playing field through voluntary showdowns, peer spirit, and authentic charisma—never skewed disparity.
                </p>
                <p className="text-neutral-400">
                  Aura Battles Corp stands for fair competition, high vibes, and unconditional peer dignity.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/battles"
                  className="rounded-full bg-white text-black hover:bg-neutral-200 px-6 py-2.5 text-xs font-black tracking-tight transition-all active:scale-95 shadow-md inline-flex items-center gap-2"
                >
                  <span>Step into the Fair Arena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/submit"
                  className="rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-5 py-2.5 text-xs font-bold transition-all"
                >
                  Propose a Respectful Clash
                </Link>
              </div>
            </div>

            {/* Right Column: The Hypergamy Evidence Diagram (WITH BRIGHT WHITE HIGH-CONTRAST CARD!) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* White card container so black arrows & dotted lines are 100% visible! */}
              <div className="w-full max-w-[300px] sm:max-w-[320px] rounded-3xl p-6 bg-white border-4 border-neutral-200 shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex flex-col items-center">
                <div className="text-center mb-3">
                  <span className="text-[10px] font-mono font-black text-neutral-700 uppercase tracking-widest block">
                    DOCUMENTED PHENOMENON
                  </span>
                  <span className="text-xs font-extrabold text-red-600">
                    Figure 1.0: Hypergamic Skew
                  </span>
                </div>

                <div className="relative w-full aspect-[1/2] rounded-xl overflow-hidden bg-white">
                  <Image
                    src="/memes/hypergamy.png"
                    alt="Hypergamy Diagram - Black arrows, pink female figures, cyan male figures"
                    fill
                    priority
                    className="object-contain"
                    sizes="320px"
                  />
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-200 w-full text-center">
                  <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase">
                    Notice: Black arrows show concentration vector
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-neutral-500 mt-3 text-center uppercase tracking-wider">
                AURA BATTLES CORP EVIDENCE EXHIBIT A
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ================= EDUCATIONAL DOSSIER: LESSONS IN MEME CULTURE VIDEO ================= */}
      <section className="mb-16 sm:mb-24">
        <AuraVideoSection />
      </section>

      {/* ================= MEMES SECTION: REACT BITS 3D CIRCULAR CAROUSEL ================= */}
      <section className="mb-20">
        <div className="rounded-3xl p-6 sm:p-12 bg-[#0a0a0a] border border-neutral-900 overflow-hidden relative">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-neutral-900">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ec008c]/20 text-[#ec008c] text-[10px] font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>React Bits Interactive 3D Component</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Meme Orbit Arena.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 font-medium max-w-xl">
                Cylinder 3D perspective carousel. Drag, throw, or fling with your mouse or finger to spin through community memes and admin-curated GIFs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white px-4 py-2 transition-all flex items-center gap-1.5"
              >
                <span>Admin Post Memes</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#ec008c]" />
              </Link>
            </div>
          </div>

          {/* 3D Circular Carousel from React Bits */}
          <div className="w-full h-[480px] sm:h-[560px] relative select-none">
            <CircularCarousel
              items={carouselItems}
              preset="cylinder"
              intro="rise"
              cardWidth={230}
              aspectRatio={1}
              speed={13}
              captions={true}
              draggable={true}
              pauseOnHover={true}
              fadeColor="#0a0a0a"
            />
          </div>

          {/* Carousel Hint & Status */}
          <div className="mt-4 pt-4 border-t border-neutral-900/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>DRAG / FLING OR SCROLL TO ROTATE</span>
            <span className="text-[#ec008c] font-bold">
              {carouselItems.length} ITEMS IN ACTIVE ROTATION
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
