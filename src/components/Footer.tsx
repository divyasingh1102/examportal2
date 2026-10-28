import React from 'react';
import { GraduationCap, ShieldAlert, Cpu, Database, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">ExamPulse</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Academic online examination portal featuring automated scoring, randomized question banks, Page Visibility proctoring, and comprehensive admin analytics.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Built for College & Hackathon Demonstrations
            </div>
          </div>

          {/* Col 2: Harder Twists & Features */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Timed MCQ Tests with Instant Scoring
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Randomized Questions & Shuffled Options
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                3-Strike Tab Switch Auto-Submit
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Accuracy Per Question Analytics
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture Stack */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Technology Stack
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Node.js & Express.js REST API
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-500" /> MySQL 8.0 with Parameterized Queries
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Browser Page Visibility API
              </div>
            </div>
          </div>

          {/* Col 4: Quick Demo Credentials */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Judge Quick Credentials
            </h4>
            <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <div><strong className="text-indigo-600 dark:text-indigo-400">Student:</strong> student@examportal.com</div>
              <div><strong className="text-slate-500">Pass:</strong> student123</div>
              <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
                <strong className="text-violet-600 dark:text-violet-400">Admin:</strong> admin@examportal.com
              </div>
              <div><strong className="text-slate-500">Pass:</strong> admin123</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© 2026 ExamPulse Portal. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium">
            Protected against multi-tab switching & unauthorized window blur.
          </p>
        </div>
      </div>
    </footer>
  );
};
