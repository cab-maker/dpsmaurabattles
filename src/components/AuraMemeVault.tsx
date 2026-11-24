'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Flame, ShieldAlert, Award, Skull } from 'lucide-react';
import { playUnlockSound } from '@/lib/sounds';

interface MemeItem {
  id: string;
  title: string;
  tag: string;
  points: string;
  isPositive: boolean;
  desc: string;
  image: string;
}

const MEMES: MemeItem[] = [
  {
    id: '1',
    title: 'The Legendary Gain',
    tag: 'PEAK MOMENT',
    points: '+22,100 AURA',
    isPositive: true,
    desc: 'When you smoothly catch the eraser falling off the desk with zero hesitation.',
    image: '/memes/plus_aura.png',
  },
  {
    id: '2',
    title: 'Catastrophic Debt',
    tag: 'AURA BANKRUPT',
    points: '-5,000 AURA',
    isPositive: false,
    desc: 'Waving back enthusiastically at someone who was actually waving at the person behind you.',
    image: '/memes/minus_aura.jpg',
  },
  {
    id: '3',
    title: 'The 1,000,000 Strut',
    tag: 'ANIME EDIT',
    points: '+1,000,000 AURA',
    isPositive: true,
    desc: 'Handing in the math exam 30 minutes early and strolling out with hands in pockets.',
    image: '/memes/one_million_aura.gif',
  },
  {
    id: '4',
    title: 'Weak vs. Strong Aura',
    tag: 'ANCIENT CODEX',
    points: 'MINDSET',
    isPositive: true,
    desc: 'Weak Aura: Making excuses for being late. Strong Aura: Entering like you own the schedule.',
    image: '/memes/weak_vs_strong_aura.jpg',
  },
  {
    id: '5',
    title: 'Chief Aura Officer',
    tag: 'DPSM MASCOT',
    points: '+100,000 AURA',
    isPositive: true,
    desc: 'Official mascot of the arena. Generating unconditional school hype since day one.',
    image: '/monkey.png',
  },
];

export default function AuraMemeVault() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-neutral-900">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ec008c] block mb-1">
            Culture & Lore
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Aura Meme Vault.
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
            The hall of viral aura milestones, epic gains, and tragic school losses.
          </p>
        </div>
      </div>

      {/* Grid of Memes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MEMES.map((meme) => (
          <div
            key={meme.id}
            onClick={() => playUnlockSound()}
            className="group rounded-3xl p-4 bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-700 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Image Preview with Aspect Ratio */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-4 border border-neutral-900">
              <Image
                src={meme.image}
                alt={meme.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-white border border-white/10">
                  {meme.tag}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${
                    meme.isPositive
                      ? 'bg-[#ec008c] text-white shadow-md'
                      : 'bg-red-600 text-white shadow-md'
                  }`}
                >
                  {meme.points}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="px-1">
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-[#ec008c] transition-colors">
                {meme.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {meme.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>AURA ARCHIVE</span>
              <span className="text-[#ec008c] font-bold group-hover:translate-x-1 transition-transform">
                Click to hype →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
