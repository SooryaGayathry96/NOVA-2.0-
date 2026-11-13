import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Quiz } from '../types';
import { useAudio } from '../context/AudioContext';
import {
  HelpCircle,
  CheckCircle2,
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';

export const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { playClick } = useAudio();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await api.getQuizzes();
        if (data.success) {
          setQuizzes(data.quizzes);
        }
      } catch (err) {
        console.error('Failed to load quizzes', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-space-900 border border-space-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Scientific Evaluation Engine</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Astronaut Knowledge Quizzes
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Validate your grasp of orbital mechanics, spacecraft propulsion, space health, and astrophysics to earn trainee rank promotions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-950/70 border border-space-800 flex items-center space-x-3 shrink-0">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Certification</span>
              <span className="font-bold text-sm text-slate-100">NASA Standards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => {
            const hasPassed = quiz.bestAttempt?.passed;
            return (
              <div
                key={quiz._id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  hasPassed
                    ? 'bg-space-900/90 border-emerald-500/30'
                    : 'bg-space-900 border-space-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {quiz.questionCount} QUESTIONS
                    </span>
                    {hasPassed && (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Certified ({quiz.bestAttempt?.percentage}%)</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    {quiz.description}
                  </p>

                  <div className="p-3 rounded-xl bg-space-950/60 border border-space-850 flex items-center justify-between text-xs mb-4">
                    <span className="text-slate-400">Passing Requirement:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{quiz.passingScore}% correct</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-space-800/80 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{quiz.xpReward} XP</span>
                  </span>

                  <Link
                    to={`/quizzes/${quiz._id}`}
                    onClick={() => playClick()}
                    className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      hasPassed
                        ? 'bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    <span>{hasPassed ? 'Retake Quiz' : 'Begin Evaluation'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
