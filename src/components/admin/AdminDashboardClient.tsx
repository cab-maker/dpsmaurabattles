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

  // Modal / Action states
  const [winnerModalBattle, setWinnerModalBattle] = useState<Battle | null>(null);
  const [selectedWinner, setSelectedWinner] = useState('');

  // New Location Form
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');

  // New Student Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentWins, setNewStudentWins] = useState(0);

  // New Announcement Form
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMessage, setNewAnnMessage] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [newAnnPinned, setNewAnnPinned] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  // Battles Actions
  const updateBattle = async (id: string, updates: Record<string, any>) => {
    try {
      const res = await fetch('/api/admin/battles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Battle updated successfully!');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update battle');
    }
  };

  const deleteBattle = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this battle?')) return;
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

      showToast(`Winner ${selectedWinner} awarded! Leaderboard incremented.`);
      setWinnerModalBattle(null);
      setSelectedWinner('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to award winner');
    }
  };

  const revertCompletion = async (id: string) => {
    if (!confirm('Reverting will remove the awarded win from the student leaderboard. Continue?')) return;
    try {
      const res = await fetch('/api/admin/battles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'revert_completion' }),
      });
      if (!res.ok) throw new Error('Failed to revert result');
      showToast('Result reverted and student win adjusted.');
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
      showToast('New location registered.');
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
    if (!confirm('Remove this student from the leaderboard?')) return;
    try {
      await fetch(`/api/admin/leaderboard?id=${id}`, { method: 'DELETE' });
      showToast('Student removed.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const resetAllStats = async () => {
    if (!confirm('RESET ALL LEADERBOARD WINS TO 0? This cannot be undone.')) return;
    try {
      await fetch('/api/admin/leaderboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all' }),
      });
      showToast('All leaderboard records reset to 0.');
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
    if (!confirm('Delete this announcement?')) return;
    try {
      await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
      showToast('Announcement removed.');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-purple-600 text-white font-medium text-xs shadow-2xl border border-white/20 animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="border-b border-white/[0.08] bg-[#090b10] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span className="aura-text">Aura</span> Arena Administration
            </h1>
            <p className="text-[11px] text-neutral-400">Full Control Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            title="Refresh All Records"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Metric Cards Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="glass-panel rounded-2xl p-4 border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Total Battles</span>
              <p className="text-2xl font-black text-white mt-1">{stats.totalBattles}</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 bg-amber-500/[0.03]">
              <span className="text-[10px] uppercase font-bold text-amber-400">Pending Review</span>
              <p className="text-2xl font-black text-amber-300 mt-1">{stats.pendingSubmissions}</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 bg-cyan-500/[0.03]">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Active / Live</span>
              <p className="text-2xl font-black text-cyan-300 mt-1">{stats.activeBattles}</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/[0.03]">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Completed</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">{stats.completedBattles}</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-purple-500/20 bg-purple-500/[0.03]">
              <span className="text-[10px] uppercase font-bold text-purple-400">Contenders</span>
              <p className="text-2xl font-black text-purple-300 mt-1">{stats.totalStudents}</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-pink-500/20 bg-pink-500/[0.03]">
              <span className="text-[10px] uppercase font-bold text-pink-400">Wins Awarded</span>
              <p className="text-2xl font-black text-pink-300 mt-1">{stats.totalWins}</p>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('battles')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'battles'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Battles & Submissions</span>
            {stats && stats.pendingSubmissions > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black">
                {stats.pendingSubmissions}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard Standings</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'locations'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Arena Locations</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Homepage Announcements</span>
          </button>
        </div>

        {/* ================= TAB 1: BATTLES ================= */}
        {activeTab === 'battles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Battles Management</h2>
              <span className="text-xs text-neutral-400">Total: {battles.length}</span>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.03] border-b border-white/[0.06] text-xs uppercase font-bold text-neutral-400">
                    <tr>
                      <th className="px-4 py-3.5">Contestants</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Location</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Winner</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {battles.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-white">{b.person_one} <span className="text-neutral-400 font-normal">vs</span> {b.person_two}</p>
                          {b.description && <p className="text-[11px] text-neutral-400 italic line-clamp-1">&ldquo;{b.description}&rdquo;</p>}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full ${
                            b.category === 'Mog Battle' ? 'bg-pink-500/10 text-pink-400' : 'bg-cyan-500/10 text-cyan-400'
                          }`}>
                            {b.category}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <select
                            value={b.location_id || ''}
                            onChange={(e) => updateBattle(b.id, { location_id: e.target.value || null })}
                            className="bg-[#0b0d13] border border-white/[0.1] text-xs text-neutral-200 rounded-lg px-2 py-1 outline-none focus:border-purple-500"
                          >
                            <option value="">Unassigned</option>
                            {locations.map((loc) => (
                              <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                          </select>
                        </td>

                        <td className="px-4 py-3.5">
                          <select
                            value={b.status}
                            onChange={(e) => updateBattle(b.id, { status: e.target.value })}
                            className="bg-[#0b0d13] border border-white/[0.1] text-xs text-neutral-200 rounded-lg px-2 py-1 outline-none focus:border-purple-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Live">Live</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="px-4 py-3.5">
                          {b.status === 'Completed' ? (
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                              <Trophy className="w-3.5 h-3.5" />
                              {b.winner_name}
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-400">Undecided</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right space-x-1">
                          {b.status === 'Pending' && (
                            <button
                              onClick={() => updateBattle(b.id, { status: 'Upcoming' })}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold"
                            >
                              Approve
                            </button>
                          )}

                          {b.status !== 'Completed' && (
                            <button
                              onClick={() => {
                                setWinnerModalBattle(b);
                                setSelectedWinner(b.person_one);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold"
                            >
                              Declare Winner
                            </button>
                          )}

                          {b.status === 'Completed' && (
                            <button
                              onClick={() => revertCompletion(b.id)}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-neutral-300 text-xs font-semibold"
                            >
                              Revert Win
                            </button>
                          )}

                          <button
                            onClick={() => deleteBattle(b.id)}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
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
        )}

        {/* ================= TAB 2: LEADERBOARD ================= */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Leaderboard & Win Tracking</h2>
                <p className="text-xs text-neutral-400">Directly edit rankings, award custom wins, or reset scores.</p>
              </div>
              <button
                onClick={resetAllStats}
                className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-all self-start"
              >
                Reset All Statistics to 0
              </button>
            </div>

            {/* Manual Add Student Card */}
            <form onSubmit={createStudent} className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                required
                placeholder="Student Name (e.g. Marcus V.)"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0b0d13] border border-white/[0.1] text-xs text-white outline-none focus:border-purple-500"
              />
              <input
                type="number"
                min="0"
                placeholder="Initial Wins"
                value={newStudentWins}
                onChange={(e) => setNewStudentWins(Number(e.target.value))}
                className="w-28 px-3 py-2.5 rounded-xl bg-[#0b0d13] border border-white/[0.1] text-xs text-white outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
            </form>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08]">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] border-b border-white/[0.06] text-xs uppercase font-bold text-neutral-400">
                  <tr>
                    <th className="px-4 py-3.5">Rank</th>
                    <th className="px-4 py-3.5">Student Name</th>
                    <th className="px-4 py-3.5">Total Wins</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
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
                          title="Add 1 Win"
                        >
                          +1 Win
                        </button>
                        <button
                          onClick={() => adjustStudentWin(student.id, 'decrement_win')}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold"
                          title="Subtract 1 Win"
                        >
                          -1 Win
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1 rounded-lg text-red-400 hover:bg-red-500/10"
                          title="Delete student"
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
              <h2 className="text-xl font-bold text-white">Arena Locations</h2>
              <p className="text-xs text-neutral-400">
                Only admin-approved locations can be assigned to battles to ensure student safety.
              </p>
            </div>

            {/* Add Location Form */}
            <form onSubmit={createLocation} className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white">Create New Approved Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Location Name (e.g. Gymnasium Courtyard)"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#0b0d13] border border-white/[0.1] text-xs text-white outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Optional Description"
                  value={newLocDesc}
                  onChange={(e) => setNewLocDesc(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#0b0d13] border border-white/[0.1] text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Save New Location
              </button>
            </form>

            {/* Existing Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <div key={loc.id} className="glass-panel rounded-2xl p-5 border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">{loc.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
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
              <h2 className="text-xl font-bold text-white">Permanent Announcements</h2>
              <p className="text-xs text-neutral-400">
                Announcements are permanently saved to Supabase and immediately appear at the top of the homepage.
              </p>
            </div>

            {/* Create Announcement Form */}
            <form onSubmit={createAnnouncement} className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white">Broadcast New Announcement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Announcement Title (e.g. FRIDAY SCHEDULE LIVE)"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#0b0d13] border border-white/[0.1] text-xs text-white outline-none focus:border-pink-500"
                />
                <select
                  value={newAnnPriority}
                  onChange={(e) => setNewAnnPriority(e.target.value as any)}
                  className="px-4 py-2.5 rounded-xl bg-[#0b0d13] border border-white/[0.1] text-xs text-white outline-none focus:border-pink-500"
                >
                  <option value="Normal">Priority: Normal</option>
                  <option value="High">Priority: High (Pink Glow)</option>
                  <option value="Urgent">Priority: Urgent (Red Alert)</option>
                </select>
              </div>

              <textarea
                rows={2}
                required
                placeholder="Full announcement message..."
                value={newAnnMessage}
                onChange={(e) => setNewAnnMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0d13] border border-white/[0.1] text-xs text-white outline-none focus:border-pink-500 resize-none"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnnPinned}
                    onChange={(e) => setNewAnnPinned(e.target.checked)}
                    className="rounded bg-[#0b0d13] border-white/20 text-pink-500 focus:ring-0"
                  />
                  <span>Pin prominently to the top of homepage</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs"
                >
                  Publish Announcement
                </button>
              </div>
            </form>

            {/* List Announcements */}
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`glass-panel rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    ann.is_pinned ? 'border-pink-500/40 bg-pink-500/[0.04]' : 'border-white/[0.06]'
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
                      title="Delete"
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

      {/* WINNER SELECTION MODAL */}
      {winnerModalBattle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-400/30 shadow-2xl relative">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Conclude Match & Crown Winner</span>
            </h3>

            <p className="text-xs text-neutral-300 mt-2">
              Select the victor between <strong className="text-white">{winnerModalBattle.person_one}</strong> and{' '}
              <strong className="text-white">{winnerModalBattle.person_two}</strong>. Their win will be automatically incremented on the official leaderboard.
            </p>

            <div className="my-6 space-y-2">
              <label
                onClick={() => setSelectedWinner(winnerModalBattle.person_one)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedWinner === winnerModalBattle.person_one
                    ? 'border-amber-400 bg-amber-400/15 text-white font-bold'
                    : 'border-white/[0.08] bg-[#0b0d13] text-neutral-300'
                }`}
              >
                <span>{winnerModalBattle.person_one}</span>
                {selectedWinner === winnerModalBattle.person_one && <CheckCircle className="w-5 h-5 text-amber-400" />}
              </label>

              <label
                onClick={() => setSelectedWinner(winnerModalBattle.person_two)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedWinner === winnerModalBattle.person_two
                    ? 'border-amber-400 bg-amber-400/15 text-white font-bold'
                    : 'border-white/[0.08] bg-[#0b0d13] text-neutral-300'
                }`}
              >
                <span>{winnerModalBattle.person_two}</span>
                {selectedWinner === winnerModalBattle.person_two && <CheckCircle className="w-5 h-5 text-amber-400" />}
              </label>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setWinnerModalBattle(null)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAwardWinner}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
              >
                Confirm Winner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
