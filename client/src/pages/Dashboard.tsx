import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import {
  Rocket,
  Compass,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Play,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { playClick } = useAudio();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboard();
        if (res.success && res.dashboard) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cyan-400">Loading Astronaut Telemetry...</p>
        </div>
      </div>
    );
  }

  const { stats, rankProgress, nextRecommendation, availableMissions, recentAchievements } = data;

  // Tier progress percentage
  const tierRange = rankProgress.currentTierMax - rankProgress.currentTierBase;
  const currentTierXP = stats.totalXP - rankProgress.currentTierBase;
  const rankPercent =
    tierRange > 0 ? Math.min(100, Math.max(0, Math.round((currentTierXP / tierRange) * 100))) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Astronaut Welcome Hero Banner */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>ACTIVE SESSION — MISSION CONTROL ONLINE</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Welcome back, {user?.callsign || user?.name}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Continue your structured astronaut training curriculum. Complete simulated orbital challenges, solve scientific puzzles, and earn flight wings.
            </p>
          </div>

          {/* Continue Training Quick Action Button */}
          {nextRecommendation && (
            <div className="shrink-0">
              <Link
                to={
                  nextRecommendation.type === 'mission'
                    ? `/missions/${nextRecommendation.id}`
                    : `/academy/${nextRecommendation.id}`
                }
                onClick={() => playClick()}
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Continue Training</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Trainee Rank Progression Bar */}
        <div className="mt-8 pt-6 border-t border-space-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Current Rank:</span>
              <span className="text-cyan-300 font-bold uppercase">{stats.rank}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Target Promotion:</span>
              <span className="text-purple-300 font-bold">{rankProgress.nextRank}</span>
              {rankProgress.neededXP > 0 && (
                <span className="text-amber-400">({rankProgress.neededXP} XP needed)</span>
              )}
            </div>
          </div>

          <div className="w-full bg-space-950 h-3 rounded-full overflow-hidden p-0.5 border border-space-800">
            <div
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-cyan-400/50"
              style={{ width: `${rankPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Real Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total XP */}
        <div className="p-5 rounded-2xl bg-space-900 border border-space-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Total Experience</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {stats.totalXP}
            </span>
            <span className="text-[11px] font-mono text-amber-400 block mt-0.5">XP Earned</span>
          </div>
        </div>

        {/* Missions Completed */}
        <div className="p-5 rounded-2xl bg-space-900 border border-space-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Flight Missions</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {stats.missionsCompleted}{' '}
              <span className="text-slate-500 text-sm font-sans font-normal">/ {stats.totalMissions}</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">Completed</span>
          </div>
        </div>

        {/* Learning Modules */}
        <div className="p-5 rounded-2xl bg-space-900 border border-space-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Ground Academy</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {stats.modulesCompleted}{' '}
              <span className="text-slate-500 text-sm font-sans font-normal">/ {stats.totalModules}</span>
            </span>
            <span className="text-[11px] font-mono text-purple-400 block mt-0.5">Modules Studied</span>
          </div>
        </div>

        {/* Overall Completion */}
        <div className="p-5 rounded-2xl bg-space-900 border border-space-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Training Progress</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {stats.overallProgressPercent}%
            </span>
            <span className="text-[11px] font-mono text-emerald-400 block mt-0.5">Overall Completion</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Section: Available Missions & Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mission Control Active Deck */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Mission Flight Roster</span>
            </h3>
            <Link
              to="/missions"
              onClick={() => playClick()}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {availableMissions.slice(0, 4).map((m) => (
              <div
                key={m._id}
                className="p-4 rounded-2xl bg-space-900 border border-space-800 flex items-center justify-between gap-4 hover:border-space-700 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      m.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {m.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        {m.missionCode}
                      </span>
                      <span className="text-[11px] text-slate-400">{m.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white leading-tight">{m.title}</h4>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-mono text-xs font-bold text-amber-400 hidden sm:inline">
                    +{m.xpReward} XP
                  </span>
                  <Link
                    to={`/missions/${m._id}`}
                    onClick={() => playClick()}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      m.isCompleted
                        ? 'bg-space-800 text-slate-300 hover:bg-space-700'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold shadow-sm shadow-cyan-500/20'
                    }`}
                  >
                    {m.isCompleted ? 'Review' : 'Launch'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Badges & Achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Earned Badges</span>
            </h3>
            <Link
              to="/progress"
              onClick={() => playClick()}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>All Badges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4">
            {recentAchievements.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                <Award className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No badges unlocked yet. Complete your first training mission to earn your wings!</p>
              </div>
            ) : (
              recentAchievements.map((ua) => (
                <div
                  key={ua._id}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-space-950/60 border border-space-850"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{ua.achievementId?.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {ua.achievementId?.description}
                    </p>
                  </div>
                </div>
              ))
            )}

            <div className="pt-2 border-t border-space-800/80">
              <Link
                to="/simulator"
                onClick={() => playClick()}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition-all"
              >
                <span>Launch Space Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
