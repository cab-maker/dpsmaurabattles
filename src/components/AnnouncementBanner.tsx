import React from 'react';
import { Announcement } from '@/types/database';
import { Bell, Flame, Sparkles } from 'lucide-react';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  // Find primary pinned announcement or most recent
  const activeAnnouncement = announcements.find((a) => a.is_pinned) || announcements[0];

  if (!activeAnnouncement) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 mt-6">
        <div className="glass-panel rounded-2xl p-4 text-center border-dashed border-white/[0.06]">
          <p className="text-xs text-neutral-400">
            No active announcements. Stay tuned for upcoming arena match schedules!
          </p>
        </div>
      </div>
    );
  }

  const isUrgent = activeAnnouncement.priority === 'Urgent';
  const isHigh = activeAnnouncement.priority === 'High';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6">
      <div
        className={`relative overflow-hidden rounded-2xl p-5 border shadow-xl transition-all ${
          isUrgent
            ? 'bg-gradient-to-r from-red-950/40 via-purple-950/30 to-[#0c0d14] border-red-500/30 shadow-red-950/20'
            : isHigh
            ? 'bg-gradient-to-r from-pink-950/30 via-purple-950/30 to-[#0c0d14] border-pink-500/30 shadow-pink-950/20'
            : 'glass-panel border-white/[0.1]'
        }`}
      >
        {/* Subtle aura beam background */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                isUrgent
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30'
              }`}
            >
              {isUrgent ? <Flame className="w-5 h-5" /> : <Bell className="w-4 h-4 text-pink-400" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-neutral-300">
                  Official Announcement
                </span>
                {activeAnnouncement.is_pinned && (
                  <span className="text-[10px] font-bold text-pink-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Pinned
                  </span>
                )}
                <span className="text-[10px] text-neutral-400">
                  {new Date(activeAnnouncement.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-1">
                {activeAnnouncement.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 mt-0.5 leading-relaxed">
                {activeAnnouncement.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
