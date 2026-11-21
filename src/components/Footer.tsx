'use client';

import React from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-cyan-400 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#090b10] rounded-[7px] flex items-center justify-center">
                <Flame className="w-4 h-4 text-pink-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">
                <span className="aura-text">Aura</span> Battles
              </span>
              <p className="text-xs text-neutral-400">The premier school challenge & aura ranking arena.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/battles" className="hover:text-white transition-colors">Current Battles</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/submit" className="hover:text-white transition-colors">Submit Battle</Link>
            <Link href="/admin" className="hover:text-purple-400 transition-colors">Admin Portal</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Aura Arena. Built for positive school spirit, fun, and friendly hype.</p>
          <p className="flex items-center gap-1">
            Voluntary, respectful, and opt-in battles only.
          </p>
        </div>
      </div>
    </footer>
  );
}
