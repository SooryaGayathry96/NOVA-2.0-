import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Orbit,
  HelpCircle,
  TrendingUp,
  Trophy,
  Globe2,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { playClick } = useAudio();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learning Academy', path: '/academy', icon: BookOpen },
    { name: 'Mission Control', path: '/missions', icon: Compass },
    { name: 'Space Simulator', path: '/simulator', icon: Orbit },
    { name: 'Knowledge Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'Progress Tracker', path: '/progress', icon: TrendingUp },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'NASA Explorer', path: '/nasa-explorer', icon: Globe2 },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Command', path: '/admin', icon: ShieldAlert });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-space-950/70 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-space-900/95 border-r border-space-800 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col justify-between p-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Links */}
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Trainee Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-space-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Trainee Quick Stats */}
        {user && (
          <div className="mt-auto pt-4 border-t border-space-800 space-y-3">
            <div className="p-3 rounded-xl bg-space-950/60 border border-space-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Rank Tier:</span>
                <span className="text-cyan-400 font-semibold">{user.rank}</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Total XP:</span>
                <span className="text-amber-400 font-bold font-mono">{user.totalXP} XP</span>
              </div>
              <NavLink
                to="/profile"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Astronaut Profile</span>
              </NavLink>
            </div>

            <button
              onClick={() => {
                playClick();
                logout();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
