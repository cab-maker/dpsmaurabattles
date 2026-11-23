'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles, 
  Shield, 
  Crown, 
  Smile, 
  Users, 
  Lock,
  Pin
} from 'lucide-react';
import { ChatMessage } from '@/types/database';
import { playMessageSound, playReactionSound } from '@/lib/sounds';

const BADGES = [
  { label: '👑 Mogger', value: '👑 Mogger' },
  { label: '⚡ Aura King', value: '⚡ Aura King' },
  { label: '🗿 Gigachad', value: '🗿 Gigachad' },
  { label: '🔥 Challenger', value: '🔥 Challenger' },
  { label: '🛡️ Defender', value: '🛡️ Defender' },
  { label: '🕶️ Secret Agent', value: '🕶️ Secret Agent' },
];

const QUICK_CHIPS = [
  '⚡ Who has more aura?',
  '💀 Bro got mogged so bad',
  '🗿 Pure Sigma moment',
  '🔥 Friday battle is gonna be fire',
  '👑 Aura +10,000',
  '🧢 That was cap',
];

const REACTION_EMOJIS = ['🔥', '🗿', '💀', '⚡', '👑', '🧢', '💯'];

export default function GroupChatClient({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [senderName, setSenderName] = useState('');
  const [senderBadge, setSenderBadge] = useState('🔥 Challenger');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [onlineCount, setOnlineCount] = useState(14);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMsgCountRef = useRef(initialMessages.length);

  // Load saved nickname and badge from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('aura_chat_name');
      const savedBadge = localStorage.getItem('aura_chat_badge');
      if (savedName) setSenderName(savedName);
      if (savedBadge) setSenderBadge(savedBadge);

      // Random jitter for active online count (12 to 24 students)
      setOnlineCount(Math.floor(Math.random() * 12) + 12);
    } catch {
      // ignore
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            if (data.messages.length > lastMsgCountRef.current && soundEnabled) {
              playMessageSound();
            }
            lastMsgCountRef.current = data.messages.length;
            setMessages(data.messages);
          }
        }
      } catch {
        // network silent retry
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const nickname = senderName.trim() || 'Anonymous Mogger';
    const text = inputMessage.trim();

    // Save identity
    try {
      localStorage.setItem('aura_chat_name', nickname);
      localStorage.setItem('aura_chat_badge', senderBadge);
    } catch {
      // ignore
    }

    setIsSending(true);
    setInputMessage('');

    // Optimistic UI update
    const optimisticMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      sender_name: nickname,
      sender_badge: senderBadge,
      message: text,
      reactions: {},
      is_pinned: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(), 50);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: nickname,
          sender_badge: senderBadge,
          message: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optimisticMsg.id ? data.message : m))
          );
        }
      }
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    if (soundEnabled) playReactionSound();

    // Optimistic reaction
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      })
    );

    try {
      await fetch('/api/chat/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, emoji }),
      });
    } catch {
      // ignore
    }
  };

  const handleLockSite = () => {
    try {
      localStorage.removeItem('aura_unlocked');
      window.location.reload();
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col h-[calc(100vh-5rem)]">
      {/* Top Header Card */}
      <div className="bg-[#0b0e17]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-5 mb-4 shadow-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0c12] rounded-[11px] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>The DPSM</span>
                <span className="aura-text">Aura</span>
                <span>Group Chat</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-extrabold text-pink-400 tracking-wider">
                /gc
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold">{onlineCount} Online</span>
              </span>
              <span>•</span>
              <span>Real-time banter &amp; mogging discussions</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Chat Sound FX' : 'Enable Chat Sound FX'}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          <button
            onClick={handleLockSite}
            title="Lock Website (Trigger FBI Seizure Notice)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-400 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Site</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 min-h-0 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg) => {
          const isMe = senderName && msg.sender_name.toLowerCase() === senderName.toLowerCase();

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
            >
              {/* Sender Info */}
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-xs font-bold text-white">
                  {msg.sender_name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-neutral-300 font-medium">
                  {msg.sender_badge}
                </span>
                {msg.is_pinned && (
                  <span className="flex items-center gap-1 text-[10px] text-pink-400 font-bold">
                    <Pin className="w-2.5 h-2.5" /> PINNED
                  </span>
                )}
                <span className="text-[10px] text-neutral-500">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm transition-all ${
                  msg.is_pinned
                    ? 'bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-cyan-950/40 border border-pink-500/30 text-pink-100 shadow-pink-500/5'
                    : isMe
                    ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/50 border border-pink-500/20 text-white rounded-tr-none'
                    : 'bg-[#101420]/90 border border-white/[0.08] text-neutral-200 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.message}</p>

                {/* Reactions list */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/[0.06]">
                    {Object.entries(msg.reactions).map(([emoji, count]) => {
                      if (!count || count <= 0) return null;
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReact(msg.id, emoji)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs transition-all cursor-pointer active:scale-95"
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px] font-bold text-neutral-300">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reaction Quick Picker on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 px-1">
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(msg.id, emoji)}
                    className="hover:scale-125 transition-transform text-xs p-1 cursor-pointer"
                    title={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 shrink-0 scrollbar-none">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setInputMessage(chip)}
            className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-medium text-neutral-300 hover:text-white shrink-0 transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Bottom Composer Card */}
      <div className="bg-[#0b0e17]/95 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 sm:p-4 shadow-2xl shrink-0">
        {/* Identity bar */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <input
            type="text"
            placeholder="Your Nickname (e.g. Rishaan, Purab)..."
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/[0.08] text-xs font-semibold text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 w-44"
          />

          <select
            value={senderBadge}
            onChange={(e) => setSenderBadge(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/[0.08] text-xs font-semibold text-neutral-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {BADGES.map((b) => (
              <option key={b.value} value={b.value} className="bg-[#0b0e17]">
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Input & Send Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message in /gc... (Press Enter to send)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            maxLength={400}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
