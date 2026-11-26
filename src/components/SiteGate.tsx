'use client';

import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { playUnlockSound, playDeniedSound } from '@/lib/sounds';

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [grantedAnimation, setGrantedAnimation] = useState(false);

  useEffect(() => {
    try {
      const sessionSaved = sessionStorage.getItem('aura_unlocked_session');
      if (sessionSaved && sessionSaved.toUpperCase() === 'LAURA') {
        setIsUnlocked(true);
      } else {
        localStorage.removeItem('aura_unlocked');
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

    if (clean === 'LAURA') {
      setIsAuthorizing(true);
      playUnlockSound();
      setGrantedAnimation(true);

      setTimeout(() => {
        try {
          sessionStorage.setItem('aura_unlocked_session', 'LAURA');
        } catch {
          // ignore
        }
        setIsUnlocked(true);
        setIsAuthorizing(false);
      }, 650);
    } else {
      playDeniedSound();
      setError('Incorrect override pass.');
      setPasscode('');
    }
  };

  // If unlocked, render normal website
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#08090c] text-neutral-100 overflow-y-auto flex flex-col justify-between px-4 py-10 selection:bg-white/20 selection:text-white">
      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center">
        
        {/* Simple School Apology Card */}
        <div className="w-full rounded-2xl bg-[#101218] border border-neutral-800 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-2 border-b border-neutral-800/80 pb-5">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              Official Notice
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              An Apology to the School
            </h1>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <p className="font-medium text-neutral-200">
              To the Principal, Teachers, and School Administration,
            </p>
            <p>
              We sincerely apologize to the school for creating and running this website. We understand that organizing or promoting Aura Battles is inappropriate and goes against school expectations.
            </p>
            <p className="font-medium text-white">
              We will not run such aura battles or similar events on campus or online going forward. This website has been shut down out of respect for the school and our peers.
            </p>
            <p className="text-neutral-400 text-sm">
              Thank you for your understanding, and we deeply regret any inconvenience caused.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
            <span>Status: Discontinued</span>
            <span>Sincerely, The Students</span>
          </div>
        </div>

        {/* Simple Override Pass Form */}
        <div className="w-full max-w-sm mt-8 bg-[#0e1015] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
          <form onSubmit={handleUnlock} className="space-y-3">
            <div>
              <label
                htmlFor="override-pass"
                className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5"
              >
                Override Pass
              </label>
              <input
                id="override-pass"
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter override pass..."
                disabled={isAuthorizing}
                className={`w-full px-3.5 py-2.5 bg-black/70 border rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                  error
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-neutral-800 focus:border-neutral-500'
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {grantedAnimation && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Override accepted. Unlocking...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthorizing || !passcode.trim()}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isAuthorizing ? (
                <span>Unlocking...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      <div className="w-full text-center pt-6 text-[11px] text-neutral-600">
        Platform closed &amp; discontinued.
      </div>
    </div>
  );
}
