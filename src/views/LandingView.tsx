import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldAlert,
  Clock,
  Shuffle,
  BarChart3,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Users,
  Eye,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onSelectExam?: (examId: number) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { user, quickLogin } = useAuth();

  const handleStartExam = () => {
    if (user) {
      onNavigate('student-dashboard');
    } else {
      onNavigate('auth');
    }
  };

  const handleJudgeDemo = async () => {
    await quickLogin('student');
    onNavigate('student-dashboard');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-blue-500/15 to-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Academic Examination Platform &bull; Node.js + MySQL
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Smarter Exams.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 dark:from-indigo-400 dark:via-blue-400 dark:to-violet-400">
              Instant Results.
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A high-integrity online examination environment with automated self-grading, dynamic question & option shuffling, real-time Page Visibility tab-switch monitoring, and in-depth question accuracy analytics.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartExam}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Start Examination
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              Explore Features
            </button>

            {/* Judge 1-click test button */}
            <button
              onClick={handleJudgeDemo}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Judge Quick Demo
            </button>
          </div>

          {/* Highlights pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Shuffled Questions &amp; Options
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3-Strike Tab Switch Auto-Submit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Accuracy Per Question Analytics
            </span>
          </div>
        </div>

        {/* Live Interface Preview Mockup */}
        <div className="max-w-4xl mx-auto px-4 mt-12">
          <div className="p-3 sm:p-5 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-sm">
            <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {/* Exam Header Preview */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-2">
                    Web Engineering &bull; Live Examination Portal
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5" /> 09:42 Remaining
                </div>
              </div>

              {/* Sample Question Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Question 3 of 10
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      +10 Marks
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100">
                    Which internal library provides the cross-platform asynchronous I/O event loop in Node.js?
                  </h4>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-3 rounded-lg border-2 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">A</span>
                      libuv (Selected)
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-[10px]">B</span>
                      V8 JavaScript Engine
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-[10px]">C</span>
                      OpenSSL Cryptography Engine
                    </div>
                  </div>
                </div>

                {/* Right side Question Navigator Preview */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Question Palette
                  </h5>
                  <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
                    <span className="p-1.5 rounded bg-emerald-500 text-white text-center">1</span>
                    <span className="p-1.5 rounded bg-emerald-500 text-white text-center">2</span>
                    <span className="p-1.5 rounded bg-indigo-600 text-white ring-2 ring-indigo-400 text-center">3</span>
                    <span className="p-1.5 rounded bg-purple-500 text-white text-center">4</span>
                    <span className="p-1.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-center">5</span>
                  </div>
                  <div className="pt-2 text-[10px] space-y-1 text-slate-500">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Answered</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Marked for Review</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> Unanswered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Enterprise Integrity
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built for Academic Precision &amp; Strict Proctoring
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every feature directly addresses common examination pitfalls and cheating risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Timed Examinations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time countdown timer with visual color shifts. Automatically submits and scores all questions the exact millisecond time expires.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shuffle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Randomized MCQs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Fisher-Yates shuffling algorithm randomizes question ordering and option choices (A, B, C, D) for each student session to prevent side-by-side copying.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              3-Strike Tab Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Utilizes the HTML5 Page Visibility API and blur events. Warns twice on tab changes, and automatically submits on the 3rd infraction.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Admin Analytics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Comprehensive analytics dashboard showing average scores, submission audit logs, and accuracy percentages per question in the bank.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Explanation Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple Workflow
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              How the Examination Portal Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-600/30">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Select Exam &amp; Review Rules
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Log in as a student, view active exams, and acknowledge the proctoring and tab-switching guidelines.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-blue-600/30">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Answer Shuffled Questions
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Navigate questions using the palette, mark items for review, and stay within the exam tab without switching.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-emerald-600/30">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Instant Automated Results
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Submit manually or let the timer finalize. Get immediate scoring, pass/fail status, and explanation breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
