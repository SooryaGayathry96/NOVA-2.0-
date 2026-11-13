import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Medal,
  Sparkles,
  Compass,
  User,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard(1, 50);
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filtered = leaderboard.filter((entry) =>
    (entry.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.callsign || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.rank || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Commander':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Mission Specialist':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Space Explorer':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Junior Astronaut':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-semibold tracking-wider uppercase mb-1">
              <Trophy className="w-4 h-4" />
              <span>Academy Honors & Rankings</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Astronaut Flight Leaderboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time rankings of registered cadet trainees and commanders based on verified mission evaluations and flight XP.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-space-950/80 px-3 py-2 rounded-xl border border-space-800">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name or callsign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-44"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-space-900 border border-space-800 rounded-3xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950/80 border-b border-space-800 text-[11px] font-mono uppercase text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16">Position</th>
                  <th className="py-3.5 px-4">Astronaut Trainee</th>
                  <th className="py-3.5 px-4">Rank Tier</th>
                  <th className="py-3.5 px-4 text-center">Missions Done</th>
                  <th className="py-3.5 px-4 text-right">Flight XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-850">
                {filtered.map((entry) => {
                  const isCurrentUser = user && user.id === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                          : 'hover:bg-space-850/50'
                      }`}
                    >
                      {/* Position */}
                      <td className="py-4 px-4 text-center font-mono font-bold">
                        {entry.position === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            🥇
                          </span>
                        ) : entry.position === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40">
                            🥈
                          </span>
                        ) : entry.position === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-400 border border-amber-700/40">
                            🥉
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">#{entry.position}</span>
                        )}
                      </td>

                      {/* User Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center space-x-1.5">
                              <span>{entry.callsign || entry.name}</span>
                              {isCurrentUser && (
                                <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{entry.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Rank */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${getRankBadgeColor(
                            entry.rank
                          )}`}
                        >
                          {entry.rank}
                        </span>
                      </td>

                      {/* Completed Missions */}
                      <td className="py-4 px-4 text-center font-mono text-slate-300">
                        {entry.completedMissions}
                      </td>

                      {/* Total XP */}
                      <td className="py-4 px-4 text-right">
                        <span className="font-display font-extrabold text-sm text-amber-400 font-mono">
                          {entry.totalXP} XP
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
