import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Exam, ExamAttempt } from '../types/exam';
import { examApi } from '../services/api';
import { InstructionsModal } from '../components/InstructionsModal';
import {
  GraduationCap,
  Clock,
  HelpCircle,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  History,
  FileText,
  ShieldAlert
} from 'lucide-react';

interface StudentDashboardViewProps {
  onStartExam: (examId: number) => void;
  onViewResult: (attemptId: number) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onStartExam,
  onViewResult
}) => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamForModal, setSelectedExamForModal] = useState<Exam | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [examsRes, attemptsRes] = await Promise.all([
          examApi.getExams(),
          examApi.getStudentAttempts()
        ]);
        if (examsRes.success) setExams(examsRes.exams);
        if (attemptsRes.success) setAttempts(attemptsRes.attempts);
      } catch (err) {
        console.warn('Dashboard data loading notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const completedAttempts = attempts.filter(a => a.status === 'completed' || a.status === 'disqualified');
  const avgScore = completedAttempts.length > 0
    ? (completedAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / completedAttempts.length).toFixed(1)
    : '0.0';

  const totalViolations = attempts.reduce((acc, curr) => acc + (curr.tab_violations_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-300" /> Candidate Portal &bull; {user?.student_id || 'STU-2026-101'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            You are enrolled in the academic assessment portal. Complete active MCQ evaluations before their respective deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
          <div className="p-2.5 rounded-xl bg-indigo-500/30 text-indigo-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <div className="font-bold">Verified Session</div>
            <div className="text-indigo-200 font-mono text-[11px]">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Available Exams</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {exams.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Ready to attempt
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Completed Tests</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {completedAttempts.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Graded attempts
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {avgScore}%
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
            Overall performance
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Conduct &amp; Integrity</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalViolations === 0 ? 'Clean' : `${totalViolations} Strikes`}
          </div>
          <div className={`text-[11px] font-medium mt-1 ${
            totalViolations === 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}>
            {totalViolations === 0 ? 'Zero tab switches logged' : 'Flagged tab violations'}
          </div>
        </div>
      </div>

      {/* Available Examinations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Available Examinations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an assessment to review guidelines and begin your timed test.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            {exams.length} Active Tests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exams.map(exam => (
            <div
              key={exam.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {exam.subject}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {exam.duration_minutes}m
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {exam.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>

                <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Total Questions</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{exam.question_count || 5} MCQs</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Total Marks</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{exam.total_marks} Marks</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedExamForModal(exam)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Examination
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Attempts & Results History */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Previous Exam Submissions &amp; Scorecards
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {completedAttempts.length} Recorded Attempts
          </span>
        </div>

        {completedAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Exam Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Integrity / Violations</th>
                  <th className="py-3 px-4">Submission</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {completedAttempts.map(att => {
                  const passed = (att.percentage || 0) >= 40;
                  const violations = att.tab_violations_count || 0;

                  return (
                    <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {att.exam_title || `Exam #${att.exam_id}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {att.subject || 'Academics'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {att.score} / {att.total_marks}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {att.percentage}% {passed ? '(Passed)' : '(Failed)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {violations > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            <ShieldAlert className="w-3 h-3" /> {violations} Tab Switches
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Clean Conduct
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-500">
                        {att.submission_type.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onViewResult(att.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors inline-flex items-center gap-1"
                        >
                          View Analysis <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No examinations completed yet. Choose an active exam above to begin!
          </div>
        )}
      </div>

      {/* Pre-Exam Instructions Modal */}
      <InstructionsModal
        exam={selectedExamForModal}
        isOpen={!!selectedExamForModal}
        onClose={() => setSelectedExamForModal(null)}
        onConfirmStart={(examId) => {
          setSelectedExamForModal(null);
          onStartExam(examId);
        }}
      />
    </div>
  );
};
