import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { Users, FileCheck, CheckCircle2, Clock, Send, Bell, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface FacultyPortalViewProps {
  onSwitchToStudent: () => void;
}

export const FacultyPortalView: React.FC<FacultyPortalViewProps> = ({ onSwitchToStudent }) => {
  const { addNotice, showToast, students } = useCampus();

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeSent, setNoticeSent] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const studentSubmissions = students.map((s, idx) => ({
    id: `sub-${s.id}`,
    name: s.name,
    idNum: s.id,
    commit: ['d4e198a', '8a2b1c4', '5c7e990', '1f44a88', '3b9f1e2'][idx % 5],
    tests: s.gpa >= 3.9 ? '20/20' : s.gpa >= 3.7 ? '18/20' : '16/20',
    status: 'Submitted',
    time: `${(idx + 1) * 12} mins ago`,
    grade: s.gpa >= 3.8 ? 'A (100%)' : 'B+ (88%)'
  }));

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    addNotice({
      title: noticeTitle.trim(),
      summary: noticeBody.trim() || 'Course instruction notice from Prof. Marcus Miller.',
      category: 'departmental',
      sender: 'Prof. Marcus Miller (CS 301 Lead)',
      targetCohort: 'CS 301 Enrolled Students',
      badge: 'Instructor Directive'
    });

    setNoticeSent(true);
    setTimeout(() => {
      setNoticeSent(false);
      setNoticeTitle('');
      setNoticeBody('');
    }, 2500);
  };

  const handleSyncRepos = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Synchronized latest 48 student repositories with Gradescope container v2.4');
    }, 1200);
  };

  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00236f] text-white text-[11px] font-bold uppercase tracking-wider">
              Faculty / Instructor Administration
            </span>
            <span className="text-[11px] text-[#757682] font-semibold">Turing Hall, Room 512</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">Good morning, Prof. Miller 👋</h1>
          <p className="text-sm text-[#444651] mt-1">
            Managing CS 301 (Distributed Systems) & CS 502 (Advanced Cloud Architecture). 48 active students in Turing 402 lecture.
          </p>
        </div>

        <button
          onClick={onSwitchToStudent}
          className="px-4 py-2 rounded-lg bg-[#f2f3ff] text-[#0051d5] hover:bg-[#eaedff] text-xs font-semibold border border-[#dae2fd] transition-colors cursor-pointer"
        >
          ← Return to Student View (Alex Chen)
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-[#0051d5]" />
          </div>
          <p className="text-3xl font-extrabold text-[#131b2e] mt-2">48</p>
          <p className="text-xs text-[#047857] font-semibold mt-1">96% GeoBeacon Attendance Today</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Pending Submissions</span>
            <FileCheck className="w-4 h-4 text-[#b45309]" />
          </div>
          <p className="text-3xl font-extrabold text-[#b45309] mt-2">18</p>
          <p className="text-xs text-[#444651] mt-1">CS 301 Milestone 2 (Raft)</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Office Hours</span>
            <Clock className="w-4 h-4 text-[#0051d5]" />
          </div>
          <p className="text-3xl font-extrabold text-[#131b2e] mt-2">2:00 PM</p>
          <p className="text-xs text-[#0051d5] font-semibold mt-1">4 Students in Queue</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Autograder Status</span>
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-3xl font-extrabold text-[#131b2e] mt-2">Online</p>
          <p className="text-xs text-[#047857] font-semibold mt-1">Gradescope Container v2.4</p>
        </div>
      </div>

      {/* Grid: Submissions Queue & Broadcast Announcement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submissions Queue */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-[#e2e7ff] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">CS 301 Milestone 2: Submission Stream</h2>
              <p className="text-xs text-[#757682]">Automated unit test validation via GitHub Classroom Webhook</p>
            </div>
            <button
              onClick={handleSyncRepos}
              disabled={isSyncing}
              className="text-xs text-[#0051d5] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Repos'}</span>
            </button>
          </div>

          <div className="divide-y divide-[#f2f3ff] text-xs">
            {studentSubmissions.map((sub) => (
              <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#131b2e]">{sub.name}</span>
                    <span className="text-[#757682] font-mono text-[11px]">{sub.idNum}</span>
                    <span className="bg-[#f2f3ff] text-[#444651] px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {sub.commit}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#757682] mt-0.5">Submitted {sub.time}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-[#0051d5]">{sub.tests}</span>
                    <p className="text-[10px] text-[#757682]">Autograder</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      sub.grade.includes('A') ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fffbeb] text-[#b45309]'
                    }`}
                  >
                    {sub.grade}
                  </span>
                  <button
                    onClick={() => showToast(`Inspecting GitHub Classroom commit ${sub.commit} for ${sub.name}`)}
                    className="px-3 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#00236f] rounded font-semibold text-[11px] cursor-pointer"
                  >
                    Review Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Quick Announcement to Course */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#e2e7ff] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0051d5]" />
            <h3 className="font-bold text-sm text-[#131b2e]">Broadcast Course Notice</h3>
          </div>
          <p className="text-xs text-[#757682]">
            Send an instant notification to all 48 enrolled CS 301 students. Broadcasted notices appear in real time on the student registry notice board.
          </p>

          {noticeSent && (
            <div className="p-3 rounded-lg bg-[#d1fae5] text-[#047857] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Notice broadcasted to CS 301 student registry!
            </div>
          )}

          <form onSubmit={handlePostNotice} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Headline</label>
              <input
                type="text"
                placeholder="e.g. Clarification on Leader Election timeout"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#faf8ff] border border-[#dae2fd] text-[#131b2e] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Write message to students..."
                value={noticeBody}
                onChange={(e) => setNoticeBody(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#faf8ff] border border-[#dae2fd] text-[#131b2e] focus:outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              Publish Announcement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
