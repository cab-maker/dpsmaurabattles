'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Swords,
  Trophy,
  MapPin,
  Bell,
  LogOut,
  Plus,
  CheckCircle,
  XCircle,
  Award,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  Flame,
  Zap,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Battle, Location, LeaderboardEntry, Announcement, AdminStats } from '@/types/database';

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<'battles' | 'leaderboard' | 'locations' | 'announcements'>('battles');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Approval Modal State (Date + Location)
  const [approvalModalBattle, setApprovalModalBattle] = useState<Battle | null>(null);
  const [approveLocationId, setApproveLocationId] = useState('');
  const [approveScheduledDate, setApproveScheduledDate] = useState('');
  const [approveStatus, setApproveStatus] = useState<'Upcoming' | 'Live'>('Upcoming');

  // Winner Modal State
  const [winnerModalBattle, setWinnerModalBattle] = useState<Battle | null>(null);
  const [selectedWinner, setSelectedWinner] = useState('');

  // Location Form State
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');

  // Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentWins, setNewStudentWins] = useState(0);

  // Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMessage, setNewAnnMessage] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [newAnnPinned, setNewAnnPinned] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStats, resBattles, resLocs, resLead, resAnn] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/admin/battles').then((r) => r.json()),
        fetch('/api/admin/locations').then((r) => r.json()),
        fetch('/api/admin/leaderboard').then((r) => r.json()),
        fetch('/api/admin/announcements').then((r) => r.json()),
      ]);

      if (resStats.stats) setStats(resStats.stats);
      if (resBattles.battles) setBattles(resBattles.battles);
      if (resLocs.locations) setLocations(resLocs.locations);
      if (resLead.leaderboard) setLeaderboard(resLead.leaderboard);
      if (resAnn.announcements) setAnnouncements(resAnn.announcements);
    } catch {
      showToast('Error loading administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.reload();
  };

  // Dedicated One-Click Approval Dialog submit
  const confirmApproval = async () => {
    if (!approvalModalBattle) return;
    try {
      const res = await fetch('/api/admin/battles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: approvalModalBattle.id,
          status: approveStatus,
          location_id: approveLocationId || null,
          scheduled_at: approveScheduledDate ? new Date(approveScheduledDate).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`✓ Battle Approved as ${approveStatus}! Now live on public board.`);
      setApprovalModalBattle(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve battle');
    }
  };

  const updateBattleField = async (id: string, updates: Record<string, any>) => {
    try {
      const res = await fetch('/api/admin/battles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Battle updated.');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update battle');
    }
  };

  const deleteBattle = async (id: string) => {
    if (!confirm('Permanently delete this battle?')) return;
    try {
      const res = await fetch(`/api/admin/battles?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete battle');
      showToast('Battle deleted.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleAwardWinner = async () => {
    if (!winnerModalBattle || !selectedWinner.trim()) return;
    try {
      const res = await fetch('/api/admin/battles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: winnerModalBattle.id,
          action: 'complete_with_winner',
          winner_name: selectedWinner.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`🏆 ${selectedWinner} crowned victor! Leaderboard updated.`);
      setWinnerModalBattle(null);
      setSelectedWinner('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to award winner');
    }
  };

  const revertCompletion = async (id: string) => {
    if (!confirm('Revert this win? The win will be subtracted from the leaderboard.')) return;
    try {
      const res = await fetch('/api/admin/battles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'revert_completion' }),
      });
      if (!res.ok) throw new Error('Failed to revert win');
      showToast('Win reverted.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  // Location Actions
  const createLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    try {
      const res = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLocName.trim(), description: newLocDesc.trim() || null }),
      });
      if (!res.ok) throw new Error('Failed to create location');
      setNewLocName('');
      setNewLocDesc('');
      showToast('Location saved.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('Delete this location?')) return;
    try {
      await fetch(`/api/admin/locations?id=${id}`, { method: 'DELETE' });
      showToast('Location removed.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  // Leaderboard Actions
  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    try {
      const res = await fetch('/api/admin/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_name: newStudentName.trim(), total_wins: newStudentWins }),
      });
      if (!res.ok) throw new Error('Failed to add student');
      setNewStudentName('');
      setNewStudentWins(0);
      showToast('Student added to leaderboard.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const adjustStudentWin = async (id: string, action: 'increment_win' | 'decrement_win') => {
    try {
      await fetch('/api/admin/leaderboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm('Remove student?')) return;
    try {
      await fetch(`/api/admin/leaderboard?id=${id}`, { method: 'DELETE' });
      showToast('Student removed.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  // Announcement Actions
  const createAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnMessage.trim()) return;
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAnnTitle.trim(),
          message: newAnnMessage.trim(),
          priority: newAnnPriority,
          is_pinned: newAnnPinned,
        }),
      });
      if (!res.ok) throw new Error('Failed to create announcement');
      setNewAnnTitle('');
      setNewAnnMessage('');
      setNewAnnPinned(false);
      showToast('Announcement posted to homepage!');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const togglePinAnnouncement = async (id: string, currentPin: boolean) => {
    try {
      await fetch('/api/admin/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_pinned: !currentPin }),
      });
      showToast('Pinned status updated.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Delete announcement?')) return;
    try {
      await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
      showToast('Announcement removed.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const pendingBattles = battles.filter((b) => b.status === 'Pending');
  const activeAndLiveBattles = battles.filter((b) => b.status === 'Upcoming' || b.status === 'Live');
  const completedBattles = battles.filter((b) => b.status === 'Completed');

  return (
    <div className="min-h-screen bg-[#060709] pb-24 text-neutral-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-2xl border border-white/20 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#090b10] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              DPSM <span className="aura-text">Aura</span> Battles Administration
            </h1>
            <p className="text-[11px] text-neutral-400">Easy Approval, Schedule & Leaderboard Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/battles"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-semibold"
          >
            <span>View Public Board</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={fetchData}
            title="Refresh Data"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="rounded-2xl p-4 bg-[#0d0f16] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Total Battles</span>
              <p className="text-2xl font-black text-white mt-1">{stats.totalBattles}</p>
            </div>
            <div className="rounded-2xl p-4 bg-amber-500/[0.05] border border-amber-500/30">
              <span className="text-[10px] uppercase font-bold text-amber-400">Pending Review</span>
              <p className="text-2xl font-black text-amber-300 mt-1">{stats.pendingSubmissions}</p>
            </div>
            <div className="rounded-2xl p-4 bg-cyan-500/[0.05] border border-cyan-500/30">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Active Public</span>
              <p className="text-2xl font-black text-cyan-300 mt-1">{stats.activeBattles}</p>
            </div>
            <div className="rounded-2xl p-4 bg-emerald-500/[0.05] border border-emerald-500/30">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Completed</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">{stats.completedBattles}</p>
            </div>
            <div className="rounded-2xl p-4 bg-purple-500/[0.05] border border-purple-500/30">
              <span className="text-[10px] uppercase font-bold text-purple-400">Contenders</span>
              <p className="text-2xl font-black text-purple-300 mt-1">{stats.totalStudents}</p>
            </div>
            <div className="rounded-2xl p-4 bg-pink-500/[0.05] border border-pink-500/30">
              <span className="text-[10px] uppercase font-bold text-pink-400">Wins Awarded</span>
              <p className="text-2xl font-black text-pink-300 mt-1">{stats.totalWins}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('battles')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'battles'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Manage Battles</span>
            {pendingBattles.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[11px] font-black animate-pulse">
                {pendingBattles.length} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'locations'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Arena Locations</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Homepage Announcements</span>
          </button>
        </div>

        {/* ================= TAB 1: BATTLES ================= */}
        {activeTab === 'battles' && (
          <div className="space-y-10">
            
            {/* 1. Pending Approvals Queue (HIGH VISIBILITY) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    Submissions Awaiting Approval ({pendingBattles.length})
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Click <strong>&quot;Approve & Schedule&quot;</strong> to choose the campus location, date/time, and immediately make it live for students.
                  </p>
                </div>
              </div>

              {pendingBattles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingBattles.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl p-5 bg-[#0f111a] border border-amber-500/30 flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            b.category === 'Mog Battle' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}>
                            {b.category}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Submitted: {new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h4 className="text-xl font-bold text-white">
                          {b.person_one} <span className="text-neutral-400 font-normal">vs</span> {b.person_two}
                        </h4>

                        {b.description && (
                          <p className="text-xs text-neutral-300 mt-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                            &ldquo;{b.description}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                        <button
                          onClick={() => deleteBattle(b.id)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold"
                        >
                          Reject / Delete
                        </button>

                        <button
                          onClick={() => {
                            setApprovalModalBattle(b);
                            setApproveLocationId(locations[0]?.id || '');
                            setApproveStatus('Upcoming');
                            setApproveScheduledDate('');
                          }}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Schedule</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl p-6 bg-[#0c0d14] border border-white/[0.06] text-center text-xs text-neutral-400">
                  No submissions pending approval right now. All submissions have been processed!
                </div>
              )}
            </div>

            {/* 2. Publicly Active Battles (Upcoming & Live) */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Active on Public Board ({activeAndLiveBattles.length})
              </h3>

              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0d14]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-white/[0.03] border-b border-white/[0.06] text-[11px] uppercase font-bold text-neutral-400">
                      <tr>
                        <th className="px-4 py-3">Contestants</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Schedule Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {activeAndLiveBattles.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-white">{b.person_one} vs {b.person_two}</p>
                            <span className="text-[10px] text-neutral-400">{b.category}</span>
                          </td>

                          <td className="px-4 py-3.5">
                            <select
                              value={b.status}
                              onChange={(e) => updateBattleField(b.id, { status: e.target.value })}
                              className="bg-[#08090d] border border-white/[0.1] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none font-semibold"
                            >
                              <option value="Upcoming">Upcoming</option>
                              <option value="Live">● LIVE</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>

                          <td className="px-4 py-3.5">
                            <select
                              value={b.location_id || ''}
                              onChange={(e) => updateBattleField(b.id, { location_id: e.target.value || null })}
                              className="bg-[#08090d] border border-white/[0.1] text-xs text-neutral-300 rounded-lg px-2.5 py-1.5 outline-none"
                            >
                              <option value="">No Location</option>
                              {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                              ))}
                            </select>
                          </td>

                          <td className="px-4 py-3.5 text-xs text-neutral-300">
                            {b.scheduled_at ? (
                              <span className="font-medium text-cyan-300">
                                {new Date(b.scheduled_at).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            ) : (
                              <span className="text-neutral-400 italic">Unscheduled</span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setWinnerModalBattle(b);
                                setSelectedWinner(b.person_one);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-black font-extrabold text-xs shadow-sm"
                            >
                              Crown Winner
                            </button>
                            <button
                              onClick={() => deleteBattle(b.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3. Completed Battles Log */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-neutral-300">
                Completed Battles Archive ({completedBattles.length})
              </h3>
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0d14]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-white/[0.03] border-b border-white/[0.06] text-[11px] uppercase font-bold text-neutral-400">
                    <tr>
                      <th className="px-4 py-3">Contestants</th>
                      <th className="px-4 py-3">Winner</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {completedBattles.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-medium text-white">{b.person_one} vs {b.person_two}</td>
                        <td className="px-4 py-3 font-bold text-amber-300 flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>{b.winner_name}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-neutral-400">{b.location?.name || 'Campus'}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => revertCompletion(b.id)}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-neutral-300"
                          >
                            Revert Win
                          </button>
                          <button
                            onClick={() => deleteBattle(b.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: LEADERBOARD ================= */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Leaderboard Contender Standings</h2>
                <p className="text-xs text-neutral-400">Manually adjust student wins or register new participants.</p>
              </div>
            </div>

            {/* Quick Add Student */}
            <form onSubmit={createStudent} className="rounded-2xl p-4 bg-[#0c0d14] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                required
                placeholder="Student Name (e.g. Maya Lin)"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-purple-500"
              />
              <input
                type="number"
                min="0"
                placeholder="Wins"
                value={newStudentWins}
                onChange={(e) => setNewStudentWins(Number(e.target.value))}
                className="w-24 px-3 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
            </form>

            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0d14]">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] border-b border-white/[0.06] text-xs uppercase font-bold text-neutral-400">
                  <tr>
                    <th className="px-4 py-3.5">Rank</th>
                    <th className="px-4 py-3.5">Student Name</th>
                    <th className="px-4 py-3.5">Total Wins</th>
                    <th className="px-4 py-3.5 text-right">Adjust Wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {leaderboard.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5 font-black text-neutral-400">#{idx + 1}</td>
                      <td className="px-4 py-3.5 font-bold text-white">{student.student_name}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-base font-black text-amber-300">{student.total_wins}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => adjustStudentWin(student.id, 'increment_win')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold"
                        >
                          +1 Win
                        </button>
                        <button
                          onClick={() => adjustStudentWin(student.id, 'decrement_win')}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold"
                        >
                          -1 Win
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1 rounded-lg text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LOCATIONS ================= */}
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Campus Arena Locations</h2>
              <p className="text-xs text-neutral-400">Create approved school zones where battles are scheduled.</p>
            </div>

            <form onSubmit={createLocation} className="rounded-2xl p-5 bg-[#0c0d14] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white">Add Campus Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Location Name (e.g. Amphitheatre)"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newLocDesc}
                  onChange={(e) => setNewLocDesc(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Save Location
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <div key={loc.id} className="rounded-2xl p-5 bg-[#0c0d14] border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{loc.name}</h4>
                    {loc.description && (
                      <p className="text-xs text-neutral-400 mt-2">{loc.description}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-end">
                    <button
                      onClick={() => deleteLocation(loc.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: ANNOUNCEMENTS ================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Homepage Announcements</h2>
              <p className="text-xs text-neutral-400">Stored in Supabase and displayed prominently at the top of the homepage.</p>
            </div>

            <form onSubmit={createAnnouncement} className="rounded-2xl p-5 bg-[#0c0d14] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white">Broadcast New Notice</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Title (e.g. ROUND 2 MATCHES TOMORROW)"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-pink-500"
                />
                <select
                  value={newAnnPriority}
                  onChange={(e) => setNewAnnPriority(e.target.value as any)}
                  className="px-4 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-pink-500"
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="High">High Priority (Pink Highlight)</option>
                  <option value="Urgent">Urgent Priority (Red Banner)</option>
                </select>
              </div>

              <textarea
                rows={2}
                required
                placeholder="Full notice message..."
                value={newAnnMessage}
                onChange={(e) => setNewAnnMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-pink-500 resize-none"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnnPinned}
                    onChange={(e) => setNewAnnPinned(e.target.checked)}
                    className="rounded bg-[#08090d] border-white/20 text-pink-500 focus:ring-0"
                  />
                  <span>Pin to top of homepage</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs"
                >
                  Publish Announcement
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    ann.is_pinned ? 'border-pink-500/40 bg-pink-500/[0.04]' : 'border-white/[0.06] bg-[#0c0d14]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-neutral-300">
                        {ann.priority}
                      </span>
                      {ann.is_pinned && (
                        <span className="text-[10px] uppercase font-bold text-pink-400">★ Pinned</span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-base mt-1">{ann.title}</h4>
                    <p className="text-xs text-neutral-300 mt-1">{ann.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePinAnnouncement(ann.id, ann.is_pinned)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white font-medium"
                    >
                      {ann.is_pinned ? 'Unpin' : 'Pin to Top'}
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: APPROVE & SCHEDULE BATTLE ================= */}
      {approvalModalBattle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl p-6 sm:p-8 max-w-lg w-full bg-[#0c0e15] border border-emerald-500/30 shadow-2xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
              </div>
              <h3 className="text-xl font-black text-white">
                {approvalModalBattle.person_one} <span className="text-neutral-400 font-normal">vs</span> {approvalModalBattle.person_two}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Category: <strong>{approvalModalBattle.category}</strong>. Configure where and when this match will happen.
              </p>
            </div>

            <div className="space-y-4">
              {/* Status selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Publish Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setApproveStatus('Upcoming')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      approveStatus === 'Upcoming'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-[#08090d] border-white/[0.1] text-neutral-400'
                    }`}
                  >
                    Upcoming Match
                  </button>
                  <button
                    type="button"
                    onClick={() => setApproveStatus('Live')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      approveStatus === 'Live'
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-[#08090d] border-white/[0.1] text-neutral-400'
                    }`}
                  >
                    ● Mark as LIVE NOW
                  </button>
                </div>
              </div>

              {/* Location selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Arena Location
                </label>
                <select
                  value={approveLocationId}
                  onChange={(e) => setApproveLocationId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="">Select an Approved Campus Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Scheduled Date & Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Scheduled Date & Time (optional)
                </label>
                <input
                  type="datetime-local"
                  value={approveScheduledDate}
                  onChange={(e) => setApproveScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090d] border border-white/[0.1] text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setApprovalModalBattle(null)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmApproval}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Confirm Approval & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CROWN WINNER ================= */}
      {winnerModalBattle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl p-6 sm:p-8 max-w-md w-full bg-[#0c0e15] border border-amber-400/30 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Crown Victor</span>
            </h3>

            <p className="text-xs text-neutral-300">
              Select the winner between <strong className="text-white">{winnerModalBattle.person_one}</strong> and{' '}
              <strong className="text-white">{winnerModalBattle.person_two}</strong>. They will automatically receive +1 win on the school leaderboard.
            </p>

            <div className="space-y-2 py-2">
              {[winnerModalBattle.person_one, winnerModalBattle.person_two].map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() => setSelectedWinner(person)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm font-bold transition-all ${
                    selectedWinner === person
                      ? 'border-amber-400 bg-amber-400/15 text-white'
                      : 'border-white/[0.08] bg-[#08090d] text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <span>{person}</span>
                  {selectedWinner === person && <CheckCircle className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setWinnerModalBattle(null)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAwardWinner}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black font-extrabold text-xs shadow-md"
              >
                Confirm Victor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
