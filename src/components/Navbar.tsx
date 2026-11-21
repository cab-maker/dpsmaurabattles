'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Trophy, PlusCircle, ShieldCheck, Menu, X, Flame } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Current Battles', href: '/battles' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Submit Battle', href: '/submit', isPrimary: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#060709]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090b10] rounded-[11px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-pink-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight leading-none text-white">
                <span className="aura-text">Aura</span> Battles
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mt-1">
                The School Arena
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              if (item.isPrimary) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-white bg-white/[0.08] shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="w-[1px] h-6 bg-white/[0.1] mx-2" />

            {/* Admin Access Icon */}
            <Link
              href="/admin"
              title="Admin Panel"
              className={`p-2.5 rounded-xl border border-white/[0.06] text-neutral-400 hover:text-purple-300 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all ${
                pathname.startsWith('/admin') ? 'text-purple-400 bg-purple-500/15 border-purple-500/40' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 text-neutral-400 hover:text-white"
              title="Admin"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090b10]/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  item.isPrimary
                    ? 'text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-center font-bold'
                    : active
                    ? 'text-white bg-white/[0.1]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-neutral-400 hover:text-purple-300 bg-white/[0.03] text-sm"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
