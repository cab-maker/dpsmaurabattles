'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BattleCategory } from '@/types/database';
import { Flame, Zap, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubmitBattleForm() {
  const [personOne, setPersonOne] = useState('');
  const [personTwo, setPersonTwo] = useState('');
  const [category, setCategory] = useState<BattleCategory>('Aura Battle');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!personOne.trim()) {
      setError('Please provide the name of Person 1.');
      return;
    }
    if (!personTwo.trim()) {
      setError('Please provide the name of Person 2.');
      return;
    }
    if (personOne.trim().toLowerCase() === personTwo.trim().toLowerCase()) {
      setError('Contestants must be two distinct individuals.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/battles/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person_one: personOne.trim(),
          person_two: personTwo.trim(),
          category,
          description: description.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit battle.');
      }

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ec008c', '#ffffff', '#a855f7'],
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPersonOne('');
    setPersonTwo('');
    setDescription('');
    setSubmitted(false);
    setError(null);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto bg-[#0a0a0a] border border-neutral-900 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#ec008c]" />
        </div>

        <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
          Battle Registered.
        </h3>

        <p className="text-xs sm:text-sm text-neutral-400 mb-8 leading-relaxed">
          Your challenge between <strong className="text-white">{personOne}</strong> and{' '}
          <strong className="text-white">{personTwo}</strong> is pending administrative review. The school coordinator will assign an arena and schedule the showdown!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all"
          >
            Submit Another
          </button>
          <Link
            href="/battles"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-black transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Current Battles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-6 sm:p-12 max-w-2xl mx-auto bg-[#0a0a0a] border border-neutral-900 shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-neutral-900">
        <span className="text-xs font-black uppercase tracking-widest text-[#ec008c] block mb-2">
          New Challenge
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">
          Propose Battle.
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">
          Nominate two contenders for a sanctioned school showdown.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs sm:text-sm font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Contestants Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Person 1
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex"
              value={personOne}
              onChange={(e) => setPersonOne(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 focus:border-[#ec008c] text-white placeholder-neutral-600 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Person 2
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan"
              value={personTwo}
              onChange={(e) => setPersonTwo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 focus:border-[#ec008c] text-white placeholder-neutral-600 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Selection Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Aura Battle Card */}
            <div
              onClick={() => setCategory('Aura Battle')}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                category === 'Aura Battle'
                  ? 'bg-neutral-900 border-[#ec008c] shadow-lg shadow-[#ec008c]/10'
                  : 'bg-black border-neutral-900 hover:border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${category === 'Aura Battle' ? 'bg-[#ec008c]/20 text-[#ec008c]' : 'bg-neutral-900 text-neutral-500'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-black text-white text-base tracking-tight">Aura Battle</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Clash of charisma, swagger, social presence, and pure confidence.
              </p>
            </div>

            {/* Mog Battle Card */}
            <div
              onClick={() => setCategory('Mog Battle')}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                category === 'Mog Battle'
                  ? 'bg-neutral-900 border-[#ec008c] shadow-lg shadow-[#ec008c]/10'
                  : 'bg-black border-neutral-900 hover:border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${category === 'Mog Battle' ? 'bg-[#ec008c]/20 text-[#ec008c]' : 'bg-neutral-900 text-neutral-500'}`}>
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-black text-white text-base tracking-tight">Mog Battle</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Showdown of style, outfit drip, grand entrance, and presence.
              </p>
            </div>

          </div>
        </div>

        {/* Optional Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Context <span className="text-neutral-600 lowercase font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Why is this battle happening? e.g. Who has the better morning entrance walk?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 focus:border-[#ec008c] text-white placeholder-neutral-600 text-sm outline-none transition-all resize-none"
          />
        </div>

        {/* Guidelines */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 flex items-start gap-3 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-[#ec008c] shrink-0 mt-0.5" />
          <span>
            Aura Arena is strictly voluntary, friendly, and respectful. Harmful or malicious nominations will be permanently discarded.
          </span>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full bg-white text-black hover:bg-neutral-200 active:scale-98 font-black text-sm tracking-tight transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Submission...</span>
            </>
          ) : (
            <span>Submit Battle for Approval</span>
          )}
        </button>

      </form>
    </div>
  );
}
