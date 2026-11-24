'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Terminal, FileText } from 'lucide-react';
import { playUnlockSound, playDeniedSound } from '@/lib/sounds';

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [grantedAnimation, setGrantedAnimation] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  useEffect(() => {
    try {
      const sessionSaved = sessionStorage.getItem('aura_unlocked_session');
      if (sessionSaved && sessionSaved.toUpperCase() === 'AURA') {
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

    if (clean === 'AURA') {
      setIsAuthorizing(true);
      playUnlockSound();
      setGrantedAnimation(true);

      setTimeout(() => {
        try {
          sessionStorage.setItem('aura_unlocked_session', 'AURA');
        } catch {
          // ignore
        }
        setIsUnlocked(true);
        setIsAuthorizing(false);
      }, 750);
    } else {
      playDeniedSound();
      setError('ACCESS DENIED: Unauthorized attempt logged to Federal Registry (18 U.S.C. § 1030).');
      setPasscode('');
    }
  };

  // If unlocked, render normal website
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#020512] text-white overflow-y-auto flex flex-col justify-between selection:bg-red-600/40 selection:text-white">
      
      {/* Official Top Status Strip */}
      <div className="w-full bg-[#8a0002] border-b border-black/40 text-white text-center py-1.5 px-4 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>UNITED STATES DISTRICT COURT • LAW ENFORCEMENT NOTICE • WARRANT ISSUED</span>
      </div>

      {/* Main Authentic Federal Notice Container */}
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 py-8">
        
        {/* The Exact Reuters-style Federal Seizure Poster */}
        <div className="w-full bg-gradient-to-b from-[#0a1b4d] via-[#051138] to-[#020924] rounded-2xl border-2 border-red-700/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Top Bold Red Banner */}
          <div className="w-full bg-[#c00000] py-5 px-4 text-center border-b-2 border-black/30">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider font-sans drop-shadow-md">
              THIS WEBSITE HAS BEEN SEIZED
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-2 font-serif" dir="rtl">
              تم الاستيلاء على هذا الموقع
            </p>
          </div>

          {/* Legal Seizure Warrant Body */}
          <div className="px-6 sm:px-12 py-8 text-center bg-gradient-to-b from-[#081845] to-[#061233]">
            <p className="text-sm sm:text-base md:text-lg text-white font-medium leading-relaxed max-w-3xl mx-auto drop-shadow">
              The domain <strong className="font-black text-white underline decoration-red-500 decoration-2">dpsmaurabattles.vercel.app</strong> has been seized by the United States Government in accordance with a seizure warrant issued pursuant to <strong className="font-extrabold text-white">18 U.S.C. §§ 981, 982</strong>, and <strong className="font-extrabold text-white">50 U.S.C. 1701-1705</strong> as part of a law enforcement action by the <span className="text-neutral-100 font-semibold">Bureau of Industry and Security, Office of Export Enforcement</span> and <span className="text-neutral-100 font-semibold">Federal Bureau of Investigation</span>.
            </p>

            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-neutral-300 bg-black/40 px-4 py-2 rounded-lg border border-white/10">
              <span>CASE NO. <strong>1:26-MJ-00892-AURA</strong></span>
              <span>•</span>
              <span>D.C. DISTRICT COURT</span>
              <span>•</span>
              <span className="text-red-400 font-bold">STATUS: SEIZED</span>
            </div>
          </div>

          {/* Seals Horizontal Section: Radial Glow Background with Authentic High-Fidelity Official Seals */}
          <div className="relative w-full py-8 px-6 bg-gradient-to-r from-[#030920] via-white to-[#030920] flex items-center justify-center gap-6 sm:gap-14 shadow-inner overflow-hidden border-y border-white/20">
            
            {/* Subtle glow background */}
            <div className="absolute inset-0 bg-white/95" />

            {/* Seal 1: Federal Bureau of Investigation / DOJ */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#001744] border-4 border-[#d4af37] shadow-xl p-1 flex items-center justify-center relative">
                {/* Gold serrated rim */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#d4af37]" />
                <div className="w-full h-full rounded-full bg-[#031b4d] flex flex-col items-center justify-center text-center p-1 relative overflow-hidden">
                  <div className="text-[7px] sm:text-[9px] font-black text-[#d4af37] tracking-wider uppercase">
                    DEPARTMENT OF JUSTICE
                  </div>
                  {/* Shield graphic */}
                  <div className="w-8 h-10 sm:w-11 sm:h-13 bg-red-700 border-2 border-[#d4af37] rounded-b-lg flex flex-col items-center justify-center my-0.5 shadow">
                    <div className="w-full h-3 bg-blue-900 border-b border-[#d4af37] flex items-center justify-center">
                      <span className="text-[6px] text-white font-bold">★ ★ ★</span>
                    </div>
                    <div className="flex-1 w-full flex">
                      <div className="flex-1 bg-red-700" />
                      <div className="flex-1 bg-white" />
                      <div className="flex-1 bg-red-700" />
                      <div className="flex-1 bg-white" />
                      <div className="flex-1 bg-red-700" />
                    </div>
                  </div>
                  <div className="text-[7px] sm:text-[9px] font-black text-[#d4af37] tracking-wider uppercase">
                    FEDERAL BUREAU OF INVESTIGATION
                  </div>
                </div>
              </div>
              <span className="mt-2 text-[10px] sm:text-xs font-bold text-neutral-800 tracking-wider">
                F.B.I.
              </span>
            </div>

            {/* Seal 2: U.S. Department of Commerce - BIS */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#002b66] border-4 border-[#c59b27] shadow-xl p-1 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#c59b27]" />
                <div className="w-full h-full rounded-full bg-[#031f47] flex flex-col items-center justify-center text-center p-1 relative overflow-hidden">
                  <div className="text-[7px] sm:text-[9px] font-black text-[#f3ca52] tracking-wider uppercase">
                    U.S. DEPT OF COMMERCE
                  </div>
                  {/* Eagle & Globe representation */}
                  <div className="w-8 h-10 sm:w-11 sm:h-13 bg-[#002244] border-2 border-[#f3ca52] rounded-full flex flex-col items-center justify-center my-0.5 shadow">
                    <div className="text-[9px] text-amber-300 font-black">🦅</div>
                    <div className="w-6 h-4 border border-blue-400/80 rounded-full flex items-center justify-center">
                      <span className="text-[5px] text-white font-mono">GLOBAL</span>
                    </div>
                  </div>
                  <div className="text-[6px] sm:text-[8px] font-black text-[#f3ca52] tracking-wider uppercase">
                    BUREAU OF INDUSTRY & SECURITY
                  </div>
                </div>
              </div>
              <span className="mt-2 text-[10px] sm:text-xs font-bold text-neutral-800 tracking-wider">
                COMMERCE / B.I.S.
              </span>
            </div>

          </div>

          {/* Warning citation footer within poster */}
          <div className="py-4 px-6 bg-[#03091c] text-center text-[11px] sm:text-xs text-neutral-400 font-mono border-t border-white/10">
            WARNING: Unauthorized attempts to tamper with, access, or restore seized electronic systems are punishable under federal statute 18 U.S.C. § 1030 (Computer Fraud and Abuse Act) with penalties up to 20 years imprisonment.
          </div>

        </div>

        {/* Covert Official Clearance Authentication Portal */}
        <div className="w-full max-w-lg mt-6 bg-[#060a1a]/95 backdrop-blur-md border border-neutral-700/60 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-widest">
                DOJ Clearance Verification Portal
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-700/50">
              RESTRICTED
            </span>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1.5 uppercase">
                Authorized Override Passphrase:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter clearance code..."
                  autoFocus
                  disabled={isAuthorizing}
                  className={`w-full px-4 py-3 bg-black/80 border rounded-xl text-sm font-mono tracking-widest text-white placeholder-neutral-600 focus:outline-none transition-all ${
                    error
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : 'border-neutral-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                  }`}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {grantedAnimation && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 font-mono font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>FEDERAL CLEARANCE VERIFIED — DECRYPTING SECURE NODE...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthorizing || !passcode.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/50"
            >
              {isAuthorizing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Agency Clearance...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Clearance Token</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Official Federal Footer */}
      <div className="w-full bg-[#01040d] border-t border-white/10 text-center py-3 px-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest shrink-0">
        UNITED STATES DEPARTMENT OF JUSTICE • 950 PENNSYLVANIA AVENUE, NW, WASHINGTON, DC 20530 • 50 U.S.C. § 1705
      </div>
    </div>
  );
}
