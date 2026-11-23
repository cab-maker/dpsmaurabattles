'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { playUnlockSound, playDeniedSound } from '@/lib/sounds';

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [grantedAnimation, setGrantedAnimation] = useState(false);

  useEffect(() => {
    // Check if unlocked in localStorage
    try {
      const saved = localStorage.getItem('aura_unlocked');
      if (saved && saved.toUpperCase() === 'AURA') {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    } catch {
      setIsUnlocked(false);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = passcode.trim().toUpperCase();

    if (clean === 'AURA') {
      setIsAuthorizing(true);
      playUnlockSound();
      setGrantedAnimation(true);

      setTimeout(() => {
        try {
          localStorage.setItem('aura_unlocked', 'AURA');
        } catch {
          // ignore
        }
        setIsUnlocked(true);
        setIsAuthorizing(false);
      }, 900);
    } else {
      playDeniedSound();
      setError('ACCESS DENIED: Invalid authorization passphrase. Incident reported.');
      setPasscode('');
    }
  };

  // SSR or initial hydration loading state
  if (isUnlocked === null) {
    return (
      <div className="min-h-screen bg-[#07090f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
      </div>
    );
  }

  // If already unlocked, render the site normally
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Otherwise, render the Seizure Gate screen
  return (
    <div className="min-h-screen bg-[#04060a] text-white flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden selection:bg-red-500/30 selection:text-white">
      {/* Subtle red emergency ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-4xl flex flex-col items-center gap-6 my-auto">
        {/* The Seized Notice Image Container */}
        <div className="w-full bg-[#0a1f5e] rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-red-500/30">
          <div className="relative w-full aspect-[1024/764]">
            <Image
              src="/seized.jpg"
              alt="This Website Has Been Seized - dpsmaurabattles.vercel.app"
              fill
              priority
              className="object-contain bg-[#0a1f5e]"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>

        {/* Emergency Authorization Bypass Terminal */}
        <div className="w-full max-w-xl bg-[#090c15]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Restricted Access Override
                </h2>
                <p className="text-[11px] text-neutral-400">
                  Federal Aura Enforcement Clearance Required
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              SEIZED
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed mb-5">
            This website has been seized pursuant to the High Aura Code. If you possess Level-4 Arena Master clearance, enter the bypass passphrase to unlock the site:
          </p>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bypass Passphrase</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter passcode (hint: AURA)..."
                  autoFocus
                  disabled={isAuthorizing}
                  className={`w-full px-4 py-3 bg-black/60 border rounded-xl text-sm font-mono tracking-widest text-white placeholder-neutral-500 focus:outline-none transition-all ${
                    error
                      ? 'border-red-500/80 ring-2 ring-red-500/20'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {grantedAnimation && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>CLEARANCE VERIFIED — UNLOCKING ARENA...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthorizing || !passcode.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAuthorizing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Decrypting Clearance...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bypass Seizure &amp; Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
            <span className="text-[10px] text-neutral-500 tracking-wider">
              PROTECTED BY DPSM ENCRYPTION MATRIX • ACCESS CODE: AURA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
