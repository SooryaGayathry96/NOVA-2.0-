import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Compass, Scale, Info, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface PlanetData {
  name: string;
  color: string;
  radius: number; // visual scale
  distance: number; // orbital distance
  speed: number; // relative angular velocity
  realRadiusKm: string;
  orbitalPeriodDays: string;
  gravityMps2: number;
  gravityRelative: number;
  temperature: string;
  atmosphere: string;
  facts: string;
}

const PLANETS: PlanetData[] = [
  {
    name: 'Mercury',
    color: '#a3a3a3',
    radius: 4,
    distance: 55,
    speed: 0.04,
    realRadiusKm: '2,440 km',
    orbitalPeriodDays: '88 Earth Days',
    gravityMps2: 3.7,
    gravityRelative: 0.38,
    temperature: '-180°C to 430°C',
    atmosphere: 'Trace sodium, potassium (Exosphere)',
    facts: 'Heavily cratered, closest to the Sun, with extreme 600°C temperature shifts.',
  },
  {
    name: 'Venus',
    color: '#eab308',
    radius: 7,
    distance: 85,
    speed: 0.025,
    realRadiusKm: '6,052 km',
    orbitalPeriodDays: '225 Earth Days',
    gravityMps2: 8.87,
    gravityRelative: 0.90,
    temperature: '465°C average',
    atmosphere: '96.5% CO2, Sulfuric Acid Clouds',
    facts: 'Runaway greenhouse effect makes Venus the hottest planet in the Solar System.',
  },
  {
    name: 'Earth',
    color: '#38bdf8',
    radius: 8,
    distance: 120,
    speed: 0.018,
    realRadiusKm: '6,371 km',
    orbitalPeriodDays: '365.25 Days',
    gravityMps2: 9.81,
    gravityRelative: 1.0,
    temperature: '-88°C to 58°C (15°C avg)',
    atmosphere: '78% Nitrogen, 21% Oxygen, 1% Argon',
    facts: 'Only known haven of liquid oceans and living biological organisms.',
  },
  {
    name: 'Moon',
    color: '#e2e8f0',
    radius: 3,
    distance: 135,
    speed: 0.035,
    realRadiusKm: '1,737 km',
    orbitalPeriodDays: '27.3 Days (orbit Earth)',
    gravityMps2: 1.62,
    gravityRelative: 0.166,
    temperature: '-130°C to 120°C',
    atmosphere: 'Virtually vacuum',
    facts: 'Earth’s celestial satellite. Target of NASA’s Artemis lunar exploration program.',
  },
  {
    name: 'Mars',
    color: '#ef4444',
    radius: 6,
    distance: 165,
    speed: 0.012,
    realRadiusKm: '3,390 km',
    orbitalPeriodDays: '687 Earth Days',
    gravityMps2: 3.72,
    gravityRelative: 0.38,
    temperature: '-140°C to 20°C (-63°C avg)',
    atmosphere: '95% CO2, 2.6% N2, 1.9% Argon',
    facts: 'Home to Olympus Mons and polar dry-ice caps; target for future human expeditions.',
  },
  {
    name: 'Jupiter',
    color: '#f97316',
    radius: 16,
    distance: 220,
    speed: 0.007,
    realRadiusKm: '69,911 km',
    orbitalPeriodDays: '11.86 Earth Years',
    gravityMps2: 24.79,
    gravityRelative: 2.53,
    temperature: '-110°C cloud tops',
    atmosphere: '90% Hydrogen, 10% Helium',
    facts: 'King of planets. More massive than all other planets combined, with 95 recognized moons.',
  },
  {
    name: 'Saturn',
    color: '#fde047',
    radius: 13,
    distance: 275,
    speed: 0.005,
    realRadiusKm: '58,232 km',
    orbitalPeriodDays: '29.45 Earth Years',
    gravityMps2: 10.44,
    gravityRelative: 1.06,
    temperature: '-140°C cloud tops',
    atmosphere: '96% Hydrogen, 3% Helium',
    facts: 'Spectacular ring system spanning 282,000 km, composed of billions of ice chunks.',
  },
  {
    name: 'Uranus',
    color: '#2dd4bf',
    radius: 10,
    distance: 325,
    speed: 0.003,
    realRadiusKm: '25,362 km',
    orbitalPeriodDays: '84 Earth Years',
    gravityMps2: 8.69,
    gravityRelative: 0.89,
    temperature: '-224°C',
    atmosphere: '83% Hydrogen, 15% Helium, 2% Methane',
    facts: 'Rotates on its side with a 98-degree axial tilt, causing 42 years of continuous night.',
  },
  {
    name: 'Neptune',
    color: '#60a5fa',
    radius: 10,
    distance: 375,
    speed: 0.002,
    realRadiusKm: '24,622 km',
    orbitalPeriodDays: '164.8 Earth Years',
    gravityMps2: 11.15,
    gravityRelative: 1.14,
    temperature: '-218°C',
    atmosphere: '80% Hydrogen, 19% Helium, 1.5% Methane',
    facts: 'Supersonic winds reach 2,100 km/h; takes nearly 165 Earth years to complete one orbit.',
  },
];

export const SolarSystemSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANETS[2]); // Default Earth
  const [earthWeightInput, setEarthWeightInput] = useState<number>(60);
  const { playClick, playBeep } = useAudio();

  // Animation angles for each planet
  const anglesRef = useRef<number[]>(PLANETS.map((_, i) => (i * Math.PI) / 4));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear canvas with space background
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw starry background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 60; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 97) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
      }

      // Draw Sun in Center
      const sunGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 28);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.2, '#fde047');
      sunGrad.addColorStop(0.6, '#f97316');
      sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Draw Orbit tracks and Planets
      PLANETS.forEach((planet, idx) => {
        // Draw orbital track
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
        ctx.strokeStyle =
          selectedPlanet.name === planet.name ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = selectedPlanet.name === planet.name ? 1.5 : 1;
        ctx.setLineDash(selectedPlanet.name === planet.name ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Calculate planet position
        if (isPlaying) {
          anglesRef.current[idx] += planet.speed * 0.4 * simSpeed;
        }
        const angle = anglesRef.current[idx];
        const px = centerX + Math.cos(angle) * planet.distance;
        const py = centerY + Math.sin(angle) * planet.distance;

        // If selected planet, draw target lock ring
        if (selectedPlanet.name === planet.name) {
          ctx.beginPath();
          ctx.arc(px, py, planet.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw Planet body
        ctx.beginPath();
        ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = selectedPlanet.name === planet.name ? 12 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Saturn's rings
        if (planet.name === 'Saturn') {
          ctx.beginPath();
          ctx.ellipse(px, py, planet.radius * 2.1, planet.radius * 0.7, 0.4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Label
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = selectedPlanet.name === planet.name ? '#00f0ff' : 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, px, py + planet.radius + 12);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, simSpeed, selectedPlanet]);

  // Click on canvas to select nearest planet
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Check distance to each planet's current position
    let closestPlanet: PlanetData | null = null;
    let minDistance = 25; // threshold in pixels

    PLANETS.forEach((planet, idx) => {
      const angle = anglesRef.current[idx];
      const px = centerX + Math.cos(angle) * planet.distance;
      const py = centerY + Math.sin(angle) * planet.distance;
      const dist = Math.hypot(clickX - px, clickY - py);

      if (dist < minDistance) {
        minDistance = dist;
        closestPlanet = planet;
      }
    });

    if (closestPlanet) {
      playBeep(980, 0.05);
      setSelectedPlanet(closestPlanet);
    }
  };

  // Calculated Gravity values
  const calculatedWeight = Math.round(earthWeightInput * selectedPlanet.gravityRelative * 10) / 10;
  // Jump height: standard 0.5m on Earth inversely proportional to gravity
  const jumpHeightMeters =
    Math.round(((0.5 * 9.81) / (selectedPlanet.gravityMps2 || 9.81)) * 100) / 100;

  return (
    <div className="space-y-6">
      {/* Simulation Window & Control Bar */}
      <div className="bg-space-900 border border-space-800 rounded-2xl overflow-hidden shadow-xl shadow-cyan-950/20">
        <div className="p-4 bg-space-850/80 border-b border-space-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-100">
                Interactive Solar Orbital Simulator
              </h3>
              <p className="text-[11px] text-slate-400">
                Click any planet or orbit to lock telemetry sensors.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                playClick();
                setIsPlaying(!isPlaying);
              }}
              className="p-2 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 text-xs flex items-center space-x-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={() => {
                playClick();
                anglesRef.current = PLANETS.map((_, i) => (i * Math.PI) / 4);
              }}
              className="p-2 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 border border-space-700 text-xs transition-colors"
              title="Reset Alignment"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 bg-space-800 px-3 py-1.5 rounded-lg border border-space-700 text-xs">
              <span className="text-slate-400">Speed:</span>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.2"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                className="w-16 accent-cyan-400"
              />
              <span className="font-mono text-cyan-300 font-bold">{simSpeed}x</span>
            </div>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full flex justify-center bg-space-950 p-2 overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={850}
            height={520}
            onClick={handleCanvasClick}
            className="cursor-crosshair max-w-full rounded-xl"
          />
        </div>

        {/* Quick Planet Selector Pills */}
        <div className="p-3 bg-space-900 border-t border-space-800 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider pl-1 shrink-0">
            Target Focus:
          </span>
          {PLANETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                playClick();
                setSelectedPlanet(p);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center space-x-1.5 ${
                selectedPlanet.name === p.name
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-space-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: p.color }}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Telemetry & Gravity Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Telemetry Card */}
        <div className="bg-space-900 border border-space-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-5 h-5 rounded-full shadow-lg"
              style={{ backgroundColor: selectedPlanet.color }}
            />
            <h4 className="font-display font-bold text-lg text-white">
              {selectedPlanet.name} Telemetry Readout
            </h4>
          </div>

          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            {selectedPlanet.facts}
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-space-950/60 border border-space-800">
              <span className="text-slate-400 block mb-1">Equatorial Radius</span>
              <span className="font-mono font-semibold text-slate-100 text-sm">
                {selectedPlanet.realRadiusKm}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-space-800">
              <span className="text-slate-400 block mb-1">Orbital Period</span>
              <span className="font-mono font-semibold text-slate-100 text-sm">
                {selectedPlanet.orbitalPeriodDays}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-space-800">
              <span className="text-slate-400 block mb-1">Surface Gravity</span>
              <span className="font-mono font-semibold text-cyan-300 text-sm">
                {selectedPlanet.gravityMps2} m/s² ({selectedPlanet.gravityRelative}g)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-space-800">
              <span className="text-slate-400 block mb-1">Surface Temperature</span>
              <span className="font-mono font-semibold text-amber-300 text-sm">
                {selectedPlanet.temperature}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-space-950/60 border border-space-800">
            <span className="text-slate-400 block text-xs mb-1">Atmospheric Composition:</span>
            <span className="font-mono text-slate-200 text-xs">
              {selectedPlanet.atmosphere}
            </span>
          </div>
        </div>

        {/* Gravity & Weight Calculator (Section 5.5) */}
        <div className="bg-space-900 border border-space-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-white">
                  Comparative Gravity Lab
                </h4>
                <p className="text-xs text-slate-400">
                  Calculate weight and jump mechanics on {selectedPlanet.name}.
                </p>
              </div>
            </div>

            {/* Input Earth Weight */}
            <div className="my-5 p-4 rounded-xl bg-space-950/70 border border-space-800">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Your Earth Mass / Weight (kg):
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={earthWeightInput}
                  onChange={(e) => setEarthWeightInput(Math.max(1, Number(e.target.value)))}
                  className="w-28 px-3 py-2 bg-space-900 border border-space-700 rounded-xl text-cyan-300 font-mono font-bold text-base focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={earthWeightInput}
                  onChange={(e) => setEarthWeightInput(Number(e.target.value))}
                  className="flex-1 accent-purple-400"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/30">
                <span className="text-xs text-purple-300 block mb-1">Weight on {selectedPlanet.name}</span>
                <div className="text-2xl font-display font-extrabold text-white">
                  {calculatedWeight} <span className="text-sm font-sans text-purple-300">kg</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {calculatedWeight < earthWeightInput
                    ? `Float! You feel ${Math.round((1 - selectedPlanet.gravityRelative) * 100)}% lighter`
                    : calculatedWeight > earthWeightInput
                    ? `Heavy! You feel ${Math.round((selectedPlanet.gravityRelative - 1) * 100)}% heavier`
                    : 'Standard Earth gravity'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30">
                <span className="text-xs text-cyan-300 block mb-1">Vertical Jump Height</span>
                <div className="text-2xl font-display font-extrabold text-white">
                  {jumpHeightMeters} <span className="text-sm font-sans text-cyan-300">meters</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  (Standard 0.50m Earth baseline)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-space-800 flex items-center space-x-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Mass remains constant throughout the universe; weight is the force exerted by gravity: W = m × g.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
