'use client';

import React, { useState } from 'react';
import { Battle, BattleCategory } from '@/types/database';
import BattleCard from '@/components/BattleCard';
import { Swords, Filter, ArrowUpDown, Search, Flame, Zap, CheckCircle2 } from 'lucide-react';
import { playUnlockSound } from '@/lib/sounds';

interface BattleFilterListProps {
  initialBattles: Battle[];
}

export default function BattleFilterList({ initialBattles }: BattleFilterListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | BattleCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

  const filteredBattles = initialBattles
    .filter((battle) => {
      // Category filter
      if (categoryFilter !== 'All' && battle.category !== categoryFilter) return false;
      // Status filter
      if (statusFilter === 'Active' && battle.status === 'Completed') return false;
      if (statusFilter === 'Completed' && battle.status !== 'Completed') return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const p1 = battle.person_one.toLowerCase();
        const p2 = battle.person_two.toLowerCase();
        const desc = (battle.description || '').toLowerCase();
        const loc = (battle.location?.name || '').toLowerCase();
        if (!p1.includes(q) && !p2.includes(q) && !desc.includes(q) && !loc.includes(q)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const liveCount = initialBattles.filter((b) => b.status === 'Live').length;
  const upcomingCount = initialBattles.filter((b) => b.status === 'Upcoming').length;
  const completedCount = initialBattles.filter((b) => b.status === 'Completed').length;

  return (
    <div className="space-y-6">
      
      {/* Quick Arena Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-900 flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Total Matches
          </span>
          <span className="text-2xl font-black text-white mt-1">{initialBattles.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-900 flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ec008c]">
            Live Showdowns
          </span>
          <span className="text-2xl font-black text-[#ec008c] mt-1">{liveCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-900 flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
            Upcoming
          </span>
          <span className="text-2xl font-black text-amber-300 mt-1">{upcomingCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-900 flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
            Completed
          </span>
          <span className="text-2xl font-black text-neutral-300 mt-1">{completedCount}</span>
        </div>
      </div>

      {/* Interactive Search & Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-900 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contender name (e.g. Alex, Jordan)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black border border-neutral-800 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-[#ec008c] transition-colors"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black border border-neutral-900">
            {(['All', 'Aura Battle', 'Mog Battle'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  playUnlockSound();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tight transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#ec008c] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All' : cat === 'Aura Battle' ? 'Aura ⚡' : 'Mog 🔥'}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-black border border-neutral-800 text-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#ec008c]"
            >
              <option value="All">All Status</option>
              <option value="Active">Live & Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-black border border-neutral-800 text-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#ec008c]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>

      </div>

      {/* Battles Grid */}
      {filteredBattles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBattles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl p-16 text-center max-w-md mx-auto bg-[#0a0a0a] border border-neutral-900">
          <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
            <Swords className="w-6 h-6 text-neutral-500" />
          </div>
          <h3 className="text-base font-black text-white mb-1">No Matches Found</h3>
          <p className="text-xs text-neutral-500">
            {searchQuery
              ? `No battles match "${searchQuery}". Try searching another student name!`
              : 'There are currently no battles matching this criteria.'}
          </p>
        </div>
      )}

    </div>
  );
}
