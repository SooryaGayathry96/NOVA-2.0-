import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Compass,
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { playClick, playSuccess } = useAudio();

  const [analytics, setAnalytics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<'overview' | 'users' | 'new-mission' | 'new-module'>('overview');

  // New Mission form
  const [missionForm, setMissionForm] = useState({
    missionCode: 'MISSION-F',
    title: 'Lunar Gateway Orbit & Solar Array Deployment',
    category: 'Space Exploration',
    difficulty: 'Intermediate',
    xpReward: 200,
    badgeCode: 'SPACE_EXPLORER',
    description: 'Establish high-elliptical near-rectilinear halo orbit around the Moon and deploy solar electric propulsion panels.',
    objectives: 'Execute translunar injection burn; Match halo orbit period; Deploy solar arrays',
    instructions: 'Monitor delta-v expenditure; Align sun-tracking gimbals',
    activityType: 'navigation',
  });

  // New Module form
  const [moduleForm, setModuleForm] = useState({
    title: 'Exoplanets and Astrobiology',
    category: 'Astronomy',
    order: 11,
    readTimeMinutes: 7,
    xpReward: 80,
    description: 'The search for habitable exoplanets in the Goldilocks zone using the transit method and radial velocity.',
    heading: 'The Habitable Zone',
    body: 'The Goldilocks zone is the orbital band around a star where liquid water can exist on a planetary surface without boiling or freezing.',
    fact1: 'Over 5,500 exoplanets have been confirmed by NASA Kepler and TESS missions.',
  });

  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [anRes, uRes] = await Promise.all([
          api.getAdminAnalytics(),
          api.getAdminUsers(),
        ]);
        if (anRes.success) setAnalytics(anRes.analytics);
        if (uRes.success) setUsersList(uRes.users);
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...missionForm,
        objectives: missionForm.objectives.split(';').map((s) => s.trim()),
        instructions: missionForm.instructions.split(';').map((s) => s.trim()),
        activityData: {
          steps: [
            {
              id: 'gw-1',
              title: 'Translunar Injection',
              scenario: 'Spacecraft is approaching the Moon. To insert into the Lunar Near-Rectilinear Halo Orbit, execute the orbital braking sequence.',
              options: ['Fire main bi-propellant engine for 180 seconds retrograde', 'Eject service module', 'Accelerate toward lunar surface'],
              correctAnswer: 0,
              explanation: 'Retrograde engine braking captures the spacecraft from an escape trajectory into the Moon’s gravity well.'
            }
          ]
        }
      };
      const res = await api.createAdminMission(payload);
      if (res.success) {
        playSuccess();
        setFormMessage('New Mission deployed into Mission Control successfully!');
        setTimeout(() => setFormMessage(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Mission deployment error');
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: moduleForm.title,
        category: moduleForm.category,
        order: Number(moduleForm.order),
        readTimeMinutes: Number(moduleForm.readTimeMinutes),
        xpReward: Number(moduleForm.xpReward),
        description: moduleForm.description,
        content: [
          {
            heading: moduleForm.heading,
            body: moduleForm.body,
            facts: [moduleForm.fact1],
            illustrationKey: 'exoplanet'
          }
        ]
      };
      const res = await api.createAdminModule(payload);
      if (res.success) {
        playSuccess();
        setFormMessage('New Educational Module published to Academy!');
        setTimeout(() => setFormMessage(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Module publishing error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-space-900 border border-rose-500/40 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="font-display font-extrabold text-xl text-white">Access Forbidden</h2>
        <p className="text-xs text-slate-300">
          This secure terminal is restricted to authorized NASA Flight Directors and Administrators.
        </p>
      </div>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-semibold tracking-wider uppercase mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Flight Director Operations Command</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Administrator Mission Command
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Monitor real-time training analytics, oversee enrolled astronaut cadet progress, and publish new space flight curriculum modules.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs font-semibold shrink-0">
            <span>Clearance Level: OMEGA (Director)</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="mt-6 pt-6 border-t border-space-800 flex items-center space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Analytics', icon: TrendingUp },
            { id: 'users', label: 'Registered Cadets', icon: Users },
            { id: 'new-mission', label: 'Deploy New Mission', icon: PlusCircle },
            { id: 'new-module', label: 'Publish Academy Module', icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClick();
                  setTab(item.id as any);
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  tab === item.id
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'bg-space-950/60 text-slate-400 border border-space-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {formMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{formMessage}</span>
        </div>
      )}

      {/* Tab: Overview */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-space-900 border border-space-800">
              <span className="text-slate-400 text-xs block mb-1">Enrolled Astronauts</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {analytics.totalUsers}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono block mt-1">Verified Accounts</span>
            </div>

            <div className="p-5 rounded-2xl bg-space-900 border border-space-800">
              <span className="text-slate-400 text-xs block mb-1">Missions Completed</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {analytics.completedMissions}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block mt-1">Flown & Validated</span>
            </div>

            <div className="p-5 rounded-2xl bg-space-900 border border-space-800">
              <span className="text-slate-400 text-xs block mb-1">Quiz Average Score</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {analytics.averageQuizScore}%
              </span>
              <span className="text-[10px] text-purple-400 font-mono block mt-1">
                From {analytics.totalQuizAttempts} Attempts
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-space-900 border border-space-800">
              <span className="text-slate-400 text-xs block mb-1">Total XP Awarded</span>
              <span className="font-display font-extrabold text-2xl text-amber-400">
                {analytics.totalXPDistributed}
              </span>
              <span className="text-[10px] text-amber-500 font-mono block mt-1">XP Points</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-space-900 border border-space-800">
            <h3 className="font-display font-bold text-base text-white mb-2">
              System Telemetry Health
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Database synchronization is operational with zero runtime anomalies. All incoming quiz evaluations and mission vectors are rigorously validated on the Express backend before commit.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {tab === 'users' && (
        <div className="bg-space-900 border border-space-800 rounded-3xl overflow-hidden p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-white">
            Astronaut Trainee Enlistment Registry ({usersList.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950/80 border-b border-space-800 text-[11px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-3">Callsign / Name</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Rank Tier</th>
                  <th className="py-3 px-3 text-right">Flight XP</th>
                  <th className="py-3 px-3 text-right">Enlist Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-850">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-space-850/40">
                    <td className="py-3 px-3 font-semibold text-white">
                      {u.callsign || u.name}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          u.role === 'admin'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-space-800 text-slate-300'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-cyan-300">{u.rank}</td>
                    <td className="py-3 px-3 text-right font-mono text-amber-400 font-bold">
                      {u.totalXP} XP
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: New Mission */}
      {tab === 'new-mission' && (
        <form onSubmit={handleCreateMission} className="p-6 sm:p-8 bg-space-900 border border-space-800 rounded-3xl space-y-4">
          <h3 className="font-display font-bold text-lg text-white">
            Publish New Training Mission
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mission Code</label>
              <input
                type="text"
                value={missionForm.missionCode}
                onChange={(e) => setMissionForm({ ...missionForm, missionCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mission Title</label>
              <input
                type="text"
                value={missionForm.title}
                onChange={(e) => setMissionForm({ ...missionForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={missionForm.category}
                onChange={(e) => setMissionForm({ ...missionForm, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
              >
                <option value="Space Orientation">Space Orientation</option>
                <option value="Zero Gravity Training">Zero Gravity Training</option>
                <option value="Space Navigation">Space Navigation</option>
                <option value="Emergency Response">Emergency Response</option>
                <option value="Space Exploration">Space Exploration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">XP Reward</label>
              <input
                type="number"
                value={missionForm.xpReward}
                onChange={(e) => setMissionForm({ ...missionForm, xpReward: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={missionForm.description}
              onChange={(e) => setMissionForm({ ...missionForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Objectives (semicolon-separated)</label>
            <input
              type="text"
              value={missionForm.objectives}
              onChange={(e) => setMissionForm({ ...missionForm, objectives: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-rose-600/20"
          >
            Deploy Mission to Cadets
          </button>
        </form>
      )}

      {/* Tab: New Module */}
      {tab === 'new-module' && (
        <form onSubmit={handleCreateModule} className="p-6 sm:p-8 bg-space-900 border border-space-800 rounded-3xl space-y-4">
          <h3 className="font-display font-bold text-lg text-white">
            Publish New Learning Academy Module
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Module Title</label>
              <input
                type="text"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={moduleForm.category}
                onChange={(e) => setModuleForm({ ...moduleForm, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
              >
                <option value="Space Science">Space Science</option>
                <option value="Solar System">Solar System</option>
                <option value="Astronomy">Astronomy</option>
                <option value="Spacecraft & Tech">Spacecraft & Tech</option>
                <option value="Astronautics">Astronautics</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-space-950 border border-space-800 text-xs text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-purple-600/20"
          >
            Publish Module to Ground School
          </button>
        </form>
      )}
    </div>
  );
};
