'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MonitorUp, 
  Hand, 
  PhoneOff, 
  Users, 
  Sparkles, 
  Share2, 
  Maximize2, 
  Minimize2,
  MessageSquare, 
  Send, 
  Radio, 
  Check, 
  Crown, 
  Flame, 
  Smile, 
  Settings, 
  Volume2, 
  Lock, 
  ShieldCheck, 
  X,
  LayoutGrid,
  UserCheck
} from 'lucide-react';
import { playJoinCallSound, playReactionSound, playMessageSound } from '@/lib/sounds';

interface Peer {
  id: string;
  name: string;
  badge: string;
  pfp: string;
  isSpeaking: boolean;
  isMuted: boolean;
  hasCamera: boolean;
  raisedHand: boolean;
}

interface InCallMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

const ROOM_OPTIONS = [
  'DPSM Main Arena',
  'Mog Talk Stage',
  'Friday Battle Hype',
  'Canteen Afterparty',
];

const REACTION_EMOJIS = ['⚡', '🔥', '👑', '🗿', '💀', '❤️', '💯'];

export default function CallArenaClient() {
  const [inCall, setInCall] = useState(false);
  const [userName, setUserName] = useState('Student');
  const [userPfp, setUserPfp] = useState('/monkey.png');
  const [roomName, setRoomName] = useState('DPSM Main Arena');

  // Media states
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'spotlight'>('grid');
  const [chatOpen, setChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // In-call messages
  const [inCallMessages, setInCallMessages] = useState<InCallMessage[]>([
    { id: '1', sender: 'Purab', text: 'Yo Friday battle is gonna be insane 🔥', time: '10:02' },
    { id: '2', sender: 'Utkarsh', text: 'Who is ready for the Mog Battle?? 💀', time: '10:04' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Floating reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Peers in room
  const [peers, setPeers] = useState<Peer[]>([
    {
      id: 'p1',
      name: 'Purab (Host)',
      badge: '👑 Mogger',
      pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Purab99',
      isSpeaking: true,
      isMuted: false,
      hasCamera: false,
      raisedHand: false,
    },
    {
      id: 'p2',
      name: 'Utkarsh',
      badge: '⚡ Aura King',
      pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Utkarsh',
      isSpeaking: false,
      isMuted: true,
      hasCamera: false,
      raisedHand: false,
    },
    {
      id: 'p3',
      name: 'Rishaan',
      badge: '🗿 Gigachad',
      pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rishaan',
      isSpeaking: false,
      isMuted: false,
      hasCamera: false,
      raisedHand: true,
    },
    {
      id: 'p4',
      name: 'Aahan',
      badge: '🔥 Challenger',
      pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aahan',
      isSpeaking: false,
      isMuted: false,
      hasCamera: false,
      raisedHand: false,
    },
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load user profile from localStorage or fallback
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('aura_chat_name');
      const savedPfp = localStorage.getItem('aura_chat_pfp');
      if (savedName) setUserName(savedName);
      if (savedPfp) setUserPfp(savedPfp);
    } catch {
      // ignore
    }
  }, []);

  // Timer for call duration
  useEffect(() => {
    if (!inCall) {
      setCallDuration(0);
      return;
    }
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [inCall]);

  // Audio level analysis for microphone activity
  const setupAudioAnalyzer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 64;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current || !micOn) {
          setAudioLevel(0);
          animFrameRef.current = requestAnimationFrame(checkVolume);
          return;
        }

        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 255) * 100)));
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch {
      // AudioContext unavailable
    }
  };

  // Start real user webcam & microphone
  const startLocalMedia = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setupAudioAnalyzer(stream);
      }
    } catch {
      // Permission denied or no camera, fallback
      setCameraOn(false);
    }
  };

  const stopLocalMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setAudioLevel(0);
  };

  const toggleCamera = () => {
    if (cameraOn) {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = false));
      }
      setCameraOn(false);
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = true));
      } else {
        startLocalMedia();
      }
      setCameraOn(true);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    }
    setMicOn(!micOn);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);

          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            if (localStreamRef.current && localVideoRef.current) {
              localVideoRef.current.srcObject = localStreamRef.current;
            }
          };
        }
      } catch {
        // User cancelled screen picker
      }
    } else {
      setIsScreenSharing(false);
      if (localStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
  };

  const handleJoinCall = () => {
    playJoinCallSound();
    setInCall(true);
    startLocalMedia();
  };

  const handleLeaveCall = () => {
    stopLocalMedia();
    setInCall(false);
    setIsScreenSharing(false);
    setRaisedHand(false);
    setChatOpen(false);
  };

  const triggerReaction = (emoji: string) => {
    playReactionSound();
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 80) + 10;
    setFloatingReactions((prev) => [...prev, { id, emoji, left }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
  };

  const handleSendInCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: InCallMessage = {
      id: String(Date.now()),
      sender: userName,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInCallMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    playMessageSound();
    setTimeout(() => {
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const copyInviteLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Randomized speaking activity for peers
  useEffect(() => {
    if (!inCall) return;
    const interval = setInterval(() => {
      setPeers((prev) =>
        prev.map((p) => {
          if (p.isMuted) return p;
          return {
            ...p,
            isSpeaking: Math.random() > 0.65,
          };
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [inCall]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- RENDER 1: LOBBY / PRE-JOIN STAGE ---
  if (!inCall) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="w-full max-w-xl bg-[#0b0e17]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0a0c12] rounded-[15px] flex items-center justify-center">
                <Radio className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">
                  DPSM <span className="aura-text">Aura</span> Call Arena
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-extrabold text-pink-400 uppercase tracking-wider">
                  NATIVE 10X
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                No third-party plugins • Unlimited HD conference • Zero disconnects
              </p>
            </div>
          </div>

          {/* Settings & Setup Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Your Screen / Call Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Select Stage Room
              </label>
              <select
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm font-semibold text-neutral-200 focus:outline-none focus:border-cyan-400 cursor-pointer transition-colors"
              >
                {ROOM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0b0e17]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Live Indicator */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {peers.length} Students Currently in Room
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Purab (Host), Utkarsh, Rishaan, Aahan
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                LIVE
              </span>
            </div>

            {/* Device Quick Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setCameraOn(!cameraOn)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  cameraOn
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    : 'bg-white/[0.04] border-white/10 text-neutral-400'
                }`}
              >
                {cameraOn ? <Video className="w-4 h-4 text-cyan-400" /> : <VideoOff className="w-4 h-4" />}
                <span>{cameraOn ? 'Camera Enabled' : 'Camera Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMicOn(!micOn)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  micOn
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/[0.04] border-white/10 text-neutral-400'
                }`}
              >
                {micOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                <span>{micOn ? 'Mic Enabled' : 'Mic Muted'}</span>
              </button>
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoinCall}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 shadow-xl shadow-purple-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Join Live Call Arena</span>
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER 2: IN-CALL STAGE (10X NATIVE VIDEO ROOM) ---
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col bg-[#05070c] relative overflow-hidden select-none">
      {/* Floating Reactions Emojis */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.left}%` }}
            className="absolute bottom-24 text-4xl animate-bounce transition-all duration-1000 transform -translate-y-96 opacity-0"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* 1. In-Call Top Stage Header */}
      <div className="h-14 px-4 bg-[#090b14]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {roomName}
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/[0.06] text-neutral-300 font-semibold">
                {formatTimer(callDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          {/* Layout switcher */}
          <button
            onClick={() => setLayoutMode(layoutMode === 'grid' ? 'spotlight' : 'grid')}
            title={`Switch to ${layoutMode === 'grid' ? 'Spotlight' : 'Grid'} view`}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Copy invite link */}
          <button
            onClick={copyInviteLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share Call'}</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Main Stage Video Area + Sliding Chat Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Video Arena */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-center overflow-y-auto">
          {/* Reaction Bar in Stream */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline mr-1">
              Live Reactions:
            </span>
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                className="px-2.5 py-1 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 text-sm hover:scale-125 transition-transform cursor-pointer"
                title={`Send ${emoji} to stage`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Participant Tiles Grid */}
          <div
            className={`grid gap-3 sm:gap-4 w-full max-w-6xl mx-auto flex-1 items-center ${
              layoutMode === 'spotlight'
                ? 'grid-cols-1 sm:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {/* User Local Video Tile */}
            <div
              className={`relative rounded-3xl overflow-hidden bg-[#0a0d17] border aspect-video flex items-center justify-center transition-all ${
                audioLevel > 15
                  ? 'border-pink-500 shadow-xl shadow-pink-500/25 ring-2 ring-pink-500/30'
                  : 'border-white/10 shadow-lg'
              } ${layoutMode === 'spotlight' ? 'sm:col-span-3 sm:row-span-2' : ''}`}
            >
              {/* Native Video Stream */}
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  cameraOn || isScreenSharing ? 'block' : 'hidden'
                }`}
              />

              {/* Avatar Placeholder when Camera is Off */}
              {!(cameraOn || isScreenSharing) && (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 shadow-xl transition-transform ${
                      audioLevel > 15 ? 'scale-110 ring-4 ring-pink-500/40 animate-pulse' : ''
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center text-white font-black text-2xl">
                      {userName.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">{userName} (You)</span>
                    <span className="text-[10px] text-neutral-400">Camera Off</span>
                  </div>
                </div>
              )}

              {/* Bottom pill overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-bold text-white shadow-md">
                  <span>{userName} (You)</span>
                  {raisedHand && <span className="text-amber-400 animate-bounce">✋</span>}
                  {audioLevel > 15 && (
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <div
                    className={`p-1.5 rounded-xl ${
                      micOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Students (Peers) */}
            {peers.map((peer) => (
              <div
                key={peer.id}
                className={`relative rounded-3xl overflow-hidden bg-[#0a0d17] border aspect-video flex items-center justify-center transition-all ${
                  peer.isSpeaking
                    ? 'border-cyan-400 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/30'
                    : 'border-white/10 shadow-lg'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 shadow-lg transition-transform ${
                      peer.isSpeaking ? 'scale-110 ring-4 ring-cyan-400/40 animate-pulse' : ''
                    }`}
                  >
                    <img
                      src={peer.pfp}
                      alt={peer.name}
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">{peer.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-neutral-300 font-semibold">
                      {peer.badge}
                    </span>
                  </div>
                </div>

                {/* Bottom pill overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-bold text-white shadow-md">
                    <span>{peer.name}</span>
                    {peer.raisedHand && <span className="text-amber-400">✋</span>}
                    {peer.isSpeaking && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  <div
                    className={`p-1.5 rounded-xl ${
                      peer.isMuted
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {peer.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sliding In-Call Chat Side Drawer */}
        {chatOpen && (
          <div className="w-80 bg-[#090b14] border-l border-white/[0.08] flex flex-col shrink-0 z-30">
            <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  In-Call Room Chat
                </h3>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {inCallMessages.map((m) => (
                <div key={m.id} className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span className="font-bold text-cyan-300">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">{m.text}</p>
                </div>
              ))}
              <div ref={chatScrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendInCallMessage} className="p-3 border-t border-white/[0.08] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say something to room..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 3. Bottom Call Controls Deck */}
      <div className="h-20 bg-[#090b14]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 flex items-center justify-center gap-3 sm:gap-4 shrink-0 z-20">
        {/* Mic Toggle */}
        <button
          onClick={toggleMic}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            micOn
              ? 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-white'
              : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400'
          }`}
          title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micOn ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={toggleCamera}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            cameraOn
              ? 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-white'
              : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400'
          }`}
          title={cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {cameraOn ? <Video className="w-5 h-5 text-cyan-400" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            isScreenSharing
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 ring-2 ring-cyan-500/20'
              : 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-white'
          }`}
          title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
        >
          <MonitorUp className="w-5 h-5" />
        </button>

        {/* Raise Hand */}
        <button
          onClick={() => setRaisedHand(!raisedHand)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            raisedHand
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 ring-2 ring-amber-500/20'
              : 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-white'
          }`}
          title={raisedHand ? 'Lower Hand' : 'Raise Hand'}
        >
          <Hand className="w-5 h-5" />
        </button>

        {/* In-Call Chat Drawer Toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            chatOpen
              ? 'bg-purple-600/30 border-purple-500/40 text-purple-300'
              : 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-white'
          }`}
          title="Toggle In-Call Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Leave Stage */}
        <button
          onClick={handleLeaveCall}
          className="px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 active:scale-95 ml-2"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">Leave Stage</span>
        </button>
      </div>
    </div>
  );
}
