'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lock, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { playUnlockSound, playDeniedSound } from '@/lib/sounds';

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [grantedAnimation, setGrantedAnimation] = useState(false);

  useEffect(() => {
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
      }, 700);
    } else {
      playDeniedSound();
      setError('ACCESS DENIED: Unauthorized attempt logged to Federal Registry.');
      setPasscode('');
    }
  };

  // SSR loading state
  if (isUnlocked === null) {
    return (
      <div className="fixed inset-0 bg-[#060b1e] flex items-center justify-center z-50">
        <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
      </div>
    );
  }

  // If unlocked, render normal website
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Full-screen authentic Seizure Gate
  return (
    <div className="fixed inset-0 z-50 bg-[#060b1e] text-white overflow-y-auto flex flex-col justify-between selection:bg-red-500/30 selection:text-white">
      {/* Top Warning Banner Stripe */}
      <div className="w-full bg-[#c20104] text-white text-center py-2 px-4 shadow-md font-mono text-xs uppercase tracking-widest font-black shrink-0 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>OFFICIAL NOTICE OF LAW ENFORCEMENT ACTION // WARRANT 18 U.S.C. §§ 981, 982</span>
      </div>

      {/* Main Fullscreen Center Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-2 sm:px-6 py-4 sm:py-6">
        {/* Full-width responsive Seizure Image */}
        <div className="w-full relative shadow-2xl overflow-hidden rounded-lg sm:rounded-xl border border-white/10 bg-[#0a1f5e]">
          <div className="relative w-full aspect-[1024/764]">
            <Image
              src="/seized.jpg"
              alt="Official Notice of Seizure - dpsmaurabattles.vercel.app"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>

        {/* Minimal High-Tech Bypass Form (No hints!) */}
        <div className="w-full max-w-lg mt-5 bg-[#080d21]/95 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Court Authorization Terminal
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
              SEIZED
            </span>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter clearance passphrase..."
                autoFocus
                disabled={isAuthorizing}
                className={`w-full px-3.5 py-2.5 bg-black/70 border rounded-lg text-sm font-mono tracking-widest text-white placeholder-neutral-500 focus:outline-none transition-all ${
                  error
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : 'border-white/15 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {grantedAnimation && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono font-bold animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>CLEARANCE VERIFIED — DECRYPTING WEBSITE...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthorizing || !passcode.trim()}
              className="w-full py-2.5 px-4 rounded-lg font-mono font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isAuthorizing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify Authorization Key</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer stripe */}
      <div className="w-full bg-[#030612] border-t border-white/[0.08] text-center py-2 px-4 text-[10px] font-mono text-neutral-500 uppercase tracking-wider shrink-0">
        UNITED STATES DEPARTMENT OF JUSTICE • HIGH AURA ENFORCEMENT DIVISION • 50 U.S.C. § 1705
      </div>
    </div>
  );
}
