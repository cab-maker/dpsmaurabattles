'use client';

import React, { useState } from 'react';
import { Flame, Sparkles, AlertCircle, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playUnlockSound, playDeniedSound } from '@/lib/sounds';

interface AuraEvent {
  title: string;
  points: number;
  icon: string;
}

const EVENTS: AuraEvent[] = [
  { title: 'Caught a falling bottle without looking', points: 250000, icon: '⚡' },
  { title: 'Held the door for 15 students in a row', points: 75000, icon: '🚪' },
  { title: 'Made the quiet kid laugh with a joke', points: 150000, icon: '🗿' },
  { title: 'Tripped on the auditorium stage', points: -500000, icon: '💀' },
  { title: 'Called the teacher "Mom" during roll call', points: -1000000, icon: '😭' },
  { title: 'Left on read after sending "hey"', points: -150000, icon: '📭' },
  { title: 'Unbroken mewing streak since 8:00 AM', points: 500000, icon: '🤫' },
  { title: 'Walked into class right on the bell ring', points: 100000, icon: '⏱️' },
  { title: 'Waved at someone who was waving behind you', points: -350000, icon: '👋' },
];

export default function AuraCalculator() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleEvent = (index: number) => {
    setSelected((prev) => {
      const exists = prev.includes(index);
      const updated = exists ? prev.filter((i) => i !== index) : [...prev, index];
      const ev = EVENTS[index];
      if (!exists) {
        if (ev.points > 0) playUnlockSound();
        else playDeniedSound();
      }
      return updated;
    });
  };

  const totalAura = selected.reduce((sum, idx) => sum + EVENTS[idx].points, 0);

  const getTier = (pts: number) => {
    if (pts >= 1000000) return { title: 'INFINITE AURA DEITY', color: 'text-[#ec008c]', desc: 'School legend. Teachers ask you for hall passes.' };
    if (pts >= 300000) return { title: 'CERTIFIED MOGGER', color: 'text-purple-400', desc: 'Walking aura radiation. Hallways part when you stroll.' };
    if (pts > 0) return { title: 'STABLE AURA SURPLUS', color: 'text-emerald-400', desc: 'Positive reputation. You are safe from immediate embarrassment.' };
    if (pts === 0) return { title: 'NEUTRAL SPECTATOR', color: 'text-neutral-400', desc: 'Select your recent deeds to test your school standing.' };
    if (pts > -500000) return { title: 'MILD AURA DEFICIT', color: 'text-amber-400', desc: 'Recoverable damage. Do not look in any mirrors today.' };
    return { title: 'CRITICAL AURA BANKRUPTCY', color: 'text-red-500', desc: 'Bro lost all his aura. Consider transferring schools.' };
  };

  const tier = getTier(totalAura);

  const handleCelebrate = () => {
    if (totalAura > 0) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ec008c', '#ffffff', '#a855f7'],
      });
      playUnlockSound();
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] border border-neutral-900 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-neutral-900">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ec008c] block mb-1">
            Student Diagnostic Tool
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Daily Aura Calculator.
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
            Select what happened to you today to calculate your official school standing.
          </p>
        </div>

        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Grid of Meme Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {EVENTS.map((item, idx) => {
          const isSelected = selected.includes(idx);
          const isPositive = item.points > 0;
          return (
            <button
              key={item.title}
              onClick={() => toggleEvent(idx)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isPositive
                    ? 'bg-[#ec008c]/10 border-[#ec008c] shadow-[0_0_15px_rgba(236,0,140,0.15)]'
                    : 'bg-red-950/20 border-red-700/60 shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                  : 'bg-black border-neutral-900 hover:border-neutral-800 hover:bg-neutral-950'
              }`}
            >
              <div className="flex items-start gap-2.5 mb-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-neutral-200 leading-snug">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-900/60">
                <span
                  className={`text-xs font-mono font-black ${
                    isPositive ? 'text-[#ec008c]' : 'text-red-400'
                  }`}
                >
                  {isPositive ? `+${item.points.toLocaleString()}` : item.points.toLocaleString()} AURA
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? isPositive
                        ? 'bg-[#ec008c] text-white'
                        : 'bg-red-600 text-white'
                      : 'bg-neutral-900 text-neutral-500'
                  }`}
                >
                  {isSelected ? 'ACTIVE' : 'ADD'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Total Score & Rating Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-black border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-1">
            Current Standing
          </span>
          <div className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white">
            {totalAura > 0 ? `+${totalAura.toLocaleString()}` : totalAura.toLocaleString()}{' '}
            <span className="text-lg font-sans font-bold text-neutral-500">AURA</span>
          </div>
          <div className={`text-sm sm:text-base font-black mt-2 tracking-wide uppercase ${tier.color}`}>
            {tier.title}
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-md">{tier.desc}</p>
        </div>

        {totalAura > 0 && (
          <button
            onClick={handleCelebrate}
            className="rounded-full bg-white text-black hover:bg-neutral-200 px-6 py-3 text-xs font-black tracking-tight transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#ec008c]" />
            <span>Flex Your Aura</span>
          </button>
        )}
      </div>

    </div>
  );
}
