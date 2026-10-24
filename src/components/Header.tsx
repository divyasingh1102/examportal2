import React, { useState } from 'react';
import { Search, Bot, Bell, ChevronDown, Check, User, Shield, LogOut, Settings, Award } from 'lucide-react';
import { UserRole } from '../types/campus';
import { useCampus } from '../context/CampusContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenPulseAI: () => void;
  unreadCount?: number;
  onOpenNoticeTab?: () => void;
  onOpenStudentRegistry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenSearch,
  onOpenPulseAI,
  onOpenNoticeTab,
  onOpenStudentRegistry
}) => {
  const { notices, unreadNoticesCount, markAllNoticesAsRead, markNoticeAsRead, student, showToast } = useCampus();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-40 bg-[#faf8ff]/95 backdrop-blur-xl border-b border-[#e2e7ff] transition-all">
      <div className="h-20 w-full px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Mobile Logo Brand */}
        <div className="flex items-center gap-2 lg:hidden">
          <img
            src="/campuspulse-logo.svg"
            alt="CampusPulse Logo"
            className="h-7 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/campuspulse-logo.png';
            }}
          />
          <span className="font-bold text-base text-[#00236f] tracking-tight">CampusPulse</span>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div
            onClick={onOpenSearch}
            className="relative w-full cursor-pointer group"
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] text-[20px] group-hover:text-[#0051d5] transition-colors">
              search
            </span>
            <input
              type="text"
              readOnly
              placeholder="Search notices, deadlines, course syllabi, faculty... [Cmd+K]"
              className="w-full pl-10 pr-4 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] rounded-lg text-[#131b2e] placeholder:text-[#757682] text-xs sm:text-sm focus:outline-none cursor-pointer transition-all border border-transparent hover:border-[#dae2fd]"
            />
            <div className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white text-[#757682] rounded border border-[#dae2fd] font-mono shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Role Switcher Pill */}
          <div className="hidden xl:flex items-center bg-[#f2f3ff] p-1 rounded-full border border-[#dae2fd]">
            <button
              type="button"
              onClick={() => onRoleChange('student')}
              className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-white shadow-xs text-[#131b2e]'
                  : 'text-[#444651] hover:text-[#131b2e]'
              }`}
            >
              Student: Alex Chen (CS Yr 3)
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('faculty')}
              className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                currentRole === 'faculty'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:text-[#131b2e]'
              }`}
            >
              Faculty/Admin: Prof. Miller
            </button>
          </div>

          {/* PulseAI Assistant Button */}
          <button
            type="button"
            onClick={onOpenPulseAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dbe1ff] text-[#00174b] hover:bg-[#b4c5ff] transition-all cursor-pointer shadow-2xs group"
          >
            <span className="w-2 h-2 rounded-full bg-[#0051d5] animate-pulse"></span>
            <span className="material-symbols-outlined text-[16px] text-[#0051d5] group-hover:rotate-12 transition-transform">
              smart_toy
            </span>
            <span className="text-xs font-semibold">PulseAI</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNoticesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] flex items-center justify-center rounded-full font-bold leading-none animate-pulse">
                  {unreadNoticesCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e2e7ff] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-[#f2f3ff] border-b border-[#e2e7ff] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#131b2e]">Campus Notices</span>
                    <span className="text-[10px] bg-[#dbe1ff] text-[#00174b] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadNoticesCount} new
                    </span>
                  </div>
                  {unreadNoticesCount > 0 && (
                    <button
                      onClick={markAllNoticesAsRead}
                      className="text-[11px] text-[#0051d5] hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-[#f2f3ff] max-h-72 overflow-y-auto">
                  {notices.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNoticeAsRead(item.id);
                        setShowNotifications(false);
                        onOpenNoticeTab?.();
                      }}
                      className="p-3 hover:bg-[#faf8ff] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#131b2e] line-clamp-1">{item.title}</p>
                        {item.badgeType === 'pinned' && (
                          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0 mt-1"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#757682] mt-0.5">{item.sender} • {item.publishedAgo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-[1px] bg-[#c5c5d3]"></div>

          {/* Profile Menu Trigger */}
          <div className="relative">
            <div
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-[#eaedff] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentRole === 'student' ? 'AC' : 'MM'}
              </div>
              <span className="material-symbols-outlined text-[#757682] text-[18px]">
                expand_more
              </span>
            </div>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e2e7ff] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-[#f2f3ff] border-b border-[#e2e7ff]">
                  <p className="font-bold text-xs text-[#131b2e]">
                    {currentRole === 'student' ? student.name : 'Prof. Marcus Miller'}
                  </p>
                  <p className="text-[11px] text-[#444651]">
                    {currentRole === 'student' ? `ID: ${student.id} • ${student.year}` : 'Dept. of Computer Science'}
                  </p>
                </div>
                <div className="p-2 space-y-1 text-xs">
                  <div
                    onClick={() => {
                      if (onOpenStudentRegistry) {
                        onOpenStudentRegistry();
                      } else {
                        showToast(`Verified Record: ${student.name} • GPA: ${student.gpa.toFixed(2)} (${student.cohortRank})`);
                      }
                      setShowProfileMenu(false);
                    }}
                    className="px-3 py-2 text-[#444651] hover:bg-[#faf8ff] rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#0051d5]" />
                      <span>Academic Profile & Registry</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0051d5] bg-[#e2e7ff] px-1.5 py-0.5 rounded">
                      Supabase
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      showToast('Transcript verified: 84/120 credits completed (Dean\'s List standing)');
                      setShowProfileMenu(false);
                    }}
                    className="px-3 py-2 text-[#444651] hover:bg-[#faf8ff] rounded-lg cursor-pointer flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-[#0051d5]" />
                    <span>Official Transcript Record</span>
                  </div>
                  <div className="border-t border-[#f2f3ff] my-1"></div>
                  <div
                    onClick={() => {
                      onRoleChange(currentRole === 'student' ? 'faculty' : 'student');
                      setShowProfileMenu(false);
                    }}
                    className="px-3 py-2 text-[#0051d5] hover:bg-[#dbe1ff]/30 font-semibold rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <span>Switch to {currentRole === 'student' ? 'Faculty Mode' : 'Student Mode'}</span>
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
