import React from 'react';
import Link from 'next/link';
import { PlusCircle, Swords, Flame, Sparkles } from 'lucide-react';
import { getApprovedBattles } from '@/lib/db';
import BattleFilterList from '@/components/BattleFilterList';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function BattlesPage() {
  const battles = await getApprovedBattles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 bg-[#000000] text-white">
      
      {/* Page Header (Scaled for Mobile) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-900">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ec008c] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ec008c] animate-pulse" />
            <span>DPSM Official Arena Arena</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Battle Arena.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-medium leading-relaxed">
            Follow active school clashes, cast predictions before match conclusion, and track who claims maximum peer respect.
          </p>
        </div>

        <Link
          href="/submit"
          className="rounded-full bg-white text-black px-5 py-2.5 text-xs font-black tracking-tight hover:bg-neutral-200 active:scale-95 transition-all self-start md:self-auto shadow-md shrink-0 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-[#ec008c]" />
          <span>Propose Match</span>
        </Link>
      </div>

      {/* Interactive Filter & Battle Cards */}
      <BattleFilterList initialBattles={battles} />

    </div>
  );
}
