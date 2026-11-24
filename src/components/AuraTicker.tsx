'use client';

import React from 'react';

const TICKER_ITEMS = [
  '🚨 AURA BATTLES CORP DIRECTIVE: HYPERGAMY IS BAD • EQUAL RESPECT FOR ALL CONTENDERS',
  '👑 DPSM OFFICIAL ARENA SHOWDOWNS • SANCTIONED MATCHES ONLY',
  '⚡ +1,000,000 AURA: Walking into class during the final bell chime',
  '🚫 NO SKEWED CONCENTRATION VECTORS • AUTHENTIC CHARISMA & ENERGY ONLY',
  '🏆 UNCONTESTED MOG BATTLE CHAMPIONS ON THE OFFICIAL LEADERBOARD',
  '🗿 +500,000 AURA: Maintaining unbroken eye contact with the vice principal',
  '🔥 PEAK ARENA CLASHES: VOLUNTARY, RESPECTFUL, AND HIGH VIBE',
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
