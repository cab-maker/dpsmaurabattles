import React from 'react';
import Link from 'next/link';
import { Swords, PlusCircle } from 'lucide-react';
import { getApprovedBattles } from '@/lib/db';
import BattleFilterList from '@/components/BattleFilterList';


export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function BattlesPage() {
  const battles = await getApprovedBattles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">
            The Arena Board
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-1">
            Current & Completed <span className="aura-text">Aura</span> Battles
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl">
            Watch official school match-ups, see sanctioned arena locations, and follow who walked away with maximum aura.
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-purple-500/20 active:scale-95 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit New Battle</span>
        </Link>
      </div>

      {/* Interactive Filter & Battle Cards */}
      <BattleFilterList initialBattles={battles} />

    </div>
  );
}
