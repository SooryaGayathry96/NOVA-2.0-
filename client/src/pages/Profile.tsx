import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import {
  User as UserIcon,
  Award,
  Compass,
  BookOpen,
  CheckCircle2,
  Calendar,
  Save,
  Sparkles,
  LogOut,
  HelpCircle,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { playClick, playSuccess } = useAudio();

  const [profileData, setProfileData] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [callsign, setCallsign] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('helmet-cyan');
  const [bio, setBio] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getProfile();
        if (res.success && res.profile) {
          setProfileData(res.profile);
          setName(res.profile.name || '');
          setCallsign(res.profile.callsign || '');
          setAvatar(res.profile.avatar || 'helmet-cyan');
          setBio(res.profile.bio || '');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const avatarOptions = [
    { id: 'helmet-cyan', name: 'Cyber Cyan', color: 'from-cyan-500 to-blue-600', emoji: '🧑‍🚀' },
    { id: 'helmet-gold', name: 'Solar Gold', color: 'from-amber-400 to-orange-500', emoji: '👨‍🚀' },
    { id: 'helmet-purple', name: 'Cosmic Violet', color: 'from-purple-500 to-indigo-600', emoji: '👩‍🚀' },
    { id: 'helmet-mars', name: 'Martian Rust', color: 'from-rose-500 to-red-600', emoji: '🚀' },
    { id: 'helmet-emerald', name: 'Aurora Green', color: 'from-emerald-400 to-teal-600', emoji: '🛸' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name, callsign, avatar, bio });
      playSuccess();
      setMessage('Astronaut telemetry profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profileData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, achievements, completedMissions, completedModules, quizHistory } = profileData;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Profile Overview Card */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-display font-extrabold text-2xl text-white shadow-xl shadow-cyan-500/20">
              {profileData.avatar ? (
                <span>
                  {avatarOptions.find((a) => a.id === profileData.avatar)?.emoji || '🧑‍🚀'}
                </span>
              ) : (
                profileData.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-extrabold text-2xl text-white">
                  {profileData.callsign || profileData.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold">
                  {profileData.rank}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">{profileData.email}</p>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono mt-1">
                <span>Role: {profileData.role === 'admin' ? 'Flight Director (Admin)' : 'Astronaut Cadet'}</span>
                <span>•</span>
                <span>Enlisted: {new Date(profileData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-space-950/80 px-4 py-3 rounded-2xl border border-space-800">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-display font-extrabold text-lg text-white block">
                {profileData.totalXP} XP
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400">Total Career Points</span>
            </div>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div className="mt-6 pt-6 border-t border-space-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-space-950/60 border border-space-850">
            <span className="font-display font-bold text-lg text-cyan-300">
              {stats.missionsCompleted}
            </span>
            <span className="text-[11px] text-slate-400 block">Missions Flown</span>
          </div>
          <div className="p-3 rounded-xl bg-space-950/60 border border-space-850">
            <span className="font-display font-bold text-lg text-purple-300">
              {stats.modulesCompleted}
            </span>
            <span className="text-[11px] text-slate-400 block">Modules Studied</span>
          </div>
          <div className="p-3 rounded-xl bg-space-950/60 border border-space-850">
            <span className="font-display font-bold text-lg text-emerald-300">
              {stats.quizzesPassed}
            </span>
            <span className="text-[11px] text-slate-400 block">Quizzes Certified</span>
          </div>
          <div className="p-3 rounded-xl bg-space-950/60 border border-space-850">
            <span className="font-display font-bold text-lg text-amber-300">
              {stats.achievementsUnlocked}
            </span>
            <span className="text-[11px] text-slate-400 block">Badges Earned</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="font-display font-bold text-lg text-white">
          Modify Astronaut Callsign & Identity
        </h3>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Astronaut Callsign</label>
            <input
              type="text"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              placeholder="e.g. Apollo Ghost, Stargazer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Avatar Picker */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Select Flight Helmet Avatar
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {avatarOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  playClick();
                  setAvatar(opt.id);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1 ${
                  avatar === opt.id
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-space-950/60 border-space-800 hover:border-space-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${opt.color} flex items-center justify-center text-lg shadow-md`}
                >
                  {opt.emoji}
                </div>
                <span className="text-[11px] font-semibold text-slate-200">{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Mission Objective / Astronaut Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
            placeholder="Tell your crew about your space interests and mission goals..."
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Flight History Log */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-display font-bold text-lg text-white">
          Verified Academic & Flight Logs
        </h3>

        {quizHistory.length === 0 ? (
          <p className="text-xs text-slate-400">No flight evaluations logged yet.</p>
        ) : (
          <div className="divide-y divide-space-800">
            {quizHistory.map((q: any) => (
              <div key={q._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">
                    {q.quizId?.title || 'Knowledge Evaluation'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Completed: {new Date(q.completedAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold ${
                      q.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {q.score}/{q.totalQuestions} ({q.percentage}%)
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {q.passed ? 'PASSED' : 'UNSATISFACTORY'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
