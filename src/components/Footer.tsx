'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on full-screen chat and call routes
  if (pathname === '/gc' || pathname === '/call') {
    return null;
  }

  return (
    <footer className="border-t border-neutral-900 bg-[#000000] mt-32 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Large Statement Branding */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 pb-12 border-b border-neutral-900">
          <div>
            <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#ec008c]">
              Aura
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tighter text-white">
              Battles.
            </span>
            <p className="mt-3 text-sm text-neutral-500 max-w-sm font-medium">
              DPSM&apos;s sanctioned arena for peer challenges, live showdowns, and official aura rankings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold tracking-tight text-neutral-400">
            <Link href="/battles" className="hover:text-white transition-colors">Battles</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/gc" className="hover:text-white transition-colors">Group Chat</Link>
            <Link href="/call" className="hover:text-white transition-colors">Call Arena</Link>
            <Link href="/submit" className="hover:text-white transition-colors">Submit</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>

        {/* Bottom subtle copyright and statement */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 font-medium">
          <p>© 2026 DPSM Aura Battles. All rights reserved.</p>
          <p className="text-neutral-500">Built for positive school spirit, peer hype, and respectful competition.</p>
        </div>

      </div>
    </footer>
  );
}
