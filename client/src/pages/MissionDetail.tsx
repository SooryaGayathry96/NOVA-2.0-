import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Mission } from '../types';
import { useAudio } from '../context/AudioContext';
import confetti from 'canvas-confetti';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Radio,
  Crosshair,
  Flame,
  Activity,
  Bot,
} from 'lucide-react';

export const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playClick, playSuccess, playFail, playLaunch, playAlarm } = useAudio();

  const [mission, setMission] = useState<Mission | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form submission answers map
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchMission = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.getMission(id);
        if (data.success && data.mission) {
          setMission(data.mission);
          setIsCompleted(data.isCompleted);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load mission.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  const handleSelectOption = (key: string, value: any) => {
    playClick();
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !mission) return;

    setIsSubmitting(true);
    try {
      const res = await api.completeMission(id, answers);
      setResult(res);

      if (res.passed) {
        playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#38bdf8', '#a855f7', '#f59e0b'],
        });
        setIsCompleted(true);
      } else {
        playFail();
      }
    } catch (err: any) {
      alert(err.message || 'Telemetry evaluation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-cyan-300">Loading Mission Telemetry...</p>
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-space-900 border border-rose-500/30 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="font-display font-bold text-lg text-white">Mission Briefing Unavailable</h3>
        <p className="text-sm text-slate-300">{error || 'Mission not found.'}</p>
        <Link
          to="/missions"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-space-800 text-slate-200 rounded-xl text-xs font-semibold hover:bg-space-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Mission Control</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button & Title Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/missions"
          onClick={() => playClick()}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mission Control</span>
        </Link>
        {isCompleted && (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mission Completed</span>
          </span>
        )}
      </div>

      {/* Mission Banner Card */}
      <div className="bg-space-900 border border-space-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
            {mission.missionCode}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-space-800 text-slate-300 border border-space-700 text-xs font-medium">
            {mission.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-medium">
            {mission.difficulty}
          </span>
          <span className="ml-auto font-mono text-xs font-bold text-amber-400 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{mission.xpReward} XP Commendation</span>
          </span>
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3">
          {mission.title}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {mission.description}
        </p>

        {/* Objectives & Instructions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-space-950/60 border border-space-800 space-y-2">
            <h4 className="font-semibold text-cyan-300 flex items-center space-x-1.5 uppercase tracking-wider font-mono text-[11px]">
              <Compass className="w-3.5 h-3.5" />
              <span>Mission Objectives</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {mission.objectives.map((obj, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-space-950/60 border border-space-800 space-y-2">
            <h4 className="font-semibold text-purple-300 flex items-center space-x-1.5 uppercase tracking-wider font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standard Flight Instructions</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {mission.instructions.map((inst, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Result feedback banner if already submitted */}
      {result && (
        <div
          className={`p-6 rounded-2xl border transition-all ${
            result.passed
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            {result.passed ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            )}
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {result.passed ? 'Mission Evaluated: SUCCESS' : 'Mission Evaluated: RE-ATTEMPT REQUIRED'}
              </h3>
              <p className="text-xs text-slate-300">{result.message}</p>
            </div>
            <div className="ml-auto text-right">
              <span className="font-display font-extrabold text-2xl text-white">
                {result.scorePercentage}%
              </span>
              <span className="block text-[10px] uppercase font-mono text-slate-400">
                Passing: 65%
              </span>
            </div>
          </div>

          {/* New Achievements Awarded Modal/Banner */}
          {result.newAchievements && result.newAchievements.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center space-x-3 text-amber-200">
              <Award className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-sm block">New Badge Commendation Unlocked!</span>
                <span className="text-xs text-slate-300">
                  {result.newAchievements.map((a: any) => a.title).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Activity Form */}
      <form onSubmit={handleSubmitMission} className="space-y-6">
        {/* Render Activity depending on mission.activityType */}

        {/* 1. PLANET ID (Mission A) */}
        {mission.activityType === 'planet_id' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Analyze Planetary Sensor Telemetry:</span>
            </div>

            {mission.activityData?.targets?.map((target: any, idx: number) => {
              const selectedValue = answers[target.id];
              return (
                <div
                  key={target.id}
                  className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4 hover:border-space-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      Sensor Beacon #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400">Target Deep Space Probe</span>
                  </div>

                  {/* Telemetry Readout Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-space-950/70 p-3.5 rounded-xl border border-space-850 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ATMOSPHERE:</span>
                      <span className="text-slate-200">{target.telemetry.atmosphere}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SURFACE TEMP:</span>
                      <span className="text-amber-300">{target.telemetry.temperature}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SURFACE GRAVITY:</span>
                      <span className="text-cyan-300">{target.telemetry.gravity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">GEOLOGICAL NOTE:</span>
                      <span className="text-slate-200">{target.telemetry.feature}</span>
                    </div>
                  </div>

                  {/* Planet Options */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Identify this celestial body:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {target.options.map((opt: string) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectOption(target.id, opt)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                            selectedValue === opt
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-sm shadow-cyan-500/20'
                              : 'bg-space-800/60 text-slate-300 border-space-700 hover:bg-space-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. ZERO GRAVITY TRAINING (Mission B) */}
        {mission.activityType === 'zero_gravity' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Microgravity Physics Challenges:</span>
            </div>

            {mission.activityData?.challenges?.map((challenge: any, idx: number) => {
              const selectedValue = answers[challenge.id];
              return (
                <div
                  key={challenge.id}
                  className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4"
                >
                  <div className="text-xs font-mono font-bold text-purple-400 uppercase">
                    Challenge {idx + 1} of {mission.activityData.challenges.length}
                  </div>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed">
                    {challenge.question}
                  </p>

                  <div className="space-y-2">
                    {challenge.options.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(challenge.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs border transition-all ${
                          selectedValue === optIdx
                            ? 'bg-purple-500/20 text-purple-300 border-purple-400 font-semibold'
                            : 'bg-space-950/60 text-slate-300 border-space-800 hover:bg-space-800/60'
                        }`}
                      >
                        <span className="font-mono text-purple-400 font-bold mr-2">
                          [{String.fromCharCode(65 + optIdx)}]
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. NAVIGATION (Mission C) */}
        {mission.activityType === 'navigation' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>Orbital Trajectory & Docking Corridors:</span>
            </div>

            {mission.activityData?.steps?.map((step: any, idx: number) => {
              const selectedValue = answers[step.id];
              return (
                <div
                  key={step.id}
                  className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      Burn Step {idx + 1}: {step.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">RCS Guidance Active</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{step.scenario}</p>

                  <div className="space-y-2">
                    {step.options.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(step.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs border transition-all ${
                          selectedValue === optIdx
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-semibold'
                            : 'bg-space-950/60 text-slate-300 border-space-800 hover:bg-space-800/60'
                        }`}
                      >
                        <span className="font-mono text-cyan-400 font-bold mr-2">
                          [VECTOR {optIdx + 1}]
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. EMERGENCY RESPONSE (Mission D) */}
        {mission.activityType === 'emergency_response' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-semibold text-amber-300">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Critical Incident Alarm Simulations:</span>
              </div>
              <button
                type="button"
                onClick={() => playAlarm()}
                className="text-xs text-amber-400 underline font-mono hover:text-amber-300"
              >
                Test Siren Tone
              </button>
            </div>

            {mission.activityData?.scenarios?.map((scenario: any, idx: number) => {
              const selectedValue = answers[scenario.id];
              return (
                <div
                  key={scenario.id}
                  className="p-5 rounded-2xl bg-space-900 border border-amber-500/30 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold uppercase tracking-wider">
                      ⚠️ EMERGENCY PROTOCOL {idx + 1}: {scenario.title}
                    </span>
                    <span className="text-amber-400 animate-pulse">TIME CRITICAL</span>
                  </div>

                  <div className="p-3 rounded-xl bg-space-950/80 border border-space-800 font-mono text-xs text-rose-300">
                    {scenario.readout}
                  </div>

                  <p className="text-sm font-medium text-slate-100">{scenario.question}</p>

                  <div className="space-y-2">
                    {scenario.options.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(scenario.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs border transition-all ${
                          selectedValue === optIdx
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-semibold'
                            : 'bg-space-950/60 text-slate-300 border-space-800 hover:bg-space-800/60'
                        }`}
                      >
                        <span className="font-mono text-amber-400 font-bold mr-2">
                          [ACTION {optIdx + 1}]
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. SPACE EXPLORATION (Mission E) */}
        {mission.activityType === 'space_exploration' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Mars Rover Scientific Deployment:</span>
            </div>

            {mission.activityData?.steps?.map((step: any, idx: number) => {
              const selectedValue = answers[step.id];
              return (
                <div
                  key={step.id}
                  className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold uppercase">
                      Site Sequence {idx + 1}: {step.title}
                    </span>
                    {step.site && <span className="text-slate-400">{step.site}</span>}
                  </div>

                  {step.spectrometry && (
                    <div className="p-3 rounded-xl bg-space-950/80 border border-space-800 font-mono text-xs text-emerald-300">
                      SPECTRAL PEAKS: {step.spectrometry}
                    </div>
                  )}

                  <p className="text-sm text-slate-200">{step.question || step.scenario}</p>

                  <div className="space-y-2">
                    {step.options.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(step.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs border transition-all ${
                          selectedValue === optIdx
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-semibold'
                            : 'bg-space-950/60 text-slate-300 border-space-800 hover:bg-space-800/60'
                        }`}
                      >
                        <span className="font-mono text-emerald-400 font-bold mr-2">
                          [TOOL {optIdx + 1}]
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-between gap-4 border-t border-space-800">
          <Link
            to="/missions"
            onClick={() => playClick()}
            className="px-5 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel / Save Later
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => playLaunch()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Evaluating Flight Telemetry...' : 'Submit Mission Telemetry'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
