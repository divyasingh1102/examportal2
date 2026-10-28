import React from 'react';
import { CheckCircle2, Bookmark, HelpCircle, AlertTriangle, Send, ArrowLeft } from 'lucide-react';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  markedCount: number;
  unansweredCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  totalQuestions,
  answeredCount,
  markedCount,
  unansweredCount,
  onCancel,
  onConfirm,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Ready to Submit Your Exam?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please review your question completion summary below before final submission.
          </p>
        </div>

        {/* Question Completion Summary Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Answered
              </div>
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {answeredCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 font-semibold text-xs mb-1">
                <Bookmark className="w-3.5 h-3.5" /> For Review
              </div>
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {markedCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-xs mb-1">
                <HelpCircle className="w-3.5 h-3.5" /> Unanswered
              </div>
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {unansweredCount}
              </span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                You have <strong>{unansweredCount} unanswered questions</strong>. Once submitted, you cannot change or revisit your answers.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Test
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            {isSubmitting ? 'Grading Answers...' : 'Submit & Grade Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};
