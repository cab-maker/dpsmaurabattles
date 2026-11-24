'use client';

import React from 'react';

const TICKER_ITEMS = [
  '⚡ +1,000,000 AURA: Walking into class during the final bell chime',
  '💀 -500,000 AURA: Waved at someone who was waving at the person behind you',
  '👑 +999,999 AURA: Getting nominated for the official DPSM Aura Battle',
  '🗿 +500,000 AURA: Maintaining unbroken eye contact with the principal',
  '😭 -1,000,000 AURA: Calling the teacher "Mom" during morning attendance',
  '🤫 +750,000 AURA: Perfect jawline mewing angle in school ID photo',
  '🔥 +100,000 AURA: Catching the water bottle before it hits the floor',
  '📭 -200,000 AURA: Left on delivered for 72 hours',
  '🏆 +5,000,000 AURA: Uncontested Mog Battle champion on the official leaderboard',
];

export default function AuraTicker() {
  return (
    <div className="w-full bg-[#0a0a0a] border-y border-neutral-900 py-3 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-mono font-bold tracking-wider text-neutral-300">
        {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span>{item}</span>
            <span className="text-neutral-700 font-bold">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
