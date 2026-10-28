import React, { useState, useEffect } from 'react';
import { ExamAttempt, AttemptAnswer, TabViolation } from '../types/exam';
import { examApi } from '../services/api';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  ArrowLeft,
  RotateCcw,
  Clock,
  Printer,
  Sparkles,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface ResultViewProps {
  attemptId: number;
  onBackToDashboard: () => void;
  onRetakeExam: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  attemptId,
  onBackToDashboard,
  onRetakeExam
}) => {
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [answers, setAnswers] = useState<AttemptAnswer[]>([]);
  const [violations, setViolations] = useState<TabViolation[]>([]);

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await examApi.getAttemptResult(attemptId);
        if (res.success) {
          setAttempt(res.attempt);
          setAnswers(res.answers);
          setViolations(res.violations);
        }
      } catch (err) {
        console.error('Failed to load attempt result:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [attemptId]);

  if (loading || !attempt) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Computing automated scoring &amp; generating question review...
        </p>
      </div>
    );
  }

  const passed = (attempt.percentage || 0) >= 40;
  const isDisqualifiedOrFlagged = attempt.submission_type === 'tab_violation' || (attempt.tab_violations_count || 0) >= 3;

  let grade = 'F';
  if (attempt.percentage >= 90) grade = 'A+';
  else if (attempt.percentage >= 80) grade = 'A';
  else if (attempt.percentage >= 70) grade = 'B';
  else if (attempt.percentage >= 60) grade = 'C';
  else if (attempt.percentage >= 40) grade = 'D';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner / Scorecard */}
      <div className={`p-8 rounded-3xl border-2 text-center space-y-6 shadow-xl ${
        isDisqualifiedOrFlagged
          ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
          : passed
          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
          : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
      }`}>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-slate-900 shadow-sm">
            {passed ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Examination Passed
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Passing Score Not Met
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {attempt.exam_title || 'Academic Examination'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated grading complete &bull; Submitted on {new Date(attempt.created_at).toLocaleString()}
          </p>
        </div>

        {/* Big Score Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 block mb-1">Final Score</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {attempt.score} <span className="text-xs text-slate-400 font-normal">/ {attempt.total_marks}</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 block mb-1">Percentage</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {attempt.percentage}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 block mb-1">Grade</span>
            <span className={`text-2xl font-black ${
              passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {grade}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 block mb-1">Tab Violations</span>
            <span className={`text-2xl font-black ${
              attempt.tab_violations_count > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {attempt.tab_violations_count || 0}
            </span>
          </div>
        </div>

        {/* Submission & Proctoring Status Notice */}
        <div className="max-w-xl mx-auto pt-2">
          {attempt.submission_type === 'tab_violation' ? (
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span><strong>Auto-Submitted on 3rd Tab Switch:</strong> Flagged for administrative integrity review.</span>
            </div>
          ) : attempt.submission_type === 'timeout' ? (
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Auto-Submitted on Timer Expiry:</strong> All answered questions saved cleanly.</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Clean Submission:</strong> Submitted manually by candidate with valid integrity token.</span>
            </div>
          )}
        </div>
      </div>

      {/* Proctoring Log if violations occurred */}
      {violations && violations.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" /> Proctoring Log &bull; {violations.length} Tab Switches Detected
          </div>
          <div className="space-y-2">
            {violations.map((v, i) => (
              <div key={v.id || i} className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-center justify-between">
                <span>Strike #{v.violation_number}: {v.details}</span>
                <span className="font-mono text-[10px] text-rose-500">
                  {new Date(v.detected_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Question-by-Question Detailed Review */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Question-by-Question Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review your selected choices against the verified answer key and conceptual explanations.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Result
          </button>
        </div>

        <div className="space-y-4">
          {answers && answers.length > 0 ? (
            answers.map((ans, idx) => {
              const isCorrect = ans.is_correct === 1 || ans.is_correct === true;

              return (
                <div
                  key={ans.id || idx}
                  className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm space-y-4 ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/60'
                      : 'border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {ans.category || 'General'}
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {isCorrect ? `+${ans.marks_awarded} Marks` : '0 Marks'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {ans.question_text}
                  </h3>

                  {/* Chosen Option vs Correct Option */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className={`p-3 rounded-xl border ${
                      isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    }`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 mb-1">
                        Your Selected Choice:
                      </span>
                      <div className="font-semibold flex items-center gap-1.5">
                        {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        <span>{ans.selected_option_text || '(Skipped / Not Answered)'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 mb-1">
                        Correct Answer:
                      </span>
                      <div className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{ans.correct_option_text || 'See explanation'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Explanation Box */}
                  {ans.explanation && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Explanation &amp; Key Concept:
                      </span>
                      <p className="leading-relaxed">{ans.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">Question breakdown loaded.</p>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <button
          onClick={onRetakeExam}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Take Another Examination
        </button>
      </div>
    </div>
  );
};
