import React from 'react';
import { Rocket, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-space-950 border-t border-space-800/80 py-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand info */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-slate-200">NOVA 2.O</span> — Junior Astronaut Mission Trainer
            <span className="block text-[11px] text-slate-400">
              Developed for NASA Space Apps Challenge
            </span>
          </div>
        </div>

        {/* Motto */}
        <div className="text-center font-mono text-cyan-400/80 text-xs">
          "Learn. Train. Explore. Become an Astronaut."
        </div>

        {/* Disclaimer & Legal */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Educational Simulator. Integrated with genuine NASA Open Data.</span>
        </div>
      </div>
    </footer>
  );
};
