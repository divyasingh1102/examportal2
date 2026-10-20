import React, { useState } from 'react';
import { X, CheckCircle2, GitBranch, Github, UploadCloud, AlertCircle, FileCode } from 'lucide-react';
import { useCampus } from '../context/CampusContext';

interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  const { submitAssignment } = useCampus();

  const [repoUrl, setRepoUrl] = useState('https://github.com/cs301-spring25/raft-alexchen');
  const [commitHash, setCommitHash] = useState('d4e198a');
  const [useGraceDay, setUseGraceDay] = useState(false);
  const [honestyChecked, setHonestyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      submitAssignment('CS 301', commitHash, '20/20 Passed (100%)');

      setTimeout(() => {
        onSubmitSuccess();
        onClose();
        setSubmitted(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0051d5] text-white flex items-center justify-center font-bold text-sm">
              CS
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">CS 301 Milestone 2</span>
              <h3 className="font-bold text-sm text-[#131b2e]">Submit Raft Consensus Implementation</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#131b2e]">Assignment Successfully Submitted!</h4>
            <p className="text-xs text-[#444651] max-w-sm">
              Your commit <code className="font-mono bg-[#f2f3ff] px-1 py-0.5 rounded">{commitHash}</code> was verified by Gradescope.
              Autograder test score: <strong className="text-[#047857]">20/20 Passed (100%)</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Test Suite Summary Banner */}
            <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center font-bold text-xs">
                  80%
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#131b2e]">Pre-submission Autograder</p>
                  <p className="text-[11px] text-[#444651]">16/20 Unit Tests Passed locally</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">
                Due in 6 hrs (11:59 PM)
              </span>
            </div>

            {/* GitHub Repo */}
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                GitHub Classroom Repository URL
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#faf8ff] rounded-lg border border-[#dae2fd]">
                <Github className="w-4 h-4 text-[#757682]" />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                  className="flex-1 text-xs bg-transparent text-[#131b2e] focus:outline-none"
                />
              </div>
            </div>

            {/* Commit Hash */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Target Git Commit Hash
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#faf8ff] rounded-lg border border-[#dae2fd]">
                  <GitBranch className="w-4 h-4 text-[#757682]" />
                  <input
                    type="text"
                    value={commitHash}
                    onChange={(e) => setCommitHash(e.target.value)}
                    required
                    className="flex-1 text-xs bg-transparent text-[#131b2e] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Optional Code Archive (.zip)
                </label>
                <div className="flex items-center justify-center px-3 py-1.5 bg-[#faf8ff] rounded-lg border border-dashed border-[#dae2fd] text-xs text-[#757682] cursor-pointer hover:bg-[#f2f3ff]">
                  <UploadCloud className="w-4 h-4 mr-1 text-[#0051d5]" />
                  <span>Attach source backup</span>
                </div>
              </div>
            </div>

            {/* Grace Day Check */}
            <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#fef3c7] flex items-start gap-2.5">
              <input
                type="checkbox"
                id="grace-day"
                checked={useGraceDay}
                onChange={(e) => setUseGraceDay(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#0051d5] accent-[#0051d5]"
              />
              <label htmlFor="grace-day" className="text-xs text-[#92400e] cursor-pointer">
                <strong>Apply 1 Grace Day</strong> (Remaining quota: 3 days). Extends deadline to tomorrow 11:59 PM with 0 penalty.
              </label>
            </div>

            {/* Honor Code */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="honesty"
                checked={honestyChecked}
                onChange={(e) => setHonestyChecked(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 rounded text-[#0051d5] accent-[#0051d5]"
              />
              <label htmlFor="honesty" className="text-[11px] text-[#444651] cursor-pointer">
                I certify that this submission represents my own work in accordance with the University Academic Integrity Policy and CS Department Ethics Guidelines.
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#e2e7ff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#444651] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!honestyChecked || isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0051d5] hover:bg-[#00236f] rounded-lg disabled:opacity-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Validating Tests...</span>
                  </>
                ) : (
                  <span>Submit to Gradescope</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
