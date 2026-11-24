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
    <div className="bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-700 rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between transition-all duration-200 group">
      
      {/* Top Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${
          isLive
            ? 'bg-[#ec008c]'
            : isMog
            ? 'bg-gradient-to-r from-[#ec008c] to-purple-600'
            : 'bg-neutral-800 group-hover:bg-[#ec008c] transition-colors'
        }`}
      />

      <div>
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight bg-neutral-900 border border-neutral-800 text-neutral-300">
            {isMog ? <Flame className="w-3.5 h-3.5 text-[#ec008c]" /> : <Zap className="w-3.5 h-3.5 text-neutral-400" />}
            {battle.category}
          </span>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isLive
                ? 'bg-[#ec008c]/20 text-[#ec008c] border border-[#ec008c]/30 animate-pulse'
                : isCompleted
                ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
            }`}
          >
            {isLive ? '● LIVE' : battle.status}
          </span>
        </div>

        {/* Head-to-Head Clash */}
        <div className="my-2 py-4 px-4 rounded-xl bg-[#0e0e0e] border border-neutral-900">
          <div className="flex items-center justify-between text-center gap-3">
            
            {/* Person 1 */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-base sm:text-lg font-black truncate tracking-tight transition-colors ${
                  battle.winner_name === battle.person_one
                    ? 'text-[#ec008c]'
                    : 'text-white'
                }`}
                title={battle.person_one}
              >
                {battle.person_one}
              </p>
              {battle.winner_name === battle.person_one && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#ec008c] font-black uppercase tracking-wider mt-1">
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center px-2">
              <span className="text-xs font-black px-2 py-1 rounded-md bg-black text-neutral-500 tracking-wider border border-neutral-900">
                VS
              </span>
            </div>

            {/* Person 2 */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-base sm:text-lg font-black truncate tracking-tight transition-colors ${
                  battle.winner_name === battle.person_two
                    ? 'text-[#ec008c]'
                    : 'text-white'
                }`}
                title={battle.person_two}
              >
                {battle.person_two}
              </p>
              {battle.winner_name === battle.person_two && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#ec008c] font-black uppercase tracking-wider mt-1">
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Prediction Bar & Buttons */}
        {!isCompleted ? (
          <div className="mt-4 p-3 rounded-xl bg-[#0e0e0e] border border-neutral-900">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-2">
              <span className="tracking-tight">Predict Victor:</span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
              </span>
            </div>

            {/* Predict Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePredict(1)}
                disabled={Boolean(userPrediction) || isPredicting}
                className={`py-2 px-2.5 rounded-lg text-xs font-black tracking-tight transition-all flex items-center justify-center gap-1.5 truncate ${
                  userPrediction === 1
                    ? 'bg-[#ec008c] text-white shadow-md'
                    : 'bg-black text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800'
                } disabled:cursor-default`}
              >
                {userPrediction === 1 && <Check className="w-3.5 h-3.5 text-white" />}
                <span className="truncate">{battle.person_one}</span>
                {totalVotes > 0 && <span className="text-[10px] opacity-75 font-normal">({pctOne}%)</span>}
              </button>

              <button
                type="button"
                onClick={() => handlePredict(2)}
                disabled={Boolean(userPrediction) || isPredicting}
                className={`py-2 px-2.5 rounded-lg text-xs font-black tracking-tight transition-all flex items-center justify-center gap-1.5 truncate ${
                  userPrediction === 2
                    ? 'bg-white text-black shadow-md'
                    : 'bg-black text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800'
                } disabled:cursor-default`}
              >
                {userPrediction === 2 && <Check className="w-3.5 h-3.5 text-black" />}
                <span className="truncate">{battle.person_two}</span>
                {totalVotes > 0 && <span className="text-[10px] opacity-75 font-normal">({pctTwo}%)</span>}
              </button>
            </div>

            {/* Ratio Bar */}
            {totalVotes > 0 && (
              <div className="mt-2.5 w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden flex">
                <div style={{ width: `${pctOne}%` }} className="h-full bg-[#ec008c] transition-all duration-500" />
                <div style={{ width: `${pctTwo}%` }} className="h-full bg-white transition-all duration-500" />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 text-center py-1">
            <span className="text-xs font-semibold text-neutral-500">
              Battle Concluded • Result Recorded
            </span>
          </div>
        )}

        {/* Optional Description */}
        {battle.description && (
          <p className="text-xs text-neutral-500 italic line-clamp-2 mt-3 px-1">
            &ldquo;{battle.description}&rdquo;
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3.5 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500 gap-2 font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#ec008c] shrink-0" />
          <span className="truncate text-neutral-400">
            {battle.location?.name || 'School Arena'}
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
          <span className="text-[11px] text-neutral-500">
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
