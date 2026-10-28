import React from 'react';
import { ShieldAlert, AlertTriangle, AlertOctagon, ArrowRight, ShieldX } from 'lucide-react';

interface TabViolationModalProps {
  isOpen: boolean;
  violationNumber: number; // 1, 2, or 3
  onAcknowledge: () => void;
  onViewResults?: () => void;
}

export const TabViolationModal: React.FC<TabViolationModalProps> = ({
  isOpen,
  violationNumber,
  onAcknowledge,
  onViewResults
}) => {
  if (!isOpen) return null;

  const isFinalViolation = violationNumber >= 3;
  const isSecondViolation = violationNumber === 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isFinalViolation
          ? 'bg-rose-950/90 border-rose-500 text-white shadow-rose-900/50'
          : isSecondViolation
          ? 'bg-amber-950/90 border-amber-500 text-white shadow-amber-900/50'
          : 'bg-slate-900 border-yellow-500 text-white shadow-yellow-900/40'
      }`}>
        {/* Glow Header */}
        <div className={`p-6 text-center border-b ${
          isFinalViolation
            ? 'border-rose-800 bg-rose-900/40'
            : isSecondViolation
            ? 'border-amber-800 bg-amber-900/40'
            : 'border-yellow-800 bg-yellow-900/40'
        }`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 animate-pulse ${
            isFinalViolation
              ? 'bg-rose-500/20 text-rose-400'
              : isSecondViolation
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {isFinalViolation ? (
              <AlertOctagon className="w-10 h-10" />
            ) : isSecondViolation ? (
              <ShieldAlert className="w-10 h-10" />
            ) : (
              <AlertTriangle className="w-10 h-10" />
            )}
          </div>

          <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 ${
            isFinalViolation
              ? 'bg-rose-600 text-white'
              : isSecondViolation
              ? 'bg-amber-600 text-white'
              : 'bg-yellow-600 text-white'
          }`}>
            {isFinalViolation
              ? 'Violation 3 of 3 (Auto-Submitted)'
              : isSecondViolation
              ? 'Violation 2 of 3 (Final Warning)'
              : 'Violation 1 of 3 (Warning)'}
          </span>

          <h3 className="text-xl font-extrabold tracking-tight">
            {isFinalViolation
              ? 'Exam Terminated & Submitted'
              : isSecondViolation
              ? 'Critical Final Warning!'
              : 'Tab Switching Detected!'}
          </h3>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-center">
          <p className="text-sm text-slate-300 leading-relaxed">
            {isFinalViolation ? (
              <>
                You switched tabs or left the examination window <strong>3 times</strong>.
                As per the strict anti-cheating policy, your exam has been <strong>automatically finalized and graded</strong>. This attempt has been logged with security violations.
              </>
            ) : isSecondViolation ? (
              <>
                You navigated away from the exam tab for a second time.
                <br />
                <strong className="text-amber-300">
                  ONE MORE TAB SWITCH WILL IMMEDIATELY AND PERMANENTLY SUBMIT YOUR EXAM!
                </strong>
              </>
            ) : (
              <>
                The browser's Page Visibility API detected that you navigated away from the active exam screen.
                All tab switches are recorded. You have <strong>2 warnings remaining</strong>.
              </>
            )}
          </p>

          <div className="grid grid-cols-3 gap-2 py-2">
            <div className={`p-2 rounded-lg text-xs font-bold border ${
              violationNumber >= 1
                ? 'bg-yellow-500/30 border-yellow-500 text-yellow-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              Strike 1 (Warning)
            </div>
            <div className={`p-2 rounded-lg text-xs font-bold border ${
              violationNumber >= 2
                ? 'bg-amber-500/30 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              Strike 2 (Final Warning)
            </div>
            <div className={`p-2 rounded-lg text-xs font-bold border ${
              violationNumber >= 3
                ? 'bg-rose-500/40 border-rose-500 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              Strike 3 (Auto-Submit)
            </div>
          </div>
        </div>

        {/* Modal Action */}
        <div className="p-6 pt-0">
          {isFinalViolation ? (
            <button
              onClick={onViewResults}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-all flex items-center justify-center gap-2"
            >
              View Graded Exam Results
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onAcknowledge}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSecondViolation
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40'
              }`}
            >
              I Understand — Return to Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
