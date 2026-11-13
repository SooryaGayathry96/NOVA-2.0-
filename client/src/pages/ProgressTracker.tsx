import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Achievement } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Compass,
  HelpCircle,
} from 'lucide-react';

export const ProgressTracker: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, achRes] = await Promise.all([
          api.getProgress(),
          api.getAchievements(),
        ]);
        if (progRes.success) setProgressData(progRes.progress);
        if (achRes.success) setAchievements(achRes.achievements);
      } catch (err) {
        console.error('Failed to load progress', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !progressData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ranksRoadmap = [
    { name: 'Cadet', xp: 0, desc: 'Entry-level trainee' },
    { name: 'Junior Astronaut', xp: 250, desc: 'Flight orientation certified' },
    { name: 'Space Explorer', xp: 600, desc: 'Orbital mechanics certified' },
    { name: 'Mission Specialist', xp: 1200, desc: 'Zero-G and emergency qualified' },
    { name: 'Commander', xp: 2000, desc: 'Master spaceflight commander' },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono uppercase mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Official Flight Log & Records</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Astronaut Progress Tracker
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Persistent tracking of all completed curriculum modules, mission evaluations, quiz scores, and unlocked achievement wings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-space-950/80 border border-space-800 text-center shrink-0">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Career XP</span>
            <span className="font-display font-extrabold text-3xl text-amber-400">
              {progressData.totalXP}
            </span>
            <span className="text-xs font-semibold text-cyan-300 block mt-0.5">
              Rank: {progressData.rank}
            </span>
          </div>
        </div>

        {/* Training Progress Overview Bars */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-space-800/80">
          {/* Ground Academy Modules */}
          <div className="p-4 rounded-xl bg-space-950/60 border border-space-850">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Modules</span>
              </span>
              <span className="font-mono text-purple-300 font-bold">
                {progressData.modules.completed} / {progressData.modules.total}
              </span>
            </div>
            <div className="w-full bg-space-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-300"
                style={{ width: `${progressData.modules.percent}%` }}
              />
            </div>
          </div>

          {/* Missions Completed */}
          <div className="p-4 rounded-xl bg-space-950/60 border border-space-850">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Missions</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                {progressData.missions.completed} / {progressData.missions.total}
              </span>
            </div>
            <div className="w-full bg-space-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${progressData.missions.percent}%` }}
              />
            </div>
          </div>

          {/* Overall Completion */}
          <div className="p-4 rounded-xl bg-space-950/60 border border-space-850">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Overall Completion</span>
              </span>
              <span className="font-mono text-emerald-300 font-bold">
                {progressData.overallProgressPercent}%
              </span>
            </div>
            <div className="w-full bg-space-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressData.overallProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trainee Rank Roadmap */}
      <div className="p-6 rounded-3xl bg-space-900 border border-space-800 space-y-4">
        <h3 className="font-display font-bold text-lg text-white">
          Astronaut Rank Tier Roadmap
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {ranksRoadmap.map((r, idx) => {
            const isCurrent = progressData.rank === r.name;
            const isUnlocked = progressData.totalXP >= r.xp;
            return (
              <div
                key={r.name}
                className={`p-4 rounded-2xl border text-center relative transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : isUnlocked
                    ? 'bg-space-950/80 border-space-700 text-slate-300'
                    : 'bg-space-950/40 border-space-850 text-slate-500 opacity-60'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-400 text-space-950 font-bold font-mono text-[9px] uppercase">
                    Current
                  </span>
                )}
                <div className="font-mono text-xs font-bold text-amber-400 mb-1">{r.xp} XP</div>
                <h4 className="font-display font-bold text-xs text-white mb-1">{r.name}</h4>
                <p className="text-[10px] text-slate-400">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Commendation Badges & Wings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach._id}
              className={`p-5 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                ach.isUnlocked
                  ? 'bg-space-900/90 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-space-900/40 border-space-850 opacity-60'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  ach.isUnlocked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-space-800 text-slate-500 border-space-700'
                }`}
              >
                {ach.isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center space-x-1.5 mb-1">
                  <h4 className="font-bold text-sm text-white">{ach.title}</h4>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-2">
                  {ach.description}
                </p>
                {ach.isUnlocked ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    Locked — Complete requirement
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
