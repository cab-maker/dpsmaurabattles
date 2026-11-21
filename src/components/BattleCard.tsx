'use client';

import React, { useState, useEffect } from 'react';
import { Battle } from '@/types/database';
import { MapPin, Calendar, Trophy, Flame, Zap, Check } from 'lucide-react';

interface BattleCardProps {
  battle: Battle;
}

export default function BattleCard({ battle }: BattleCardProps) {
  const isMog = battle.category === 'Mog Battle';
  const isCompleted = battle.status === 'Completed';
  const isLive = battle.status === 'Live';

  const [votesOne, setVotesOne] = useState(battle.votes_person_one || 0);
  const [votesTwo, setVotesTwo] = useState(battle.votes_person_two || 0);
  const [userPrediction, setUserPrediction] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Check client-side storage for previous prediction on this battle
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`aura_prediction_${battle.id}`);
      if (stored) {
        setUserPrediction(Number(stored));
      }
    } catch {
      // ignore
    }
  }, [battle.id]);

  const handlePredict = async (choice: 1 | 2) => {
    if (userPrediction || isCompleted || isPredicting) return;

    setIsPredicting(true);
    // Optimistic UI update
    if (choice === 1) setVotesOne((v) => v + 1);
    if (choice === 2) setVotesTwo((v) => v + 1);
    setUserPrediction(choice);

    try {
      localStorage.setItem(`aura_prediction_${battle.id}`, String(choice));
      const res = await fetch('/api/battles/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battle_id: battle.id, choice }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVotesOne(data.votes_person_one);
        setVotesTwo(data.votes_person_two);
      }
    } catch {
      // non-fatal
    } finally {
      setIsPredicting(false);
    }
  };

  const totalVotes = votesOne + votesTwo;
  const pctOne = totalVotes > 0 ? Math.round((votesOne / totalVotes) * 100) : 50;
  const pctTwo = totalVotes > 0 ? 100 - pctOne : 50;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between group">
      {/* Decorative category aura accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] ${
          isMog
            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500'
            : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400'
        }`}
      />

      <div>
        {/* Top bar: Category Badge + Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
              isMog
                ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
            }`}
          >
            {isMog ? <Flame className="w-3.5 h-3.5 text-pink-400" /> : <Zap className="w-3.5 h-3.5 text-cyan-400" />}
            {battle.category}
          </span>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isLive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                : isCompleted
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
            }`}
          >
            {isLive ? '● LIVE' : battle.status}
          </span>
        </div>

        {/* Head-to-Head Clash Layout */}
        <div className="my-2 py-3.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-center gap-2">
            
            {/* Person 1 */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-base sm:text-lg font-bold truncate transition-colors ${
                  battle.winner_name === battle.person_one
                    ? 'text-amber-300 font-extrabold'
                    : 'text-white'
                }`}
                title={battle.person_one}
              >
                {battle.person_one}
              </p>
              {battle.winner_name === battle.person_one && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-0.5">
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center px-2">
              <span className="text-xs font-black px-2 py-1 rounded-md bg-white/[0.08] text-neutral-400 tracking-wider">
                VS
              </span>
            </div>

            {/* Person 2 */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-base sm:text-lg font-bold truncate transition-colors ${
                  battle.winner_name === battle.person_two
                    ? 'text-amber-300 font-extrabold'
                    : 'text-white'
                }`}
                title={battle.person_two}
              >
                {battle.person_two}
              </p>
              {battle.winner_name === battle.person_two && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-0.5">
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>

          </div>
        </div>

        {/* ================= PREDICTION BAR & BUTTONS ================= */}
        {!isCompleted ? (
          <div className="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-1.5">
              <span>Predict Victor:</span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {totalVotes} {totalVotes === 1 ? 'prediction' : 'predictions'}
              </span>
            </div>

            {/* Predict Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePredict(1)}
                disabled={Boolean(userPrediction) || isPredicting}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 truncate ${
                  userPrediction === 1
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                } disabled:cursor-default`}
              >
                {userPrediction === 1 && <Check className="w-3 h-3 text-pink-400" />}
                <span className="truncate">{battle.person_one}</span>
                {totalVotes > 0 && <span className="text-[10px] opacity-75 font-normal">({pctOne}%)</span>}
              </button>

              <button
                type="button"
                onClick={() => handlePredict(2)}
                disabled={Boolean(userPrediction) || isPredicting}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 truncate ${
                  userPrediction === 2
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                } disabled:cursor-default`}
              >
                {userPrediction === 2 && <Check className="w-3 h-3 text-cyan-400" />}
                <span className="truncate">{battle.person_two}</span>
                {totalVotes > 0 && <span className="text-[10px] opacity-75 font-normal">({pctTwo}%)</span>}
              </button>
            </div>

            {/* Prediction Ratio Meter */}
            {totalVotes > 0 && (
              <div className="mt-2 w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden flex">
                <div style={{ width: `${pctOne}%` }} className="h-full bg-pink-500 transition-all duration-500" />
                <div style={{ width: `${pctTwo}%` }} className="h-full bg-cyan-400 transition-all duration-500" />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 text-center py-1">
            <span className="text-[11px] font-medium text-neutral-400">
              Battle Completed • Winner Announced
            </span>
          </div>
        )}

        {/* Optional Description */}
        {battle.description && (
          <p className="text-xs text-neutral-400 italic line-clamp-2 mt-2 px-1">
            &ldquo;{battle.description}&rdquo;
          </p>
        )}
      </div>

      {/* Footer Info: Location & Schedule */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate font-medium text-neutral-300">
            {battle.location?.name || 'Location Pending'}
          </span>
        </div>

        {battle.scheduled_at ? (
          <div className="flex items-center gap-1 shrink-0 text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(battle.scheduled_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-neutral-400">
            {new Date(battle.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
  );
}
