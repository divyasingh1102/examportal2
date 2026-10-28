import React from 'react';
import { PerformanceAnalytics } from '../types/exam';
import { BarChart3, Target, PieChart, ShieldAlert, Award } from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: PerformanceAnalytics | null;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="p-8 text-center text-slate-400 dark:text-slate-500">
        Loading performance analytics...
      </div>
    );
  }

  const { examAverages, questionAccuracy, distribution, submissionBreakdown } = analytics;

  return (
    <div className="space-y-8">
      {/* Chart 1: Accuracy Per Question (Hackathon Problem 7 Twist!) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Accuracy Per Question (Judge Specification)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Shows the percentage of students who selected the correct answer for each question in the bank.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> High (&gt;75%)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Medium (50-75%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Low (&lt;50%)
            </span>
          </div>
        </div>

        {/* Question Accuracy Horizontal Bars */}
        <div className="space-y-4">
          {questionAccuracy && questionAccuracy.length > 0 ? (
            questionAccuracy.map((q, idx) => {
              const accuracy = q.accuracyPercentage;
              let barColor = 'bg-emerald-500';
              let badgeColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';

              if (accuracy < 50) {
                barColor = 'bg-rose-500';
                badgeColor = 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
              } else if (accuracy <= 75) {
                barColor = 'bg-indigo-500';
                badgeColor = 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
              }

              return (
                <div key={q.questionId} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono text-[11px] text-slate-700 dark:text-slate-300 shrink-0">
                        Q{idx + 1}
                      </span>
                      <span className="truncate font-medium text-slate-700 dark:text-slate-300" title={q.questionText}>
                        {q.questionText}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-normal shrink-0">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${badgeColor}`}>
                        {accuracy}% Accuracy
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({q.totalCorrect}/{q.totalAnswered} Correct)
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">No question accuracy data available yet.</p>
          )}
        </div>
      </div>

      {/* Row 2: Average Score per Exam & Submission Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Score Per Exam */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Average Score by Examination
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mean student performance percentage for active exams
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {examAverages && examAverages.length > 0 ? (
                examAverages.map(e => (
                  <div key={e.examId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{e.title}</span>
                        <span className="text-slate-400 ml-1.5 text-[11px]">({e.subject})</span>
                      </div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {e.averageScore}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${e.averageScore}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No attempts recorded yet.</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Minimum passing requirement: 40%</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">All tests meeting quota</span>
          </div>
        </div>

        {/* Submission Breakdown (Tab Violation vs Manual vs Timeout) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Submission Types & Proctoring Audit
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Distribution of student completions vs tab-switching terminations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Manual Submit
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {submissionBreakdown?.manual || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Clean submittal</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Timer Expiry
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {submissionBreakdown?.timeout || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Auto-timeout</div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
                <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mb-1">
                  Tab Violations
                </div>
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {submissionBreakdown?.tabViolation || 0}
                </div>
                <div className="text-[10px] text-rose-500/80 mt-0.5">3 strikes reached</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Page Visibility API proctoring is enabled on all exams</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {submissionBreakdown?.tabViolation || 0} Flagged Violations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
