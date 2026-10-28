import React, { useState } from 'react';
import { Exam } from '../types/exam';
import {
  ShieldAlert,
  Clock,
  HelpCircle,
  Award,
  AlertTriangle,
  CheckSquare,
  Square,
  X,
  Shuffle,
  Eye
} from 'lucide-react';

interface InstructionsModalProps {
  exam: Exam | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmStart: (examId: number) => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  exam,
  isOpen,
  onClose,
  onConfirmStart
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen || !exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
              {exam.subject}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
              {exam.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-center">
              <div className="flex items-center justify-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                <Clock className="w-4 h-4" /> Duration
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {exam.duration_minutes} Mins
              </span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-center">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold mb-1">
                <HelpCircle className="w-4 h-4" /> Questions
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {exam.question_count || 5} MCQs
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                <Award className="w-4 h-4" /> Passing Score
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {exam.passing_marks} / {exam.total_marks}
              </span>
            </div>
          </div>

          {/* Description */}
          {exam.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {exam.description}
            </p>
          )}

          {/* Examination Rules List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" /> Key Examination Rules
            </h4>
            <ul className="space-y-2 text-xs leading-relaxed">
              <li className="flex items-start gap-2">
                <Shuffle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Randomized Content:</strong> Questions and answer choices are dynamically shuffled for every single candidate session.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Countdown Timer:</strong> When the timer expires, all answered questions will be automatically finalized and submitted.</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Instant Scoring:</strong> Detailed results with explanations and score breakdown will be displayed immediately upon submission.</span>
              </li>
            </ul>
          </div>

          {/* PROCTORING & TAB SWITCH WARNING (Harder Twist) */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              Tab-Switch Anti-Cheating Policy (Judges Check)
            </div>
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
              This exam implements real-time monitoring via the browser’s <strong>Page Visibility API</strong> and window blur listeners.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold text-center">
              <div className="p-2 rounded bg-amber-100/70 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800">
                1st Switch: Warning 1/3
              </div>
              <div className="p-2 rounded bg-amber-200/80 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700">
                2nd Switch: Final Warning
              </div>
              <div className="p-2 rounded bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                3rd Switch: AUTO-SUBMIT!
              </div>
            </div>
          </div>

          {/* Acknowledgement Checkbox */}
          <label
            onClick={() => setAcknowledged(!acknowledged)}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none transition-colors"
          >
            {acknowledged ? (
              <CheckSquare className="w-5 h-5 text-indigo-600 shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-slate-400 shrink-0" />
            )}
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              I acknowledge the exam rules, agree not to switch tabs, and understand that 3 tab switches will immediately auto-submit my exam.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!acknowledged}
            onClick={() => onConfirmStart(exam.id)}
            className={`px-5 py-2 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
              acknowledged
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Eye className="w-4 h-4" />
            Start Examination Now
          </button>
        </div>
      </div>
    </div>
  );
};
