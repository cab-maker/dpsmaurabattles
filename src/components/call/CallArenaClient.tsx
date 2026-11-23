'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Volume2, 
  Smile, 
  Crown, 
  Flame, 
  Radio, 
  Check, 
  Copy,
  ExternalLink
} from 'lucide-react';
import { playJoinCallSound } from '@/lib/sounds';

interface Participant {
  id: string;
  name: string;
  badge: string;
  isSpeaking: boolean;
  hasCamera: boolean;
  isMuted: boolean;
  raisedHand: boolean;
  color: string;
}

const ROOMS = [
  'Main Aura Arena',
  'Mog Talk Lounge',
  'Friday Pre-Battle',
  'Canteen Afterparty',
];

const REACTION_EMOJIS = ['⚡', '🔥', '👑', '🗿', '💀', '💯'];

export default function CallArenaClient() {
  const [inCall, setInCall] = useState(false);
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('Main Aura Arena');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'arena' | 'hdbroadcast'>('arena');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Simulated & dynamic peers in the room
  const [peers, setPeers] = useState<Participant[]>([
    {
      id: 'p1',
      name: 'Purab (Host)',
      badge: '👑 Mogger',
      isSpeaking: true,
      hasCamera: false,
      isMuted: false,
      raisedHand: false,
      color: 'from-pink-500 to-purple-600',
    },
    {
      id: 'p2',
      name: 'Utkarsh',
      badge: '⚡ Aura King',
      isSpeaking: false,
      hasCamera: false,
      isMuted: true,
      raisedHand: false,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'p3',
      name: 'Rishaan',
      badge: '🗿 Gigachad',
      isSpeaking: false,
      hasCamera: false,
      isMuted: false,
      raisedHand: false,
      color: 'from-emerald-500 to-teal-600',
    },
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Load username
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura_chat_name');
      if (saved) setUserName(saved);
      else setUserName('Aura Challenger');
    } catch {
      setUserName('Aura Challenger');
    }
  }, []);

  // Handle camera stream
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch {
      // User declined or no camera, graceful fallback
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
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
        startCamera();
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
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
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
        // Cancelled screen share
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
    startCamera();
  };

  const handleLeaveCall = () => {
    stopCamera();
    setInCall(false);
    setIsScreenSharing(false);
  };

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 80) + 10;
    setFloatingReactions((prev) => [...prev, { id, emoji, left }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  const copyRoomLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Randomized speaking animation for peers
  useEffect(() => {
    if (!inCall) return;
    const interval = setInterval(() => {
      setPeers((prev) =>
        prev.map((p) => {
          if (p.isMuted) return p;
          return {
            ...p,
            isSpeaking: Math.random() > 0.6,
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [inCall]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b0e17]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-5 mb-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0c12] rounded-[11px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>DPSM</span>
                <span className="aura-text">Aura</span>
                <span>Live Call Arena</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-extrabold text-cyan-400 tracking-wider">
                /call
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live audio/video calls, screen sharing &amp; mogging debates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('arena')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'arena'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Arena Call
            </button>
            <button
              onClick={() => setActiveTab('hdbroadcast')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'hdbroadcast'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              HD 50-Person Room
            </button>
          </div>

          <button
            onClick={copyRoomLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Room'}</span>
          </button>
        </div>
      </div>

      {/* Floating Reactions Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.left}%` }}
            className="absolute bottom-20 text-3xl animate-bounce transition-all duration-1000 transform -translate-y-96 opacity-0"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Main Content View */}
      {activeTab === 'hdbroadcast' ? (
        /* Embedded HD Group Conference Room (Powered by Jitsi Meet Zero-Install) */
        <div className="flex-1 bg-[#0b0e17] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[550px]">
          <div className="p-3 bg-black/60 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Full-Featured HD Audio/Video Room: DPSMAuraBattles
              </span>
            </div>
            <a
              href="https://meet.jit.si/DPSMAuraBattles2026"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <iframe
            src="https://meet.jit.si/DPSMAuraBattles2026#config.prejoinPageEnabled=false&config.startWithAudioMuted=false"
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full flex-1 border-0 min-h-[550px]"
            title="DPSM Aura Battles Live Call Room"
          />
        </div>
      ) : !inCall ? (
        /* Lobby View (Pre-join screen) */
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b0e17]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            {/* Visual avatar badge */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[2px] mx-auto mb-5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0a0c12] rounded-[14px] flex items-center justify-center">
                <Video className="w-8 h-8 text-pink-400" />
              </div>
            </div>

            <h2 className="text-xl font-black text-white tracking-tight mb-2">
              Ready to Join the <span className="aura-text">Aura Call</span>?
            </h2>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Step into the live stage with your camera, mic, and screen share to debate battle champions live.
            </p>

            <div className="space-y-4 mb-6 text-left">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Your Call Handle
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Select Room
                </label>
                <select
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {ROOMS.map((r) => (
                    <option key={r} value={r} className="bg-[#0b0e17]">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>3 students currently in room</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                  LIVE
                </span>
              </div>
            </div>

            <button
              onClick={handleJoinCall}
              className="w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
            >
              Enter Stage &amp; Join Call
            </button>
          </div>
        </div>
      ) : (
        /* In-Call Active Stage View */
        <div className="flex-1 flex flex-col bg-[#0b0e17]/90 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          {/* Room info bar */}
          <div className="px-5 py-3 bg-black/50 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold text-white tracking-wider uppercase">
                  {roomName}
                </h3>
                <span className="text-[10px] text-neutral-400">
                  {peers.length + 1} Connected in Stage
                </span>
              </div>
            </div>

            {/* Quick emoji reactions trigger */}
            <div className="flex items-center gap-1.5">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerReaction(emoji)}
                  className="px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs hover:scale-125 transition-all cursor-pointer"
                  title={`Send ${emoji} to stage`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Video / Audio Participant Grid */}
          <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto">
            {/* User's local tile */}
            <div
              className={`relative rounded-2xl overflow-hidden bg-black/80 border aspect-video flex items-center justify-center transition-all ${
                micOn
                  ? 'border-pink-500/50 shadow-lg shadow-pink-500/10'
                  : 'border-white/[0.08]'
              }`}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraOn || isScreenSharing ? 'block' : 'hidden'}`}
              />

              {!(cameraOn || isScreenSharing) && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                    {userName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs text-neutral-400">Camera Off</span>
                </div>
              )}

              {/* Status badge overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>{userName} (You)</span>
                  {raisedHand && <span className="text-amber-400">✋</span>}
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`p-1.5 rounded-lg ${
                      micOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Other peers in the room */}
            {peers.map((peer) => (
              <div
                key={peer.id}
                className={`relative rounded-2xl overflow-hidden bg-black/80 border aspect-video flex items-center justify-center transition-all ${
                  peer.isSpeaking
                    ? 'border-cyan-400/80 ring-2 ring-cyan-400/20 shadow-lg shadow-cyan-500/15'
                    : 'border-white/[0.08]'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${peer.color} flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform ${
                      peer.isSpeaking ? 'scale-110 ring-4 ring-cyan-400/40 animate-pulse' : ''
                    }`}
                  >
                    {peer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-neutral-300 font-semibold">
                    {peer.badge}
                  </span>
                </div>

                {/* Status bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white">
                    <span>{peer.name}</span>
                    {peer.isSpeaking && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div
                    className={`p-1.5 rounded-lg ${
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

          {/* Bottom Call Controls Deck */}
          <div className="p-4 bg-black/70 backdrop-blur-lg border-t border-white/[0.08] flex items-center justify-center gap-3 sm:gap-4">
            {/* Mic button */}
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

            {/* Camera button */}
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

            {/* Screen share button */}
            <button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isScreenSharing
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 ring-2 ring-cyan-500/20'
                  : 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-white'
              }`}
              title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
            >
              <MonitorUp className="w-5 h-5" />
            </button>

            {/* Raise hand button */}
            <button
              onClick={() => setRaisedHand(!raisedHand)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                raisedHand
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 ring-2 ring-amber-500/20'
                  : 'bg-white/[0.08] hover:bg-white/[0.12] border-white/10 text-white'
              }`}
              title={raisedHand ? 'Lower Hand' : 'Raise Hand'}
            >
              <Hand className="w-5 h-5" />
            </button>

            {/* Leave Call button */}
            <button
              onClick={handleLeaveCall}
              className="px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span className="hidden sm:inline">Leave Stage</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
