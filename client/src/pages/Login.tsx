import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { Rocket, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { playClick, playSuccess, playFail } = useAudio();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      playSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      playFail();
      setError(err.message || 'Invalid astronaut credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    playClick();
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    setError(null);
    try {
      await login(demoEmail, demoPass);
      playSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      playFail();
      setError(err.message || 'Failed demo authentication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">
            Astronaut Sign In
          </h1>
          <p className="text-xs text-slate-400">
            Access your mission control terminal and resume training progress.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-space-900 border border-space-800 shadow-2xl relative">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Astronaut Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cadet@nova.space"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-space-950 border border-space-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Security Password
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Mission Control'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Hackathon Evaluators */}
          <div className="mt-6 pt-6 border-t border-space-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block text-center uppercase tracking-wider">
              Quick Test Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('cadet@nova.space', 'Cadet@12345')}
                className="p-2 rounded-xl bg-space-950/80 hover:bg-space-800 border border-space-800 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cadet Account</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@nova.space', 'Admin@12345')}
                className="p-2 rounded-xl bg-space-950/80 hover:bg-space-800 border border-space-800 text-rose-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Not yet enlisted?{' '}
          <Link
            to="/register"
            onClick={() => playClick()}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Create Astronaut Trainee Profile
          </Link>
        </p>
      </div>
    </div>
  );
};
