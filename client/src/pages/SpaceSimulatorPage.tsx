import React from 'react';
import { SolarSystemSim } from '../components/SolarSystemSim';
import { Orbit, Compass, Sparkles, Info } from 'lucide-react';

export const SpaceSimulatorPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase mb-1">
              <Orbit className="w-4 h-4" />
              <span>Interactive Astrodynamics Laboratory</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Solar System & Gravity Simulator
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Simulate orbital periods, observe planetary velocities, inspect celestial atmospheres, and test your gravitational weight across worlds.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-space-950/80 border border-space-800 flex items-center space-x-3 shrink-0">
            <Compass className="w-6 h-6 text-cyan-400" />
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Newtonian Dynamics</span>
              <span className="text-xs font-bold text-slate-100">8 Planets + Lunar Orbit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Component */}
      <SolarSystemSim />
    </div>
  );
};
