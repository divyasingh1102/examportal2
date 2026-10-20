import React from 'react';

export type ActiveTab =
  | 'overview'
  | 'courses'
  | 'deadlines'
  | 'grades'
  | 'campus-notices'
  | 'faculty-directory'
  | 'library';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  termString?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  termString = 'Spring 2025 • Term B'
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: 'dashboard' },
    { id: 'courses' as ActiveTab, label: 'Courses & Syllabi', icon: 'auto_stories' },
    { id: 'deadlines' as ActiveTab, label: 'Deadlines & Exams', icon: 'event_available' },
    { id: 'grades' as ActiveTab, label: 'Grades & Analytics', icon: 'grade' },
    { id: 'campus-notices' as ActiveTab, label: 'Campus Notices', icon: 'campaign' },
    { id: 'faculty-directory' as ActiveTab, label: 'Faculty Directory', icon: 'badge' },
    { id: 'library' as ActiveTab, label: 'Library & Pods', icon: 'local_library' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between border-r border-[#e2e7ff] transition-all">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center gap-3">
          <img
            alt="CampusPulse Logo"
            className="h-8 w-auto object-contain cursor-pointer"
            onClick={() => onTabChange('overview')}
            src="/campuspulse-logo.svg"
            onError={(e) => {
              // Graceful fallback to local PNG if SVG is blocked
              (e.currentTarget as HTMLImageElement).src = '/campuspulse-logo.png';
            }}
          />
          <span
            onClick={() => onTabChange('overview')}
            className="font-bold text-lg text-[#00236f] tracking-tight cursor-pointer"
          >
            CampusPulse
          </span>
        </div>

        {/* Current Session */}
        <div className="px-4 py-2">
          <div className="bg-[#f2f3ff] rounded-lg p-2.5 flex items-center justify-between mb-4 border border-[#e2e7ff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0051d5] text-[20px]">
                account_circle
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase text-[#757682] tracking-wider">
                  Current Session
                </p>
                <p className="text-xs text-[#131b2e] font-semibold">
                  {termString}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-sm font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'text-[#444651] hover:bg-[#eaedff] hover:text-[#131b2e]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#90a8ff]' : 'text-[#444651]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 flex flex-col gap-2">
        <div className="p-3 rounded-lg bg-[#eaedff] flex items-center justify-between border border-[#dae2fd]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0051d5]"></span>
            <span className="text-xs text-[#131b2e] font-semibold">Academic Registry</span>
          </div>
          <span className="text-[10px] text-[#757682] font-mono">v3.4.1</span>
        </div>
      </div>
    </aside>
  );
};
