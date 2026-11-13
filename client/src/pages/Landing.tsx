import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import {
  Rocket,
  Compass,
  BookOpen,
  Orbit,
  HelpCircle,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Sparkles,
  Award,
  Radio,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const { playClick, playLaunch } = useAudio();

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Cosmic Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-600/15 to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Space Apps Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-space-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-wider mb-6 shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>NASA SPACE APPS CHALLENGE — TEAM NOVA 2.O</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Junior Astronaut{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
            Mission Trainer
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Embark on an interactive astronaut training expedition. Explore our solar system, master orbital mechanics, make critical spacecraft decisions, and discover genuine NASA discoveries.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            onClick={() => playLaunch()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
          >
            <Rocket className="w-4 h-4" />
            <span>{user ? 'Enter Mission Control' : 'Enlist as Astronaut Cadet'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/simulator"
            onClick={() => playClick()}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-space-900 hover:bg-space-850 border border-space-700 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
          >
            <Orbit className="w-4 h-4 text-cyan-400" />
            <span>Try Space Simulator</span>
          </Link>
        </div>

        {/* Quick Trust / NASA Integration Banner */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Scientifically Accurate Curriculum</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span>Integrated with Real NASA Open APIs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Gamified Badges & Trainee Ranks</span>
          </div>
        </div>
      </section>

      {/* Featured Learning Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Core Astronaut Training Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything a young space explorer needs to understand the cosmos and modern spaceflight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Ground School */}
          <div className="p-6 rounded-3xl bg-space-900 border border-space-800 space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Space Learning Academy
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                10 structured ground school modules covering the Kármán line, rocket propulsion, Kepler’s laws, and astronaut EVA living conditions.
              </p>
            </div>
            <Link
              to="/academy"
              onClick={() => playClick()}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Mission Control */}
          <div className="p-6 rounded-3xl bg-space-900 border border-space-800 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Interactive Flight Missions
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Hands-on simulated training: planetary sensor telemetry, zero-g inertia calculations, ISS docking, and emergency solar storm response.
              </p>
            </div>
            <Link
              to="/missions"
              onClick={() => playClick()}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View Flight Missions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Space Simulator */}
          <div className="p-6 rounded-3xl bg-space-900 border border-space-800 space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Orbit className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Orbital Simulator & Gravity
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Live browser canvas solar system model with real orbital speeds, planetary telemetry, and a comparative celestial gravity weight calculator.
              </p>
            </div>
            <Link
              to="/simulator"
              onClick={() => playClick()}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: NASA Explorer */}
          <div className="p-6 rounded-3xl bg-space-900 border border-space-800 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                NASA Open Data Portal
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Live stream of NASA’s Astronomy Picture of the Day (APOD) and searchable imagery from Curiosity, Perseverance, and James Webb telescopes.
              </p>
            </div>
            <Link
              to="/nasa-explorer"
              onClick={() => playClick()}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Explore NASA Media</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-space-900 border border-space-800 relative overflow-hidden">
          <div className="text-center space-y-2 mb-10">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
              The Astronaut Journey
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              How the Academy Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center relative">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-display font-extrabold text-lg flex items-center justify-center mx-auto">
                01
              </div>
              <h4 className="font-bold text-sm text-white">Create Callsign</h4>
              <p className="text-xs text-slate-400">
                Register your trainee account, select your flight helmet avatar, and establish your cadet profile.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-display font-extrabold text-lg flex items-center justify-center mx-auto">
                02
              </div>
              <h4 className="font-bold text-sm text-white">Ground School</h4>
              <p className="text-xs text-slate-400">
                Read scientific modules about astrophysics, rocket staging, and planetary atmospheres.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-display font-extrabold text-lg flex items-center justify-center mx-auto">
                03
              </div>
              <h4 className="font-bold text-sm text-white">Fly Missions</h4>
              <p className="text-xs text-slate-400">
                Complete interactive training missions. Solve telemetry puzzles and pass knowledge check quizzes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-display font-extrabold text-lg flex items-center justify-center mx-auto">
                04
              </div>
              <h4 className="font-bold text-sm text-white">Earn Wings</h4>
              <p className="text-xs text-slate-400">
                Level up from Cadet to Commander, earn achievement badges, and climb the real-time leaderboard!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Enlistment Call to Action */}
      <section className="text-center px-4 max-w-3xl mx-auto space-y-6">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Ready to Begin Your Astronaut Journey?
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Enlist today in the NOVA 2.O Junior Astronaut Academy and experience real space exploration.
        </p>
        <Link
          to={user ? '/dashboard' : '/register'}
          onClick={() => playLaunch()}
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
        >
          <Rocket className="w-4 h-4" />
          <span>{user ? 'Open Your Dashboard' : 'Start Astronaut Training Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
