import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Quiz } from '../types';
import { useAudio } from '../context/AudioContext';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  RotateCcw,
  Clock,
} from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { playClick, playSuccess, playFail } = useAudio();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.getQuiz(id);
        if (data.success && data.quiz) {
          setQuiz(data.quiz);
          // initialize empty answers
          setSelectedAnswers(new Array(data.quiz.questions?.length || 0).fill(-1));
        }
      } catch (err) {
        console.error('Failed to load quiz', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSelectOption = (optionIndex: number) => {
    playClick();
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[currentIdx] = optionIndex;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!id || !quiz) return;

    // Check if any question remains unanswered
    const unansweredCount = selectedAnswers.filter((a) => a === -1).length;
    if (unansweredCount > 0) {
      if (!window.confirm(`You still have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitQuiz(id, selectedAnswers);
      if (res.success) {
        setResult(res.result);
        if (res.result.passed) {
          playSuccess();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#38bdf8', '#a855f7', '#f59e0b'],
          });
        } else {
          playFail();
        }
      }
    } catch (err: any) {
      alert(err.message || 'Quiz submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    playClick();
    setResult(null);
    setCurrentIdx(0);
    setSelectedAnswers(new Array(quiz?.questions?.length || 0).fill(-1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz || !quiz.questions) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-space-900 border border-space-800 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="font-display font-bold text-lg text-white">Quiz Unavailable</h3>
        <Link
          to="/quizzes"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-space-800 text-slate-200 rounded-xl text-xs font-semibold hover:bg-space-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Quiz Directory</span>
        </Link>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  // If results have been evaluated, show comprehensive Review View
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Results Banner */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border transition-all ${
            result.passed
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {result.passed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-10 h-10 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider block text-slate-400">
                  Quiz Evaluation
                </span>
                <h2 className="font-display font-extrabold text-2xl text-white">
                  {result.passed ? 'Certification Granted!' : 'Passing Standard Not Met'}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Required: {result.passingScore}% correct. You achieved {result.percentage}%.
                </p>
              </div>
            </div>

            <div className="bg-space-950/80 p-4 rounded-xl border border-space-800 text-center shrink-0 w-full sm:w-auto">
              <span className="font-display font-extrabold text-3xl text-white block">
                {result.score} / {result.totalQuestions}
              </span>
              <span className="font-mono text-xs text-cyan-400 font-bold block">
                {result.percentage}% SCORE
              </span>
            </div>
          </div>

          {result.xpEarned > 0 && (
            <div className="mt-4 pt-4 border-t border-space-800/80 flex items-center space-x-2 text-amber-300 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+{result.xpEarned} Trainee XP Added to your Record!</span>
            </div>
          )}
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-lg text-white">
            Answers & Scientific Explanations
          </h3>

          {result.results.map((r: any, idx: number) => (
            <div
              key={r.id}
              className={`p-5 rounded-2xl border ${
                r.isCorrect
                  ? 'bg-space-900 border-emerald-500/30'
                  : 'bg-space-900 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-slate-400">
                  Question {idx + 1}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    r.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {r.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <h4 className="font-medium text-slate-100 text-sm mb-3">
                {r.prompt}
              </h4>

              {/* User Selection vs Correct Selection */}
              <div className="space-y-1.5 text-xs mb-3">
                <div className="text-slate-300">
                  <span className="text-slate-500">Your Answer: </span>
                  <span className={r.isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300'}>
                    {r.userAnswer !== -1 ? `Option ${r.userAnswer + 1}` : 'Not Answered'}
                  </span>
                </div>
                {!r.isCorrect && (
                  <div className="text-slate-300">
                    <span className="text-slate-500">Correct Answer: </span>
                    <span className="text-emerald-300 font-semibold">
                      Option {r.correctIndex + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Explanation */}
              <div className="p-3 rounded-xl bg-space-950/70 border border-space-850 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-cyan-300 block mb-0.5">Scientific Reason:</span>
                {r.explanation}
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-space-800">
          <Link
            to="/quizzes"
            onClick={() => playClick()}
            className="px-4 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Back to Quizzes
          </Link>
          <button
            onClick={handleRetake}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Evaluation</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz Interface
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/quizzes"
          onClick={() => playClick()}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </Link>

        <span className="font-mono text-xs text-slate-400">
          Question <span className="text-cyan-400 font-bold">{currentIdx + 1}</span> of{' '}
          {questions.length}
        </span>
      </div>

      {/* Progress Bar & Question Selector Pills */}
      <div className="space-y-3">
        <div className="w-full bg-space-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {questions.map((_, qIdx) => (
            <button
              key={qIdx}
              onClick={() => {
                playClick();
                setCurrentIdx(qIdx);
              }}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                currentIdx === qIdx
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : selectedAnswers[qIdx] !== -1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-space-900 text-slate-500 border border-space-800 hover:text-slate-300'
              }`}
            >
              {qIdx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Question Card */}
      <div className="bg-space-900 border border-space-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          {currentQuestion.factTag && (
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-mono font-semibold uppercase tracking-wider inline-block mb-3">
              {currentQuestion.factTag}
            </span>
          )}
          <h2 className="font-display font-bold text-lg sm:text-xl text-white leading-relaxed">
            {currentQuestion.prompt}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentIdx] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm border transition-all flex items-start space-x-3 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md shadow-cyan-500/15 font-semibold'
                    : 'bg-space-950/60 text-slate-300 border-space-800 hover:bg-space-800/60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-cyan-400 text-space-950'
                      : 'bg-space-850 text-slate-400 border border-space-700'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="leading-relaxed pt-0.5">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="pt-4 border-t border-space-800 flex items-center justify-between">
          <button
            onClick={() => {
              playClick();
              setCurrentIdx((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-slate-300 text-xs font-semibold disabled:opacity-40 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Answers'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playClick();
                setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1));
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
