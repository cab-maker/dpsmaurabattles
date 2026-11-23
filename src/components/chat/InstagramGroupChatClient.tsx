'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Phone, 
  Video, 
  Info, 
  Send, 
  Heart, 
  Smile, 
  Shield, 
  ShieldAlert, 
  Trash2, 
  Ban, 
  Lock, 
  Check, 
  Volume2, 
  VolumeX, 
  X,
  Camera,
  Image as ImageIcon,
  Mic,
  MoreVertical
} from 'lucide-react';
import { ChatMessage, ChatUser } from '@/types/database';
import { playMessageSound, playReactionSound, playDeniedSound } from '@/lib/sounds';

const AVATAR_PRESETS = [
  { id: '1', name: 'Monkey Mascot', url: '/monkey.png' },
  { id: '2', name: 'Sigma Mogger', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mogger99' },
  { id: '3', name: 'Aura Beast', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AuraBeast' },
  { id: '4', name: 'Gigachad', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gigachad' },
  { id: '5', name: 'Neon Samurai', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Samurai' },
  { id: '6', name: 'Cyber Agent', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberAgent' },
  { id: '7', name: 'King Aura', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=KingAura' },
  { id: '8', name: 'Phoenix', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Phoenix' },
];

const REACTION_EMOJIS = ['❤️', '🔥', '🗿', '💀', '⚡', '👑', '🧢', '💯'];

export default function InstagramGroupChatClient({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [currentIp, setCurrentIp] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState('');

  // Profile setup modal state
  const [setupName, setSetupName] = useState('');
  const [setupPfp, setSetupPfp] = useState(AVATAR_PRESETS[0].url);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState('');

  // Chat input state
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Context menu for moderation
  const [selectedMsgForMod, setSelectedMsgForMod] = useState<ChatMessage | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(initialMessages.length);
  const [isLockedToBottom, setIsLockedToBottom] = useState(true);

  // 1. Fetch IP-locked user profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/chat/user');
        if (res.ok) {
          const data = await res.json();
          setCurrentIp(data.ip || '');
          if (data.user) {
            if (data.user.is_banned) {
              setIsBanned(true);
              setBanReason(data.user.ban_reason || 'Aura code violation');
            } else {
              setCurrentUser(data.user);
            }
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setIsLockedToBottom(nearBottom);
  };

  // Automatically lock scroll to bottom on mount and whenever messages update
  useEffect(() => {
    scrollToBottom('auto');
    const timer = setTimeout(() => scrollToBottom('auto'), 150);
    return () => clearTimeout(timer);
  }, [currentUser]);

  useEffect(() => {
    if (isLockedToBottom) {
      scrollToBottom('smooth');
      const timer = setTimeout(() => scrollToBottom('smooth'), 80);
      return () => clearTimeout(timer);
    }
  }, [messages, isLockedToBottom]);

  // 2. Poll messages every 1 second and keep scroll locked
  useEffect(() => {
    if (isBanned || !currentUser) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            if (data.messages.length > lastCountRef.current) {
              if (soundEnabled) playMessageSound();
              if (isLockedToBottom) {
                setTimeout(() => scrollToBottom('smooth'), 40);
              }
            }
            lastCountRef.current = data.messages.length;
            setMessages(data.messages);
          }
        } else if (res.status === 403) {
          const data = await res.json();
          if (data.is_banned) {
            setIsBanned(true);
            setBanReason(data.ban_reason || 'Banned by Admin');
          }
        }
      } catch {
        // ignore
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBanned, currentUser, soundEnabled, isLockedToBottom]);

  // 3. Register IP-locked Profile
  const handleRegisterProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!setupName.trim() || setupName.trim().length < 2) {
      setRegError('Name must be at least 2 characters.');
      return;
    }

    setIsRegistering(true);

    try {
      const res = await fetch('/api/chat/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: setupName.trim(),
          pfp_url: setupPfp,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setCurrentUser(data.user);
      } else {
        setRegError(data.error || 'Failed to register profile for this IP.');
        if (data.user) {
          setCurrentUser(data.user);
        }
      }
    } catch {
      setRegError('Network error while binding profile.');
    } finally {
      setIsRegistering(false);
    }
  };

  // 4. Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending || !currentUser) return;

    setIsSending(true);
    setInputText('');

    const optimistic: ChatMessage = {
      id: 'opt-' + Date.now(),
      sender_name: currentUser.name,
      sender_pfp: currentUser.pfp_url,
      sender_ip: currentIp,
      sender_badge: 'Student',
      message: text,
      reactions: {},
      is_pinned: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setIsLockedToBottom(true);
    setTimeout(() => scrollToBottom('smooth'), 30);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optimistic.id ? data.message : m))
          );
        }
      } else if (res.status === 403) {
        setIsBanned(true);
        setBanReason('You have been banned from this GC.');
      }
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  // 5. React to Message
  const handleReact = async (messageId: string, emoji: string) => {
    if (soundEnabled) playReactionSound();

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

  // 6. Admin Authentication
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (adminPasswordInput.trim() === 'auraadmin2026!') {
      setIsAdmin(true);
      setAdminModalOpen(false);
      setAdminPasswordInput('');
    } else {
      playDeniedSound();
      setAdminError('Invalid admin master key.');
    }
  };

  // 7. Admin Moderation: IP Ban
  const handleAdminBanUser = async (targetIp: string) => {
    if (!isAdmin || !targetIp) return;
    if (!confirm(`Are you sure you want to IP BAN user with IP: ${targetIp}?`)) return;

    try {
      const res = await fetch('/api/chat/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_ip: targetIp,
          admin_password: 'auraadmin2026!',
          action: 'ban',
        }),
      });

      if (res.ok) {
        alert(`IP ${targetIp} has been permanently banned.`);
        setSelectedMsgForMod(null);
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to ban IP.');
      }
    } catch {
      alert('Error communicating with server.');
    }
  };

  // 8. Admin Moderation: Delete Message
  const handleAdminDeleteMessage = async (msgId: string) => {
    if (!isAdmin || !msgId) return;

    try {
      const res = await fetch('/api/chat/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: msgId,
          admin_password: 'auraadmin2026!',
        }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        setSelectedMsgForMod(null);
      }
    } catch {
      // ignore
    }
  };

  // --- RENDER BANNED SCREEN ---
  if (isBanned) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#12080a] border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500">
            <Ban className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
            Access Terminated
          </h2>
          <p className="text-sm text-red-300 mb-4 font-mono">
            YOUR IP HAS BEEN BANNED FROM THE GC BY THE ADMIN.
          </p>
          <div className="p-3 rounded-xl bg-black/60 border border-red-500/20 text-xs text-neutral-400 font-mono mb-4">
            Reason: {banReason || 'Aura violation / trolling'}
          </div>
          <p className="text-xs text-neutral-500">
            This ban is tied to your network IP and cannot be bypassed.
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER LOADING STATE ---
  if (isLoadingProfile) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
      </div>
    );
  }

  // --- RENDER PROFILE ONBOARDING (NAME & PFP REQUIRED) ---
  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-[2px] mx-auto mb-3 shadow-md">
              <div className="w-full h-full bg-[#121212] rounded-full flex items-center justify-center">
                <Smile className="w-7 h-7 text-pink-400" />
              </div>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Join the <span className="aura-text">Aura GC</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Choose your profile. It will be permanently bound to your device IP.
            </p>
          </div>

          <form onSubmit={handleRegisterProfile} className="space-y-5">
            {/* Choose Avatar Preset */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                1. Select Your Avatar (PFP)
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = setupPfp === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSetupPfp(preset.url)}
                      className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-1 bg-black/40 flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'border-pink-500 ring-2 ring-pink-500/30 scale-105 shadow-md shadow-pink-500/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-contain rounded-xl"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                2. Enter Your Real/Screen Name
              </label>
              <input
                type="text"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="e.g. Purab, Rishaan, Utkarsh..."
                maxLength={25}
                required
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-[#333] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium"
              />
            </div>

            {/* IP Security Notice */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200">
              <Lock className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
              <div>
                <span className="font-bold">Anti-Alts Security:</span> Your selected name &amp; avatar will be permanently tied to IP{' '}
                <span className="font-mono text-purple-300 font-bold">{currentIp || 'Connected'}</span>. Multiple accounts from one device are blocked.
              </div>
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                {regError}
              </div>
            )}

            <button
              type="submit"
              disabled={isRegistering || !setupName.trim()}
              className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 shadow-lg shadow-pink-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? 'Locking Profile to IP...' : 'Enter Group Chat'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN INSTAGRAM GROUP CHAT UI ---
  return (
    <div className="w-full h-full flex flex-col bg-[#000000] overflow-hidden">
      {/* 1. Instagram Direct Header */}
      <div className="h-16 px-4 sm:px-8 border-b border-[#262626] flex items-center justify-between shrink-0 bg-[#000000]/95 backdrop-blur-md z-10 w-full">
        <div className="flex items-center gap-3">
          {/* Overlapping Avatar Stack (Instagram style) */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 shadow-sm">
              <img
                src={currentUser.pfp_url}
                alt="My PFP"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border-2 border-black" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight">
                DPSM Aura Battles GC
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                INSTA
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-none mt-0.5 flex items-center gap-1.5">
              <span className="text-[#10b981] font-semibold">Active now</span>
              <span>•</span>
              <span>{currentUser.name} (You)</span>
            </p>
          </div>
        </div>

        {/* Action icons (Phone, Video, Admin, Info) */}
        <div className="flex items-center gap-2 sm:gap-3 text-neutral-200">
          <Link
            href="/call"
            title="Start Audio Call"
            className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors cursor-pointer"
          >
            <Phone className="w-5 h-5 text-neutral-300 hover:text-white" />
          </Link>

          <Link
            href="/call"
            title="Start Video Call"
            className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors cursor-pointer"
          >
            <Video className="w-5 h-5 text-neutral-300 hover:text-white" />
          </Link>

          {/* Admin toggle */}
          <button
            onClick={() => (isAdmin ? setIsAdmin(false) : setAdminModalOpen(true))}
            title={isAdmin ? 'Admin Mode Enabled (Click to logout)' : 'Admin Login'}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isAdmin ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-[#1a1a1a] text-neutral-400'
            }`}
          >
            <Shield className="w-5 h-5" />
          </button>

          <button
            onClick={() => setInfoModalOpen(true)}
            title="Group Chat Info"
            className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors cursor-pointer text-neutral-400"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin banner if active */}
      {isAdmin && (
        <div className="bg-purple-950/80 border-b border-purple-500/30 px-4 py-2 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2 font-mono">
            <ShieldAlert className="w-4 h-4 text-pink-400" />
            <span>ADMIN MODE ACTIVE • Tap any message to ban IP or delete message</span>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="text-[10px] uppercase font-bold text-pink-400 hover:underline cursor-pointer"
          >
            Exit Admin
          </button>
        </div>
      )}

      {/* 2. Instagram Messages Stream (Locked to bottom) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 relative"
      >
        {/* Intro banner */}
        <div className="text-center my-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 mb-2">
            <img
              src="/monkey.png"
              alt="Aura Battles Mascot"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
          <h3 className="text-sm font-bold text-white">DPSM Aura Battles GC</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Voluntary student banter, mog debates &amp; arena hype.
          </p>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.sender_name.toLowerCase() === currentUser.name.toLowerCase();
          const hasPfp = msg.sender_pfp || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(msg.sender_name);

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 group ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Other user's avatar */}
              {!isMe && (
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/10 mb-1">
                  <img
                    src={hasPfp}
                    alt={msg.sender_name}
                    className="w-full h-full object-cover bg-[#1c1c1c]"
                  />
                </div>
              )}

              {/* Message Bubble + Meta */}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[78%] sm:max-w-md`}>
                {!isMe && (
                  <span className="text-[11px] text-neutral-400 font-semibold px-2 mb-0.5">
                    {msg.sender_name}
                  </span>
                )}

                {/* Bubble */}
                <div
                  onDoubleClick={() => handleReact(msg.id, '❤️')}
                  className={`relative px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm transition-all select-text ${
                    isMe
                      ? 'bg-gradient-to-tr from-[#7928ca] via-[#c026d3] to-[#ff0080] text-white rounded-2xl rounded-br-sm'
                      : 'bg-[#262626] text-white rounded-2xl rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>

                  {/* Reaction Badges on Bubble */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="absolute -bottom-2.5 right-2 flex items-center gap-1 bg-[#1c1c1c] border border-white/10 px-1.5 py-0.5 rounded-full shadow-md text-[11px]">
                      {Object.entries(msg.reactions).map(([emoji, count]) => {
                        if (!count || count <= 0) return null;
                        return (
                          <span key={emoji} className="flex items-center gap-0.5">
                            <span>{emoji}</span>
                            {count > 1 && <span className="text-[10px] text-neutral-400">{count}</span>}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick react & Admin action buttons on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 mt-1 px-1">
                  <button
                    onClick={() => handleReact(msg.id, '❤️')}
                    className="text-xs hover:scale-125 transition-transform text-neutral-400 hover:text-red-500 cursor-pointer"
                    title="Like message"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => handleReact(msg.id, '🔥')}
                    className="text-xs hover:scale-125 transition-transform cursor-pointer"
                    title="Fire"
                  >
                    🔥
                  </button>
                  <button
                    onClick={() => handleReact(msg.id, '💀')}
                    className="text-xs hover:scale-125 transition-transform cursor-pointer"
                    title="Skull"
                  >
                    💀
                  </button>

                  {/* Admin moderate trigger */}
                  {isAdmin && (
                    <button
                      onClick={() => setSelectedMsgForMod(msg)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/40 cursor-pointer ml-1"
                    >
                      MOD
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />

        {/* Floating Auto-Scroll Lock Button if scrolled up */}
        {!isLockedToBottom && (
          <button
            type="button"
            onClick={() => {
              setIsLockedToBottom(true);
              scrollToBottom('smooth');
            }}
            className="fixed bottom-20 right-6 z-30 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 animate-bounce"
          >
            <span>↓ Jump to latest</span>
          </button>
        )}
      </div>

      {/* 3. Instagram Direct Bottom Composer */}
      <div className="p-3 bg-[#000000] border-t border-[#262626] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Instagram Pill Input */}
          <div className="flex-1 bg-[#1a1a1a] border border-[#262626] rounded-full px-4 py-2.5 flex items-center gap-3 transition-colors focus-within:border-[#383838]">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              maxLength={500}
              className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
            />

            {/* Quick heart trigger when empty */}
            {!inputText.trim() && (
              <button
                type="button"
                onClick={() => handleSendMessage('❤️')}
                className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Send Heart"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </button>
            )}
          </div>

          {/* Send text button (Instagram style) */}
          {inputText.trim() && (
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2.5 text-sm font-bold text-[#0095f6] hover:text-[#1877f2] transition-colors cursor-pointer disabled:opacity-50"
            >
              Send
            </button>
          )}
        </form>
      </div>

      {/* --- ADMIN MODAL (ENTER ADMIN KEY) --- */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setAdminModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Admin Authentication</h3>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => {
                  setAdminPasswordInput(e.target.value);
                  if (adminError) setAdminError('');
                }}
                placeholder="Enter admin password..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-[#333] text-sm text-white focus:outline-none focus:border-purple-500"
              />

              {adminError && <p className="text-xs text-red-400">{adminError}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 transition-colors"
              >
                Activate Admin Mode
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- ADMIN MODERATION POPUP (BAN IP / DELETE MESSAGE) --- */}
      {selectedMsgForMod && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#181818] border border-red-500/30 rounded-2xl p-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedMsgForMod(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Moderate User &amp; Message</h3>
            </div>

            <div className="bg-black/50 p-3 rounded-xl border border-white/5 mb-4 text-xs font-mono">
              <p className="text-white font-bold">{selectedMsgForMod.sender_name}</p>
              <p className="text-neutral-400 mt-1">IP: {selectedMsgForMod.sender_ip || 'Hidden/Local'}</p>
              <p className="text-neutral-300 italic mt-2">"{selectedMsgForMod.message}"</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleAdminDeleteMessage(selectedMsgForMod.id)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Message</span>
              </button>

              {selectedMsgForMod.sender_ip && (
                <button
                  onClick={() => handleAdminBanUser(selectedMsgForMod.sender_ip!)}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  <span>IP Ban User ({selectedMsgForMod.sender_ip})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- INFO MODAL --- */}
      {infoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-2xl relative">
            <button
              onClick={() => setInfoModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-3">Group Chat Info</h3>
            <div className="space-y-3 text-xs text-neutral-300">
              <p>• <strong>Group:</strong> DPSM Aura Battles Official GC</p>
              <p>• <strong>Your Bound Identity:</strong> {currentUser.name}</p>
              <p>• <strong>Locked Device IP:</strong> <span className="font-mono text-purple-300">{currentIp}</span></p>
              <p>• <strong>Audio/Video Call:</strong> Tap the phone or camera icon to enter the Live Call Arena (/call).</p>
              <p className="text-neutral-500 text-[11px] pt-2 border-t border-white/10">
                Rule: Zero bullying or impersonation. Violators are permanently IP banned.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
