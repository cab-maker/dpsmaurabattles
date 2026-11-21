'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
        colors: ['#ff2a85', '#8b5cf6', '#06b6d4', '#f59e0b'],
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
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-2xl font-black text-white mb-2">
          Battle Submitted to the <span className="aura-text">Aura</span> Arena!
        </h3>

        <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
          Your challenge between <strong className="text-white">{personOne}</strong> and{' '}
          <strong className="text-white">{personTwo}</strong> has been received with status{' '}
          <span className="font-semibold text-amber-400">Pending Approval</span>. The school admin will assign an arena location and approve it for the public battle board!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-semibold transition-all"
          >
            Submit Another Battle
          </button>
          <Link
            href="/battles"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Current Battles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border border-white/[0.08] shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/[0.05] text-purple-300 border border-purple-500/20">
          Clash of Reputations
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
          Initiate a New <span className="aura-text">Aura</span> Battle
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md mx-auto">
          Nominate two contestants for an epic school showdown. Battles are voluntary, fun, and judged by crowd aura!
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Contestants Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Person 1 Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex"
              value={personOne}
              onChange={(e) => setPersonOne(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0d13] border border-white/[0.08] focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-neutral-400 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Person 2 Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan"
              value={personTwo}
              onChange={(e) => setPersonTwo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0d13] border border-white/[0.08] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-neutral-400 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Selection Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
            Select Battle Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Aura Battle Card */}
            <div
              onClick={() => setCategory('Aura Battle')}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                category === 'Aura Battle'
                  ? 'bg-gradient-to-br from-cyan-950/40 to-blue-950/30 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-[#0b0d13]/60 border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${category === 'Aura Battle' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.05] text-neutral-400'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">Aura Battle</h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                A clash of charisma, swagger, social presence, confidence, and sheer high-vibe aura.
              </p>
            </div>

            {/* Mog Battle Card */}
            <div
              onClick={() => setCategory('Mog Battle')}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                category === 'Mog Battle'
                  ? 'bg-gradient-to-br from-pink-950/40 to-purple-950/30 border-pink-500 shadow-lg shadow-pink-500/10'
                  : 'bg-[#0b0d13]/60 border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${category === 'Mog Battle' ? 'bg-pink-500/20 text-pink-300' : 'bg-white/[0.05] text-neutral-400'}`}>
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">Mog Battle</h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                An undeniable showdown of stylish outfit drip, dynamic entrance, and pure spotlight dominance.
              </p>
            </div>

          </div>
        </div>

        {/* Optional Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
            Context / Backstory <span className="text-neutral-400 lowercase font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Why is this battle happening? e.g. Who has the better morning entrance walk?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0d13] border border-white/[0.08] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-neutral-400 text-sm outline-none transition-all resize-none"
          />
        </div>

        {/* Respectful Guidelines Note */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-start gap-3 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Aura Arena is designed for harmless fun, creativity, and school spirit. Submissions with harassment, body shaming, or malicious intent are permanently rejected by the administration.
          </span>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-purple-500/25 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
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
