import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Mission } from '../types';
import { useAudio } from '../context/AudioContext';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Filter,
} from 'lucide-react';

export const MissionControl: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { playClick } = useAudio();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await api.getMissions();
        if (data.success) {
          setMissions(data.missions);
        }
      } catch (err) {
        console.error('Failed to load missions', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const categories = ['All', 'Space Orientation', 'Zero Gravity Training', 'Space Navigation', 'Emergency Response', 'Space Exploration'];

  const filteredMissions = filterCategory === 'All'
    ? missions
    : missions.filter((m) => m.category === filterCategory);

  const completedCount = missions.filter((m) => m.isCompleted).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-space-900 border border-space-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase mb-1">
              <Compass className="w-4 h-4" />
              <span>Simulated Flight Operations</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Mission Control Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Complete simulated astronaut training missions to master orbital maneuvers, zero-gravity mechanics, and emergency spacecraft protocols.
            </p>
          </div>

          <div className="bg-space-950/70 border border-space-800 p-4 rounded-xl flex items-center space-x-4 shrink-0">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Flight Record</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {completedCount} <span className="text-slate-400 text-sm">/ {missions.length}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-space-800" />
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Status</span>
              <span className="text-xs font-semibold text-cyan-400">
                {completedCount === missions.length && missions.length > 0 ? 'Full Clearance' : 'Active Training'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-6 border-t border-space-800 flex items-center space-x-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-space-950/60 text-slate-400 border border-space-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Missions Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((m) => (
            <div
              key={m._id}
              className={`rounded-2xl border transition-all p-6 flex flex-col justify-between ${
                m.isCompleted
                  ? 'bg-space-900/90 border-emerald-500/30'
                  : 'bg-space-900 border-space-800 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {m.missionCode}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-space-700">
                      {m.difficulty}
                    </span>
                    {m.isCompleted && (
                      <span className="text-emerald-400 flex items-center space-x-1 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                  {m.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                  {m.description}
                </p>

                {/* Objectives summary */}
                <div className="space-y-1 mb-4 text-xs text-slate-300">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                    Core Objective:
                  </span>
                  <div className="flex items-start space-x-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span className="line-clamp-2">{m.objectives[0]}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-space-800/80 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{m.xpReward} XP</span>
                </span>

                <Link
                  to={`/missions/${m._id}`}
                  onClick={() => playClick()}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    m.isCompleted
                      ? 'bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20'
                  }`}
                >
                  <span>{m.isCompleted ? 'Re-fly Mission' : 'Commence Mission'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
