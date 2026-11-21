'use client';

import React, { useState } from 'react';
import { Battle, BattleCategory } from '@/types/database';
import BattleCard from '@/components/BattleCard';
import { Swords, Filter, ArrowUpDown } from 'lucide-react';

interface BattleFilterListProps {
  initialBattles: Battle[];
}

export default function BattleFilterList({ initialBattles }: BattleFilterListProps) {
  const [categoryFilter, setCategoryFilter] = useState<'All' | BattleCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

  const filteredBattles = initialBattles
    .filter((battle) => {
      if (categoryFilter !== 'All' && battle.category !== categoryFilter) return false;
      if (statusFilter === 'Active' && battle.status === 'Completed') return false;
      if (statusFilter === 'Completed' && battle.status !== 'Completed') return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.04] overflow-x-auto">
          {(['All', 'Aura Battle', 'Mog Battle'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {cat === 'All' ? 'All Battles' : cat === 'Aura Battle' ? 'Aura Battles' : 'Mog Battles'}
            </button>
          ))}
        </div>

        {/* Status & Sorting Options */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#0e1118] border border-white/[0.08] text-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Upcoming & Live</option>
              <option value="Completed">Completed Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-[#0e1118] border border-white/[0.08] text-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid or Empty state */}
      {filteredBattles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBattles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <Swords className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No battles found</h3>
          <p className="text-sm text-neutral-400">
            There are currently no battles matching this filter criteria. Check back soon or submit a new clash!
          </p>
        </div>
      )}
    </div>
  );
}
