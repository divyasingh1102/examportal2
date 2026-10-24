import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { DeadlineItem, NoticeItem } from '../types/campus';

interface OverviewViewProps {
  onNavigate: (view: string) => void;
  onOpenSubmitModal: () => void;
  onOpenStudyGuide: () => void;
  onOpenTimetable: () => void;
  onOpenReservePod: () => void;
  onOpenRsvp: () => void;
  onOpenCampusCard: () => void;
  onOpenDocument: (name: string) => void;
  onAskPulseAI: (question: string) => void;
  cardBalance: number;
  onOpenStore?: () => void;
  onOpenStudentRegistry?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenSubmitModal,
  onOpenStudyGuide,
  onOpenTimetable,
  onOpenReservePod,
  onOpenRsvp,
  onOpenCampusCard,
  onOpenDocument,
  onAskPulseAI,
  cardBalance,
  onOpenStore,
  onOpenStudentRegistry,
}) => {
  const {
    student,
    deadlines,
    notices,
    readNoticeIds,
    schedule,
    toggleDeadline,
    markNoticeAsRead,
    showToast
  } = useCampus();

  const [activeKickerFilter, setActiveKickerFilter] = useState<'all' | 'academic' | 'extracurricular' | 'campus-life'>('all');
  const [noticeSearch, setNoticeSearch] = useState('');
  const [activeNoticeTag, setActiveNoticeTag] = useState<'all' | 'exams' | 'departmental' | 'workshops' | 'bursar'>('all');
  const [pulseInput, setPulseInput] = useState('');

  // Filter deadlines by top kicker
  const filteredDeadlines = deadlines.filter((d) => {
    if (activeKickerFilter === 'all') return true;
    return d.category === activeKickerFilter;
  });

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    const matchesTag =
      activeNoticeTag === 'all' ||
      (activeNoticeTag === 'exams' && n.category === 'exams') ||
      (activeNoticeTag === 'departmental' && (n.category === 'departmental' || n.sender.includes('Computer Science') || n.sender.includes('Faculty') || n.sender.includes('Miller'))) ||
      (activeNoticeTag === 'workshops' && n.category === 'workshops') ||
      (activeNoticeTag === 'bursar' && n.category === 'bursar');

    const q = noticeSearch.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.sender.toLowerCase().includes(q);

    return matchesTag && matchesSearch;
  });

  const handlePulseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pulseInput.trim()) {
      onAskPulseAI(pulseInput.trim());
      setPulseInput('');
    } else {
      onAskPulseAI('Can I submit CS 301 using 1 grace day?');
    }
  };

  const activeDeadlinesCount = deadlines.filter((d) => !d.completed).length;
  const unreadNoticesCount = notices.filter((n) => !readNoticeIds.includes(n.id)).length;

  return (
    <div className="flex flex-col w-full">
      <div className="px-4 sm:px-8 py-8 flex flex-col gap-8 max-w-[1440px] mx-auto w-full">
        {/* 1. Top Section: Student Sync & Metric Strip */}
        <section className="flex flex-col lg:flex-row items-stretch justify-between gap-6 bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff]">
          <div className="flex flex-col justify-between max-w-xl">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#444651] text-[11px] uppercase tracking-wider font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]"></span>
                  {student.term}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#757682] font-semibold">
                  {student.year} • ID: {student.id}
                </span>
                {onOpenStudentRegistry && (
                  <button
                    type="button"
                    onClick={onOpenStudentRegistry}
                    className="text-[11px] font-bold text-[#0051d5] hover:text-[#00236f] bg-[#f2f3ff] hover:bg-[#eaedff] px-2.5 py-0.5 rounded-full transition-all border border-[#dae2fd] cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[14px]">badge</span>
                    Student Registry & Records
                  </button>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight">
                Good morning, {student.name.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-[#444651] leading-relaxed">
                You have {activeDeadlinesCount} pressing deliverable{activeDeadlinesCount === 1 ? '' : 's'} on your timeline, with one ongoing session in Turing Hall.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 pt-6 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveKickerFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeKickerFilter === 'all'
                    ? 'bg-[#00236f] text-white'
                    : 'bg-[#f2f3ff] text-[#444651] hover:text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Overview (All)
              </button>
              <button
                type="button"
                onClick={() => setActiveKickerFilter('academic')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeKickerFilter === 'academic'
                    ? 'bg-[#00236f] text-white font-semibold'
                    : 'bg-[#f2f3ff] text-[#444651] hover:text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Academic ({deadlines.filter((d) => d.category === 'academic').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveKickerFilter('extracurricular')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeKickerFilter === 'extracurricular'
                    ? 'bg-[#00236f] text-white font-semibold'
                    : 'bg-[#f2f3ff] text-[#444651] hover:text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Extracurricular ({deadlines.filter((d) => d.category === 'extracurricular').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveKickerFilter('campus-life')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeKickerFilter === 'campus-life'
                    ? 'bg-[#00236f] text-white font-semibold'
                    : 'bg-[#f2f3ff] text-[#444651] hover:text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Campus Life
              </button>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-[480px] shrink-0">
            {/* GPA */}
            <div
              onClick={() => onNavigate('grades')}
              className="p-4 rounded-xl bg-[#f2f3ff] flex flex-col justify-between cursor-pointer hover:bg-[#eaedff] transition-colors border border-[#e2e7ff]/60"
            >
              <div className="flex items-center justify-between text-[#757682]">
                <span className="text-[11px] uppercase font-bold text-[#444651]">GPA</span>
                <span className="material-symbols-outlined text-[18px] text-[#0051d5]">trending_up</span>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold text-[#131b2e] leading-none tracking-tight">{student.gpa.toFixed(2)}</p>
                <span className="text-[11px] text-[#0051d5] font-semibold">{student.cohortRank}</span>
              </div>
            </div>

            {/* Deadlines */}
            <div
              onClick={() => onNavigate('deadlines')}
              className="p-4 rounded-xl bg-[#f2f3ff] flex flex-col justify-between cursor-pointer hover:bg-[#eaedff] transition-colors border border-[#e2e7ff]/60"
            >
              <div className="flex items-center justify-between text-[#757682]">
                <span className="text-[11px] uppercase font-bold text-[#444651]">Deadlines</span>
                <span className="material-symbols-outlined text-[18px] text-[#5c3800]">crisis_alert</span>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold text-[#131b2e] leading-none tracking-tight">
                  {String(activeDeadlinesCount).padStart(2, '0')}
                </p>
                <span className="text-[11px] text-[#3e2400] font-semibold">Requires Action</span>
              </div>
            </div>

            {/* Unread */}
            <div
              onClick={() => onNavigate('campus-notices')}
              className="p-4 rounded-xl bg-[#f2f3ff] flex flex-col justify-between cursor-pointer hover:bg-[#eaedff] transition-colors border border-[#e2e7ff]/60"
            >
              <div className="flex items-center justify-between text-[#757682]">
                <span className="text-[11px] uppercase font-bold text-[#444651]">Unread</span>
                <span className="material-symbols-outlined text-[18px] text-[#0051d5]">mark_chat_unread</span>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold text-[#131b2e] leading-none tracking-tight">
                  {String(unreadNoticesCount).padStart(2, '0')}
                </p>
                <span className="text-[11px] text-[#0051d5] font-semibold">Official Notices</span>
              </div>
            </div>

            {/* Credits */}
            <div
              onClick={() => onNavigate('courses')}
              className="p-4 rounded-xl bg-[#f2f3ff] flex flex-col justify-between cursor-pointer hover:bg-[#eaedff] transition-colors border border-[#e2e7ff]/60"
            >
              <div className="flex items-center justify-between text-[#757682]">
                <span className="text-[11px] uppercase font-bold text-[#444651]">Credits</span>
                <span className="material-symbols-outlined text-[18px] text-[#444651]">school</span>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold text-[#131b2e] leading-none tracking-tight">{student.enrolledCredits}</p>
                <span className="text-[11px] text-[#757682] font-semibold">Enrolled Term B</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace Grid: Content (8 cols) + Right Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols): Deadlines & Official Notices */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* 2. Priority Hero: Deadlines & Milestones */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-[#e2e7ff] text-[#00236f] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">alarm_on</span>
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e]">Upcoming Deadlines & Deliverables</h2>
                    <p className="text-xs text-[#757682]">Priority items sorted by temporal urgency</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('deadlines')}
                  className="text-xs text-[#0051d5] hover:text-[#00236f] transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                >
                  View All Milestones
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>

              {/* Dynamic Deadlines List */}
              <div className="flex flex-col gap-3">
                {filteredDeadlines.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className={`group relative p-5 bg-white rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
                      item.completed ? 'border-[#e2e7ff] opacity-60 bg-[#faf8ff]' : 'border-[#e2e7ff]'
                    }`}
                  >
                    <div
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                      style={{ backgroundColor: item.color || '#0051d5' }}
                    ></div>

                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleDeadline(item.id)}
                          className="w-5 h-5 rounded text-[#0051d5] bg-white focus:ring-0 cursor-pointer accent-[#0051d5]"
                          id={`task-${item.id}`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${item.color || '#0051d5'}15`,
                              color: item.color || '#0051d5'
                            }}
                          >
                            {item.courseCode}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.completed
                                ? 'bg-[#d1fae5] text-[#047857]'
                                : item.priority === 'high'
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : 'bg-[#e2e7ff] text-[#444651]'
                            }`}
                          >
                            {!item.completed && item.priority === 'high' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                            )}
                            {item.completed ? 'Completed' : item.dueText}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#444651] text-[11px] font-semibold uppercase">
                            {item.priority} Priority
                          </span>
                        </div>

                        <h3
                          className={`text-base font-semibold group-hover:text-[#00236f] transition-colors ${
                            item.completed ? 'line-through text-[#757682]' : 'text-[#131b2e]'
                          }`}
                        >
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#444651] flex items-center gap-3 flex-wrap">
                          <span>{item.instructor}</span>
                          <span className="w-1 h-1 rounded-full bg-[#757682]"></span>
                          <span>Portal: {item.submissionPortal}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pl-9 md:pl-0">
                      {item.progressPercent !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-10 flex items-center justify-center">
                            <span
                              className={`text-[11px] font-bold ${
                                item.progressPercent === 100 ? 'text-[#047857]' : 'text-[#0051d5]'
                              }`}
                            >
                              {item.progressPercent}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] text-[#757682] font-medium">{item.sublabel}</span>
                            <span className="text-[11px] text-[#131b2e] font-semibold">{item.progressLabel}</span>
                          </div>
                        </div>
                      )}

                      {item.courseCode === 'CS 301' && item.type === 'assignment' && !item.completed ? (
                        <button
                          type="button"
                          onClick={onOpenSubmitModal}
                          className="px-4 py-2 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] text-xs font-semibold transition-all shadow-xs cursor-pointer whitespace-nowrap"
                        >
                          Submit Now
                        </button>
                      ) : (item.id === 'deadline-3' || item.type === 'exam') ? (
                        <button
                          type="button"
                          onClick={onOpenStudyGuide}
                          className="px-4 py-2 rounded-lg bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd] text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                        >
                          Study Guide
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleDeadline(item.id)}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            item.completed
                              ? 'border-[#dae2fd] text-[#444651] hover:bg-[#f2f3ff]'
                              : 'border-[#0051d5] text-[#0051d5] hover:bg-[#dbe1ff]/30'
                          }`}
                        >
                          {item.completed ? 'Mark Incomplete' : 'Mark Done'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Official Bulletins Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-[#e2e7ff] text-[#00236f] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">campaign</span>
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e]">Official Campus Bulletins & Notices</h2>
                    <p className="text-xs text-[#757682]">Verified administrative and faculty communiques</p>
                  </div>
                </div>

                <div className="relative w-full md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder="Search notices..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white text-[#131b2e] placeholder:text-[#757682] text-xs focus:outline-none shadow-xs border border-[#e2e7ff]"
                  />
                </div>
              </div>

              {/* Notice Filter Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: `All Notices (${notices.length})` },
                  { id: 'exams', label: 'Exams' },
                  { id: 'departmental', label: 'CS Department' },
                  { id: 'workshops', label: 'Workshops' },
                  { id: 'bursar', label: 'Financial Aid / Bursar' }
                ].map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setActiveNoticeTag(tag.id as any)}
                    className={`px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      activeNoticeTag === tag.id
                        ? 'bg-[#1e3a8a] text-white'
                        : 'bg-white text-[#444651] hover:text-[#131b2e] shadow-xs border border-[#e2e7ff]'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {/* Notice List */}
              <div className="flex flex-col gap-4">
                {filteredNotices.slice(0, 3).map((notice) => {
                  const isUnread = !readNoticeIds.includes(notice.id);

                  return (
                    <article
                      key={notice.id}
                      onClick={() => isUnread && markNoticeAsRead(notice.id)}
                      className={`p-6 bg-white rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col gap-4 border ${
                        isUnread ? 'border-[#0051d5]/40 ring-1 ring-[#0051d5]/20' : 'border-[#e2e7ff]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#00236f] flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {notice.senderShort}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-[#131b2e]">{notice.sender}</span>
                              <span className="material-symbols-outlined text-[16px] text-[#0051d5]" title="Verified Institutional Notice">
                                verified
                              </span>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-[#0051d5] inline-block animate-ping"></span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#757682]">{notice.publishedAgo}</span>
                              <span className="w-1 h-1 rounded-full bg-[#757682]"></span>
                              <span className="text-[11px] font-semibold text-[#0051d5]">{notice.targetCohort}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {notice.badge && (
                            <span className="px-2.5 py-1 rounded-full bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                              {notice.badgeType === 'pinned' && (
                                <span className="material-symbols-outlined text-[14px]">push_pin</span>
                              )}
                              {notice.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pl-0 md:pl-13">
                        <h3 className="text-base sm:text-lg font-bold text-[#131b2e]">{notice.title}</h3>
                        <p className="text-sm text-[#444651] leading-relaxed">{notice.summary}</p>

                        {/* Event Metadata (RSVP) */}
                        {notice.eventMeta && (
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-2 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
                            <div className="flex items-center gap-4 flex-wrap text-xs text-[#444651]">
                              <span className="font-semibold">{notice.eventMeta.date}</span>
                              <span>•</span>
                              <span>{notice.eventMeta.location}</span>
                            </div>
                            {notice.eventMeta.spotsLeft !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-[#5c3800] bg-[#fffbeb] px-2 py-0.5 rounded">
                                  {notice.eventMeta.spotsLeft} spots left
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenRsvp();
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] text-xs font-semibold shadow-xs cursor-pointer"
                                >
                                  RSVP Ticket
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Attached Documents */}
                        {notice.attachments && notice.attachments.length > 0 && (
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            {notice.attachments.map((att) => (
                              <div
                                key={att.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDocument(att.name);
                                }}
                                className="inline-flex items-center gap-3 p-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors cursor-pointer group border border-[#dae2fd]"
                              >
                                <div className="p-2 rounded bg-white text-[#ba1a1a] group-hover:scale-105 transition-transform shadow-2xs">
                                  <span className="material-symbols-outlined text-[20px]">
                                    {att.type === 'pdf' ? 'picture_as_pdf' : 'table_chart'}
                                  </span>
                                </div>
                                <div className="flex flex-col pr-2">
                                  <span className="text-xs font-semibold text-[#131b2e]">{att.name}</span>
                                  <span className="text-[11px] text-[#757682]">{att.size}</span>
                                </div>
                                <span className="material-symbols-outlined text-[#757682] text-[18px]">download</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (4 Cols): Widgets, Live Timetable & Quick Actions */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Widget 1: Today's Classes & Live Indicator */}
            <div className="p-6 bg-white rounded-xl shadow-xs flex flex-col gap-4 border border-[#e2e7ff]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0051d5] text-[20px]">today</span>
                  <h3 className="text-sm font-bold text-[#131b2e]">Today's Schedule</h3>
                </div>
                <span className="text-[11px] text-[#757682] font-semibold uppercase">Wednesday</span>
              </div>

              {/* Schedule List */}
              <div className="flex flex-col gap-3">
                {/* Ongoing Class */}
                <div className="p-4 rounded-xl bg-[#dbe1ff]/50 flex flex-col gap-2 relative overflow-hidden border border-[#b4c5ff]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0051d5] text-white text-[11px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Ongoing Now
                    </span>
                    <span className="text-[11px] font-bold text-[#00174b]">Until 11:30 AM</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#00174b]">CS 301: Distributed Systems</h4>
                    <p className="text-xs text-[#003ea8]">Lecture • Room 402, Turing Hall</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#003ea8]">Attendance verified via GeoBeacon</span>
                    <span className="material-symbols-outlined text-[#0051d5] text-[18px]">verified</span>
                  </div>
                </div>

                {/* Upcoming Classes */}
                {schedule.slice(1).map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-start justify-between gap-3 border border-[#e2e7ff]">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#757682] font-semibold">{s.time}</span>
                      <h4 className="text-xs font-bold text-[#131b2e]">{s.courseCode}: {s.courseName}</h4>
                      <p className="text-xs text-[#444651]">{s.location}</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-white text-[#757682] shadow-2xs">
                      <span className="material-symbols-outlined text-[18px]">near_me</span>
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onOpenTimetable}
                className="w-full py-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#dae2fd]"
              >
                <span className="material-symbols-outlined text-[18px]">event</span>
                Open Complete Timetable
              </button>
            </div>

            {/* Widget 2: AI Student Assistant Floating Trigger Card */}
            <div className="p-6 rounded-xl bg-[#00236f] text-white shadow-md flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/10 text-white">
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#dce1ff]">
                    PulseAI Assistant
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="text-base font-bold text-white">Need academic assistance?</h4>
                <p className="text-xs text-[#b6c4ff] leading-relaxed">
                  Ask about textbook reserves, professor office hours, late slip penalties, or exam clash clearance policies.
                </p>
              </div>
              <form onSubmit={handlePulseSubmit} className="relative w-full">
                <input
                  type="text"
                  value={pulseInput}
                  onChange={(e) => setPulseInput(e.target.value)}
                  placeholder="e.g. Can I submit CS 301 using 1 grace day?"
                  className="w-full pl-3 pr-9 py-2 rounded-lg bg-white/15 text-white placeholder:text-[#b6c4ff] text-xs focus:outline-none focus:bg-white/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-white hover:text-[#dce1ff] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>

            {/* Widget 3: Quick Portals & Bookmarked Links */}
            <div className="p-6 bg-white rounded-xl shadow-xs flex flex-col gap-4 border border-[#e2e7ff]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#131b2e]">Academic Portals</h3>
                <span className="material-symbols-outlined text-[#757682] text-[18px]">star</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => showToast('Single Sign-On verified: Launching Canvas LMS Dashboard')}
                  className="p-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#dae2fd]/50"
                >
                  <span className="material-symbols-outlined text-[#0051d5] text-[22px]">laptop_chromebook</span>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e]">Canvas LMS</p>
                    <p className="text-[11px] text-[#757682]">Modules & Quizzes</p>
                  </div>
                </div>

                <div
                  onClick={() => onNavigate('grades')}
                  className="p-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#dae2fd]/50"
                >
                  <span className="material-symbols-outlined text-[#0051d5] text-[22px]">analytics</span>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e]">Degree Audit</p>
                    <p className="text-[11px] text-[#757682]">84/120 Credits</p>
                  </div>
                </div>

                <div
                  onClick={onOpenReservePod}
                  className="p-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#dae2fd]/50"
                >
                  <span className="material-symbols-outlined text-[#0051d5] text-[22px]">meeting_room</span>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e]">Room Booking</p>
                    <p className="text-[11px] text-[#757682]">Study Cubicles</p>
                  </div>
                </div>

                <div
                  onClick={onOpenCampusCard}
                  className="p-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#dae2fd]/50 group"
                >
                  <span className="material-symbols-outlined text-[#0051d5] text-[22px]">account_balance_wallet</span>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e] group-hover:text-[#0051d5] transition-colors">Campus Card</p>
                    <p className="text-[11px] text-[#0051d5] font-semibold font-mono">${cardBalance.toFixed(2)} Bal</p>
                  </div>
                </div>

                <div
                  onClick={() => onOpenStore && onOpenStore()}
                  className="p-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#dae2fd]/50 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#0051d5] text-[22px]">shopping_bag</span>
                    <span className="text-[10px] font-bold bg-[#dbe1ff] text-[#00236f] px-2 py-0.5 rounded-full">Store</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e] group-hover:text-[#0051d5] transition-colors">Campus Store</p>
                    <p className="text-[11px] text-[#757682]">Order materials & kits</p>
                  </div>
                </div>

                <div
                  onClick={() => onOpenStudentRegistry && onOpenStudentRegistry()}
                  className="p-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#dae2fd]/50 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#0051d5] text-[22px]">badge</span>
                    <span className="text-[10px] font-bold bg-[#d1fae5] text-[#047857] px-2 py-0.5 rounded-full">Registry</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e] group-hover:text-[#0051d5] transition-colors">Student Registry</p>
                    <p className="text-[11px] text-[#757682]">View & add student data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 4: Campus Life Spotlight Card */}
            <div className="rounded-xl overflow-hidden shadow-xs bg-white flex flex-col border border-[#e2e7ff]">
              <div
                className="bg-cover bg-center w-full h-36 relative"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJFO2eQ68QhjjCQSqshJbTu4RJhKaLXYv6Bu3NQTzwBqmN0ywBWE4boFfqzgB4BMjnB6Pa3cNT04KaEYUjcb7-uOofimWWBmVPwp8yIycRVkS3-bp4OM6z9bJxd7xBDydKLLIRbdquzpXOe-WVDa1G3RESE5drzRcnmOZaUAowNO3Xm_d_g5p_H7J1DS35ZQox2Ru6ZkqdMAG5IBRRClVgqXdxsPKJNlsDEZ2eLGk69xyZO9pqQb4w')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#283044]/80 to-transparent flex items-end p-4">
                  <span className="text-white text-[11px] uppercase tracking-wider font-semibold bg-[#00236f]/70 backdrop-blur-xs px-2 py-0.5 rounded">
                    Library Status
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#131b2e]">Main Library Turing Wing</h4>
                  <span className="text-[11px] text-[#0051d5] font-bold">Open 24/7</span>
                </div>
                <p className="text-xs text-[#444651] leading-relaxed">
                  Floor 3 Silent Zone currently at 42% capacity. 14 private focus pods available.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#757682] font-medium">Free print quota: 120 pages left</span>
                  <button
                    onClick={onOpenReservePod}
                    className="text-xs font-bold text-[#0051d5] hover:underline cursor-pointer"
                  >
                    Reserve Pod
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
