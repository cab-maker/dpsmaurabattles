'use client';

import React, { useState, useEffect } from 'react';
import { Announcement } from '@/types/database';
import { Bell, Flame, X, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { playUnlockSound } from '@/lib/sounds';

interface AnnouncementPopupProps {
  announcements: Announcement[];
}

export default function AnnouncementPopup({ announcements }: AnnouncementPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeAnnouncement = announcements[activeIdx] || announcements[0];

  useEffect(() => {
    if (!activeAnnouncement) return;
    try {
      const dismissed = sessionStorage.getItem(`aura_announcement_dismissed_${activeAnnouncement.id}`);
      if (!dismissed) {
        // Automatically pop up on initial arrival after a brief delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, [activeAnnouncement]);

  if (!activeAnnouncement) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(`aura_announcement_dismissed_${activeAnnouncement.id}`, 'true');
    } catch {}
    setIsOpen(false);
  };

  const handleOpen = () => {
    playUnlockSound();
    setIsOpen(true);
  };

  const isUrgent = activeAnnouncement.priority === 'Urgent';
  const isHigh = activeAnnouncement.priority === 'High';

  return (
    <>
      {/* Floating Pill in Bottom-Right to re-open announcements anytime */}
      <button
        onClick={handleOpen}
        title="View Official School Announcement"
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-[#0d0d0d]/90 backdrop-blur-md border border-neutral-800 hover:border-[#ec008c] text-white text-xs font-bold flex items-center gap-2 shadow-2xl transition-all cursor-pointer group hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec008c] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ec008c]" />
        </span>
        <span className="text-[11px] font-mono tracking-tight group-hover:text-[#ec008c] transition-colors">
          Announcement
        </span>
        <Bell className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
      </button>

      {/* Modal Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Glowing Header Accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                isUrgent
                  ? 'bg-red-500'
                  : isHigh
                  ? 'bg-amber-400'
                  : 'bg-[#ec008c]'
              }`}
            />

            {/* Close Icon */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close Announcement"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Category / Urgency Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isUrgent
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : isHigh
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-[#ec008c]/20 text-[#ec008c] border border-[#ec008c]/30'
                }`}
              >
                {isUrgent ? <AlertTriangle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                {isUrgent ? 'URGENT NOTICE' : 'OFFICIAL ANNOUNCEMENT'}
              </span>

              {activeAnnouncement.is_pinned && (
                <span className="text-[10px] font-black text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Pinned
                </span>
              )}

              <span className="text-[10px] font-mono text-neutral-500 ml-auto mr-8">
                {new Date(activeAnnouncement.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Announcement Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-3">
              {activeAnnouncement.title}
            </h3>

            {/* Announcement Body */}
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-h-60 overflow-y-auto pr-1 mb-6">
              {activeAnnouncement.message}
            </div>

            {/* Multiple Announcement Navigation if more than 1 */}
            {announcements.length > 1 && (
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-4 pt-3 border-t border-neutral-900">
                <span>
                  Notice {activeIdx + 1} of {announcements.length}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={activeIdx === 0}
                    onClick={() => setActiveIdx((i) => i - 1)}
                    className="px-2 py-1 rounded bg-neutral-900 text-white disabled:opacity-30 text-xs font-bold cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    disabled={activeIdx === announcements.length - 1}
                    onClick={() => setActiveIdx((i) => i + 1)}
                    className="px-2 py-1 rounded bg-neutral-900 text-white disabled:opacity-30 text-xs font-bold cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDismiss}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-black tracking-tight transition-all active:scale-95 shadow-md cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
