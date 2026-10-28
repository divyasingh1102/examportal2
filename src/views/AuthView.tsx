import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AuthViewProps {
  onNavigate: (view: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onNavigate }) => {
  const { login, register, isLoading } = useAuth();

  const [mode, setMode] = useState<'student-login' | 'student-register' | 'admin-login'>('student-login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'student-login') {
        await login(email, password, 'student');
        onNavigate('student-dashboard');
      } else if (mode === 'admin-login') {
        await login(email, password, 'admin');
        onNavigate('admin-dashboard');
      } else {
        await register(name, email, password, studentId);
        onNavigate('student-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (type: 'student' | 'admin') => {
    setError(null);
    if (type === 'student') {
      setMode('student-login');
      setEmail('student@examportal.com');
      setPassword('student123');
    } else {
      setMode('admin-login');
      setEmail('admin@examportal.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white items-center justify-center shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'admin-login'
              ? 'Administrator Access'
              : mode === 'student-register'
              ? 'Create Student Account'
              : 'Student Sign In'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'admin-login'
              ? 'Enter verified administrative credentials to manage exams and analytics'
              : 'Sign in to access your scheduled examinations and instant reports'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('student-login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'student-login'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('student-register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'student-register'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin-login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'admin-login'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form Card */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'student-register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Divyansh Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student ID / Roll Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="e.g. STU-2026-042"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@examportal.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-400">Min. 6 chars</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                'Processing...'
              ) : mode === 'student-register' ? (
                <>
                  <UserPlus className="w-4 h-4" /> Register &amp; Access Dashboard
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In Securely
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel (Judge Convenience) */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> One-Click Judge Fill
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors text-left"
              >
                <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                  Demo Student
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  student@examportal.com
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors text-left"
              >
                <div className="text-[11px] font-bold text-violet-700 dark:text-violet-400">
                  Demo Admin
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  admin@examportal.com
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
