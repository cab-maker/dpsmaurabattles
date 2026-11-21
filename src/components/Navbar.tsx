'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Trophy, PlusCircle, ShieldCheck, Menu, X, Flame } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Arena Home', href: '/' },
    { name: 'Live Battles', href: '/battles' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Submit Battle', href: '/submit', isPrimary: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#08090d]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & School Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-sm">
              <div className="w-full h-full bg-[#0a0c12] rounded-[11px] flex items-center justify-center">
                <Flame className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight leading-none text-white">
                <span className="text-white">DPSM</span> <span className="aura-text">Aura</span> Battles
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mt-0.5">
                Official School Championship
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              if (item.isPrimary) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-90 shadow-sm active:scale-95 transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'text-white bg-white/[0.08]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="w-[1px] h-5 bg-white/[0.1] mx-2" />

            {/* Admin icon link */}
            <Link
              href="/admin"
              title="Admin Portal"
              className={`p-2 rounded-lg text-neutral-400 hover:text-purple-300 hover:bg-white/[0.04] transition-all ${
                pathname.startsWith('/admin') ? 'text-purple-400 bg-purple-500/10' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 text-neutral-400 hover:text-white"
              title="Admin"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090b10] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  item.isPrimary
                    ? 'text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-center'
                    : active
                    ? 'text-white bg-white/[0.08]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-neutral-400 hover:text-purple-300 bg-white/[0.02] text-xs font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin Management Panel</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
