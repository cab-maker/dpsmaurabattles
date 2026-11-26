'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck, Flame, Swords } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Battles', href: '/battles' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Memes', href: '/memes' },
    { name: 'Group Chat', href: '/gc', badge: 'GC' },
    { name: 'Call Arena', href: '/call', badge: 'LIVE' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000]/90 backdrop-blur-md border-b border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Brand: Huge-inspired Aura Battles Wordmark */}
          <Link href="/" className="flex items-center gap-1.5 group select-none">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#ec008c] group-hover:opacity-90 transition-opacity">
              Aura
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
              Battles.
            </span>
          </Link>

          {/* Desktop Nav Items (Huge Inc style: clean, spaced, muted links) */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-semibold tracking-tight transition-colors duration-150 flex items-center gap-1.5 ${
                    active
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                        item.badge === 'LIVE'
                          ? 'bg-[#ec008c]/20 text-[#ec008c] border border-[#ec008c]/30'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Huge Inc Signature White Pill Button & Quick Access */}
          <div className="hidden md:flex items-center gap-3">
            {/* Apology Notice Lock Toggle */}
            <button
              onClick={() => {
                sessionStorage.removeItem('aura_unlocked_session');
                localStorage.removeItem('aura_unlocked');
                window.location.reload();
              }}
              title="Lock Site & Show Apology Notice"
              className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono font-bold text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span>APOLOGY NOTICE</span>
            </button>

            {/* Admin Portal Icon */}
            <Link
              href="/admin"
              title="Admin Portal"
              className={`p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all ${
                pathname.startsWith('/admin') ? 'text-[#ec008c] bg-neutral-900' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            {/* Signature White Pill "Let's Battle" CTA Button */}
            <Link
              href="/submit"
              className="rounded-full bg-white text-black px-5 py-2 text-xs font-black tracking-tight hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
            >
              Let&apos;s battle
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/submit"
              className="rounded-full bg-white text-black px-3 py-1.5 text-xs font-black"
            >
              Battle
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-900 bg-[#000000] px-6 pt-4 pb-6 space-y-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 text-sm font-semibold tracking-tight ${
                  active ? 'text-white' : 'text-neutral-400'
                }`}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#ec008c]/20 text-[#ec008c] font-black">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
            <button
              onClick={() => {
                sessionStorage.removeItem('aura_unlocked_session');
                localStorage.removeItem('aura_unlocked');
                window.location.reload();
              }}
              className="text-xs font-mono text-neutral-400 hover:text-white font-bold"
            >
              🔒 Re-lock with Apology Notice
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
