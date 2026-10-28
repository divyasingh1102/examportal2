import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Sun,
  Moon,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Exam<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" /> Node+MySQL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Smart Examination & Proctoring System
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className={`text-sm font-medium transition-colors ${
              currentView === 'landing'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          
          {user && (
            <button
              onClick={() => onNavigate('student-dashboard')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'student-dashboard'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Exams Catalog
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                currentView === 'admin-dashboard'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Admin Analytics
            </button>
          )}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* User Auth Info or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('student-dashboard');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    Student Dashboard
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('admin-dashboard');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-left"
                    >
                      <BarChart3 className="w-4 h-4 text-indigo-500" />
                      Admin Control Center
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      onNavigate('landing');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('auth')}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('landing');
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home / Overview
          </button>

          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('student-dashboard');
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              My Dashboard
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin-dashboard');
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Admin Analytics & Bank
            </button>
          )}
        </div>
      )}
    </header>
  );
};
