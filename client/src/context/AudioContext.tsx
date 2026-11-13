import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AudioContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playBeep: (freq?: number, duration?: number) => void;
  playClick: () => void;
  playSuccess: () => void;
  playFail: () => void;
  playLaunch: () => void;
  playAlarm: () => void;
}

const AudioContext = createContext<AudioContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playBeep: () => {},
  playClick: () => {},
  playSuccess: () => {},
  playFail: () => {},
  playLaunch: () => {},
  playAlarm: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('nova_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('nova_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  const initAudio = () => {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioClass) {
        const ctx = new AudioClass();
        setAudioCtx(ctx);
        return ctx;
      }
    }
    return audioCtx;
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Play single synth frequency tone
  const playBeep = useCallback((freq = 880, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio() || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported
    }
  }, [soundEnabled, audioCtx]);

  // Subtle telemetry button click
  const playClick = useCallback(() => {
    playBeep(1200, 0.04);
  }, [playBeep]);

  // Mission accomplished / high score fanfare
  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio() || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.25);
      });
    } catch (e) {}
  }, [soundEnabled, audioCtx]);

  // Mission fail / warning buzzer
  const playFail = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio() || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }, [soundEnabled, audioCtx]);

  // Rocket launch / thruster sweep
  const playLaunch = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio() || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  }, [soundEnabled, audioCtx]);

  // Emergency Siren
  const playAlarm = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio() || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }, [soundEnabled, audioCtx]);

  return (
    <AudioContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playBeep,
        playClick,
        playSuccess,
        playFail,
        playLaunch,
        playAlarm,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
