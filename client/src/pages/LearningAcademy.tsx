import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LearningModule } from '../types';
import { useAudio } from '../context/AudioContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  GraduationCap,
} from 'lucide-react';

export const LearningAcademy: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { playClick } = useAudio();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await api.getModules();
        if (data.success) {
          setModules(data.modules);
        }
      } catch (err) {
        console.error('Failed to load modules', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const categories = ['All', 'Space Science', 'Solar System', 'Astronomy', 'Spacecraft & Tech', 'Astronautics'];

  const filtered = selectedCategory === 'All'
    ? modules
    : modules.filter((m) => m.category === selectedCategory);

  const completedCount = modules.filter((m) => m.status === 'completed').length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Academy Banner */}
      <div className="bg-space-900 border border-space-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-semibold tracking-wider uppercase mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Astronaut Ground School</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Space Learning Academy
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              10 structured educational modules covering astrophysics, rocket propulsion, orbital mechanics, and astronaut life in zero-g.
            </p>
          </div>

          <div className="bg-space-950/70 border border-space-800 p-4 rounded-xl flex items-center space-x-4 shrink-0">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Curriculum</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {completedCount} <span className="text-slate-400 text-sm">/ {modules.length}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-space-800" />
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Academic Progress</span>
              <span className="text-sm font-bold font-mono text-purple-400">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 pt-6 border-t border-space-800 flex items-center space-x-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                  : 'bg-space-950/60 text-slate-400 border border-space-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <div
              key={m._id}
              className={`rounded-2xl border transition-all p-6 flex flex-col justify-between ${
                m.status === 'completed'
                  ? 'bg-space-900/90 border-emerald-500/30'
                  : 'bg-space-900 border-space-800 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    MODULE #{m.order}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-space-700">
                      {m.category}
                    </span>
                    {m.status === 'completed' && (
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

                <div className="flex items-center space-x-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{m.readTimeMinutes} min study</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-space-800/80 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{m.xpReward} XP</span>
                </span>

                <Link
                  to={`/academy/${m._id}`}
                  onClick={() => playClick()}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    m.status === 'completed'
                      ? 'bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20'
                  }`}
                >
                  <span>{m.status === 'completed' ? 'Review Module' : 'Study Module'}</span>
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
