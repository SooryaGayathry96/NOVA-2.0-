import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { Rocket, Lock, Mail, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { playClick, playSuccess, playFail } = useAudio();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [callsign, setCallsign] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('helmet-cyan');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const avatarOptions = [
    { id: 'helmet-cyan', name: 'Cyber Cyan', emoji: '🧑‍🚀' },
    { id: 'helmet-gold', name: 'Solar Gold', emoji: '👨‍🚀' },
    { id: 'helmet-purple', name: 'Cosmic Violet', emoji: '👩‍🚀' },
    { id: 'helmet-mars', name: 'Martian Rust', emoji: '🚀' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        callsign: callsign || `Cadet ${name.split(' ')[0]}`,
        avatar,
      });
      playSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      playFail();
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">
            Enlist as Astronaut Cadet
          </h1>
          <p className="text-xs text-slate-400">
            Create your astronaut profile and embark on the NOVA 2.O flight program.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-space-900 border border-space-800 shadow-2xl relative">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Armstrong"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Astronaut Callsign (Nickname)
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                placeholder="e.g. Star Voyager"
                className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-cyan-300 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Security Password (Min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Trainee Helmet
              </label>
              <div className="grid grid-cols-4 gap-2">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setAvatar(opt.id);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      avatar === opt.id
                        ? 'bg-cyan-500/20 border-cyan-400'
                        : 'bg-space-950 border-space-800 hover:border-space-700'
                    }`}
                  >
                    <span className="text-xl block">{opt.emoji}</span>
                    <span className="text-[10px] text-slate-300 block mt-0.5">{opt.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Enlisting Cadet...' : 'Enlist & Enter Academy'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Already have an astronaut account?{' '}
          <Link
            to="/login"
            onClick={() => playClick()}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
