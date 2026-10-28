import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Exam, Question } from '../types/exam';
import { examApi } from '../services/api';
import { SubmitConfirmModal } from '../components/SubmitConfirmModal';
import { TabViolationModal } from '../components/TabViolationModal';
import {
  Clock,
  ShieldAlert,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Send,
  RotateCcw,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';

interface ExamInterfaceViewProps {
  examId: number;
  onFinishExam: (attemptId: number) => void;
}

export const ExamInterfaceView: React.FC<ExamInterfaceViewProps> = ({
  examId,
  onFinishExam
}) => {
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [exam, setExam] = useState<Partial<Exam> | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student Responses: { [questionId]: selectedOptionId }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  // Marked for review set of question IDs
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  // Timer (seconds)
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  // Proctoring Tab Switch Detection
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [activeViolationModalNumber, setActiveViolationModalNumber] = useState<number | null>(null);
  const isAutoSubmittingRef = useRef<boolean>(false);

  // Submit Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial setup: start exam session
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const res = await examApi.startExam(examId);
        if (res.success && isMounted) {
          setAttemptId(res.attemptId);
          setExam(res.exam);
          setQuestions(res.questions);
          setTimeLeft(res.exam.duration_minutes * 60);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to start exam:', err);
        alert(err.message || 'Could not initialize examination session.');
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [examId]);

  // Timer Countdown Effect
  useEffect(() => {
    if (loading || !attemptId || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, attemptId, timeLeft]);

  // HARDER TWIST 2: Page Visibility API & Window Blur listener for Tab Switching Detection
  useEffect(() => {
    if (loading || !attemptId) return;

    let debounceTimer: any = null;

    const handleTabSwitch = async () => {
      if (isAutoSubmittingRef.current) return;

      // Only trigger if document becomes hidden
      if (document.visibilityState === 'hidden') {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          if (isAutoSubmittingRef.current) return;

          try {
            const res = await examApi.recordViolation(
              attemptId,
              `Page Visibility changed to hidden (Tab switch detected)`
            );

            if (res.success) {
              const newCount = res.violationNumber;
              setViolationsCount(newCount);
              setActiveViolationModalNumber(newCount);

              // 3rd Violation: Auto-submit immediately!
              if (newCount >= 3) {
                isAutoSubmittingRef.current = true;
                await handleAutoSubmit('tab_violation');
              }
            }
          } catch (e) {
            console.warn('Error recording violation:', e);
          }
        }, 150);
      }
    };

    document.addEventListener('visibilitychange', handleTabSwitch);

    return () => {
      document.removeEventListener('visibilitychange', handleTabSwitch);
      clearTimeout(debounceTimer);
    };
  }, [loading, attemptId]);

  // Final submission logic
  const handleFinalSubmit = async (submissionType: string = 'manual') => {
    if (!attemptId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await examApi.submitExam(attemptId, {
        answers: selectedAnswers,
        submissionType
      });

      if (res.success) {
        onFinishExam(attemptId);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      alert('Failed to submit exam: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async (reason: 'timeout' | 'tab_violation') => {
    if (!attemptId || isAutoSubmittingRef.current) return;
    isAutoSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await examApi.submitExam(attemptId, {
        answers: selectedAnswers,
        submissionType: reason
      });
    } catch (e) {
      console.warn('Auto-submit network notice:', e);
    }
  };

  // Option selection
  const handleSelectOption = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Clear current question selection
  const handleClearSelection = (questionId: number) => {
    setSelectedAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  // Toggle mark for review
  const handleToggleReview = (questionId: number) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Randomizing question bank &amp; preparing exam session...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const markedCount = markedForReview.size;
  const unansweredCount = totalQuestions - answeredCount;

  // Format timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Timer alert styling
  let timerBadgeColor = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
  if (timeLeft < 60) {
    timerBadgeColor = 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse font-extrabold';
  } else if (timeLeft < 300) {
    timerBadgeColor = 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 font-bold';
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between select-none">
      {/* 1. COMPACT FIXED HEADER */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Exam and Student info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {exam?.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {exam?.subject}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Candidate: {user?.name} ({user?.student_id || 'STU-101'})
              </p>
            </div>
          </div>

          {/* Right: Tab Violation Indicator + Live Countdown Timer */}
          <div className="flex items-center gap-3">
            {/* Real-time violation counter badge (Judges check) */}
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
              violationsCount === 0
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                : violationsCount === 1
                ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 text-yellow-700 dark:text-yellow-400'
                : violationsCount === 2
                ? 'bg-amber-50 dark:bg-amber-950 border-amber-400 text-amber-700 dark:text-amber-400'
                : 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-600 dark:text-rose-400'
            }`}>
              <ShieldAlert className="w-4 h-4" />
              <span>Tab Strikes: <strong>{violationsCount}/3</strong></span>
            </div>

            {/* Live Countdown Timer */}
            <div className={`px-3 py-1.5 rounded-xl border text-sm font-mono flex items-center gap-2 shadow-sm ${timerBadgeColor}`}>
              <Clock className="w-4 h-4" />
              <span className="tracking-wider">{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </header>

      {/* 2. MAIN EXAMINATION WORKSPACE */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
        {/* Left: Central Question Area (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center">
                  Q{currentIndex + 1}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {currentQuestion.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  +{currentQuestion.marks} Marks
                </span>
                <button
                  onClick={() => handleToggleReview(currentQuestion.id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    markedForReview.has(currentQuestion.id)
                      ? 'bg-purple-50 dark:bg-purple-950 border-purple-300 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${markedForReview.has(currentQuestion.id) ? 'fill-current' : ''}`} />
                  {markedForReview.has(currentQuestion.id) ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQuestion.question_text}
            </h2>

            {/* Shuffled Options List (4 Cards) */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt, optIndex) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                const optionLabel = opt.label || String.fromCharCode(65 + optIndex);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-600 text-indigo-950 dark:text-indigo-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {optionLabel}
                    </div>

                    <span className="text-sm font-medium leading-normal flex-1">
                      {opt.option_text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer Navigation within Question Card */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleClearSelection(currentQuestion.id)}
                disabled={!selectedAnswers[currentQuestion.id]}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Response
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1"
                  >
                    Review &amp; Submit <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Question Navigator Palette (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Question Navigator
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {answeredCount}/{totalQuestions} Done
              </span>
            </div>

            {/* Question Number Palette Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isMarked = markedForReview.has(q.id);

                let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';

                if (isMarked) {
                  badgeStyle = 'bg-purple-600 text-white font-bold';
                } else if (isAnswered) {
                  badgeStyle = 'bg-emerald-600 text-white font-bold';
                }

                if (isCurrent) {
                  badgeStyle += ' ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 font-extrabold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${badgeStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-2 text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Answered
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Marked for Review
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{markedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span> Unanswered
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{unansweredCount}</span>
              </div>
            </div>

            {/* Submit Button in Sidebar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Examination
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. SUBMIT CONFIRMATION MODAL */}
      <SubmitConfirmModal
        isOpen={showSubmitModal}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        markedCount={markedCount}
        unansweredCount={unansweredCount}
        isSubmitting={isSubmitting}
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={() => handleFinalSubmit('manual')}
      />

      {/* 4. TAB VIOLATION ALERT MODAL (1st, 2nd, and 3rd strikes) */}
      <TabViolationModal
        isOpen={activeViolationModalNumber !== null}
        violationNumber={activeViolationModalNumber || 1}
        onAcknowledge={() => setActiveViolationModalNumber(null)}
        onViewResults={() => {
          if (attemptId) onFinishExam(attemptId);
        }}
      />
    </div>
  );
};
