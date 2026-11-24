import React from 'react';
import { Announcement } from '@/types/database';
import { Bell, Flame, Sparkles } from 'lucide-react';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const activeAnnouncement = announcements.find((a) => a.is_pinned) || announcements[0];

  if (!activeAnnouncement) {
    return null;
  }

  const isUrgent = activeAnnouncement.priority === 'Urgent';

  return (
    <div className="w-full">
      <div className="rounded-2xl p-5 sm:p-6 bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-800 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                isUrgent
                  ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                  : 'bg-neutral-900 text-[#ec008c] border border-neutral-800'
              }`}
            >
              {isUrgent ? <Flame className="w-5 h-5" /> : <Bell className="w-4 h-4 text-[#ec008c]" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                  Notice
                </span>
                {activeAnnouncement.is_pinned && (
                  <span className="text-[10px] font-black text-[#ec008c] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Pinned
                  </span>
                )}
                <span className="text-[10px] text-neutral-500 font-mono">
                  {new Date(activeAnnouncement.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h4 className="text-base font-black text-white tracking-tight">
                {activeAnnouncement.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed max-w-3xl">
                {activeAnnouncement.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
