import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import {
  Rocket,
  Volume2,
  VolumeX,
  User as UserIcon,
  LogOut,
  Sparkles,
  Menu,
  X,
  Compass,
  Award,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { soundEnabled, toggleSound, playClick } = useAudio();
  const navigate = useNavigate();

  const handleLogout = () => {
    playClick();
    logout();
    navigate('/');
  };

  const getRankBadgeColor = (rank?: string) => {
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
    <header className="sticky top-0 z-40 w-full bg-space-950/80 backdrop-blur-md border-b border-space-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center space-x-3">
          {user && (
            <button
              onClick={() => {
                playClick();
                onToggleSidebar?.();
              }}
              className="md:hidden p-2 rounded-lg bg-space-900 border border-space-700 text-slate-300 hover:text-white"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link
            to={user ? '/dashboard' : '/'}
            onClick={() => playClick()}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <Rocket className="w-5 h-5 text-white transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                  NOVA 2.O
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-widest font-semibold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  NASA Space Apps
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                Junior Astronaut Mission Trainer
              </p>
            </div>
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Audio Synthesizer toggle */}
          <button
            onClick={() => {
              toggleSound();
              playClick();
            }}
            title={soundEnabled ? 'Telemetry Audio Active (Mute)' : 'Telemetry Audio Muted (Enable)'}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-space-900 border-cyan-500/40 text-cyan-400 shadow-sm shadow-cyan-500/20'
                : 'bg-space-900/60 border-space-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              {/* Rank & XP Pill */}
              <div className="hidden sm:flex items-center space-x-2 bg-space-900/90 border border-space-700/80 px-3 py-1.5 rounded-full">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRankBadgeColor(user.rank)}`}>
                  {user.rank}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.totalXP} XP</span>
                </span>
              </div>

              {/* User Profile Link */}
              <Link
                to="/profile"
                onClick={() => playClick()}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl bg-space-900 border border-space-700 hover:border-cyan-500/50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {user.callsign || user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none">
                    {user.role === 'admin' ? 'Flight Director' : 'Astronaut Trainee'}
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg bg-space-900/80 border border-space-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                onClick={() => playClick()}
                className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => playClick()}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
              >
                Join Academy
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
