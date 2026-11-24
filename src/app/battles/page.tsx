import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getApprovedBattles } from '@/lib/db';
import BattleFilterList from '@/components/BattleFilterList';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function BattlesPage() {
  const battles = await getApprovedBattles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 bg-[#000000] text-white">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 pb-8 border-b border-neutral-900">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ec008c] block mb-2">
            The Arena Board
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
            Battles.
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-3 max-w-xl font-medium">
            Watch official school match-ups, explore sanctioned arena locations, and follow who walked away with maximum aura.
          </p>
        </div>

        <Link
          href="/submit"
          className="rounded-full bg-white text-black px-6 py-3 text-xs font-black tracking-tight hover:bg-neutral-200 transition-all self-start md:self-auto shadow-md"
        >
          Submit New Battle
        </Link>
      </div>

      {/* Interactive Filter & Battle Cards */}
      <BattleFilterList initialBattles={battles} />

    </div>
  );
}
