import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LearningModule } from '../types';
import { useAudio } from '../context/AudioContext';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Award,
  AlertTriangle,
} from 'lucide-react';

export const ModuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { playClick, playSuccess } = useAudio();

  const [module, setModule] = useState<LearningModule | null>(null);
  const [status, setStatus] = useState<string>('not-started');
  const [linkedQuiz, setLinkedQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);

  useEffect(() => {
    const fetchModule = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.getModule(id);
        if (data.success && data.module) {
          setModule(data.module);
          setStatus(data.status);
          setLinkedQuiz(data.linkedQuiz);
        }
      } catch (err) {
        console.error('Error fetching module', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModule();
  }, [id]);

  const handleComplete = async () => {
    if (!id) return;
    setIsCompleting(true);
    try {
      const res = await api.completeModule(id);
      if (res.success) {
        playSuccess();
        setStatus('completed');
        setCompletionMessage(res.message);
        if (res.newAchievements && res.newAchievements.length > 0) {
          setNewAchievements(res.newAchievements);
        }
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#38bdf8', '#00f0ff'],
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to complete module');
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-space-900 border border-space-800 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="font-display font-bold text-lg text-white">Module Not Found</h3>
        <Link
          to="/academy"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-space-800 text-slate-200 rounded-xl text-xs font-semibold hover:bg-space-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Academy</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/academy"
          onClick={() => playClick()}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Academy</span>
        </Link>
        {status === 'completed' && (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Curriculum Completed</span>
          </span>
        )}
      </div>

      {/* Module Header */}
      <div className="bg-space-900 border border-space-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
            MODULE #{module.order}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-space-800 text-slate-300 border border-space-700 text-xs">
            {module.category}
          </span>
          <span className="flex items-center space-x-1 text-slate-400 text-xs ml-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{module.readTimeMinutes} min study</span>
          </span>
          <span className="ml-auto font-mono text-xs font-bold text-amber-400 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{module.xpReward} Academic XP</span>
          </span>
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3">
          {module.title}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {module.description}
        </p>
      </div>

      {/* Achievement Unlocked Notice if any */}
      {newAchievements.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 flex items-center space-x-3 text-amber-200">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-sm block">New Commendation Badge Unlocked!</span>
            <span className="text-xs text-slate-300">
              {newAchievements.map((a: any) => a.title).join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Completion message */}
      {completionMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{completionMessage}</span>
        </div>
      )}

      {/* Module Content Sections */}
      <div className="space-y-6">
        {module.content?.map((section, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl bg-space-900 border border-space-800 space-y-4"
          >
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-purple-400 font-bold">
                0{idx + 1}.
              </span>
              <h2 className="font-display font-bold text-xl text-white">
                {section.heading}
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {section.body}
            </p>

            {/* Scientific Facts Box */}
            {section.facts && section.facts.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-space-950/70 border border-space-800 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Crucial Scientific Facts</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {section.facts.map((fact, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion & Next Step Bar */}
      <div className="p-6 rounded-2xl bg-space-900 border border-space-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-base text-white">
            Ground School Knowledge Verification
          </h4>
          <p className="text-xs text-slate-400">
            Confirm you have read and understood all scientific concepts in this module.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {linkedQuiz && (
            <Link
              to={`/quizzes/${linkedQuiz._id}`}
              onClick={() => playClick()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 text-xs font-semibold transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Take Module Quiz</span>
            </Link>
          )}

          <button
            onClick={handleComplete}
            disabled={status === 'completed' || isCompleting}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all ${
              status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {status === 'completed'
                ? 'Completed (+XP Claimed)'
                : isCompleting
                ? 'Submitting...'
                : 'Mark Module Complete'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
