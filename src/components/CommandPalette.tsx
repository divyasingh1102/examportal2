import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Clock, FileText, User, ArrowRight } from 'lucide-react';
import { useCampus } from '../context/CampusContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onOpenDeadline?: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { courses, deadlines, notices, facultyList } = useCampus();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCourses = courses.filter(c =>
    c.code.toLowerCase().includes(query.toLowerCase()) ||
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.instructor.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDeadlines = deadlines.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.courseCode.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.sender.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFaculty = facultyList.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#e2e7ff] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#757682]" />
          <input
            type="text"
            placeholder="Search notices, deadlines, course syllabi, faculty... [ESC to exit]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#131b2e] placeholder:text-[#757682] text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#757682] hover:text-[#131b2e]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-xs bg-[#f2f3ff] text-[#444651] rounded font-mono border border-[#dae2fd]">
            ESC
          </kbd>
        </div>

        <div className="p-4 overflow-y-auto divide-y divide-[#f2f3ff] space-y-4">
          {/* Quick Nav Section */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-2">Quick Navigation</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => { onNavigate('overview'); onClose(); }}
                className="p-2 text-left rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#00236f] flex items-center justify-between"
              >
                <span>Overview Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onNavigate('courses'); onClose(); }}
                className="p-2 text-left rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#00236f] flex items-center justify-between"
              >
                <span>Courses & Syllabi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onNavigate('deadlines'); onClose(); }}
                className="p-2 text-left rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#00236f] flex items-center justify-between"
              >
                <span>Deadlines & Exams</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onNavigate('grades'); onClose(); }}
                className="p-2 text-left rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#00236f] flex items-center justify-between"
              >
                <span>Grades & Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onNavigate('campus-notices'); onClose(); }}
                className="p-2 text-left rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#00236f] flex items-center justify-between"
              >
                <span>Campus Notices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onNavigate('faculty-directory'); onClose(); }}
                className="p-2 text-left rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#00236f] flex items-center justify-between"
              >
                <span>Faculty Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0051d5]" />
                Courses & Syllabi ({filteredCourses.length})
              </p>
              <div className="space-y-1.5">
                {filteredCourses.map(course => (
                  <div
                    key={course.code}
                    onClick={() => { onNavigate('courses'); onClose(); }}
                    className="p-2.5 rounded-lg hover:bg-[#f2f3ff] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-[#dbe1ff] text-[#00174b]">
                          {course.code}
                        </span>
                        <span className="text-xs font-semibold text-[#131b2e]">{course.name}</span>
                      </div>
                      <p className="text-[11px] text-[#444651] mt-0.5">{course.instructor} • {course.room}</p>
                    </div>
                    <span className="text-xs font-medium text-[#0051d5]">View Syllabus →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deadlines */}
          {filteredDeadlines.length > 0 && (
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0051d5]" />
                Deadlines & Deliverables ({filteredDeadlines.length})
              </p>
              <div className="space-y-1.5">
                {filteredDeadlines.map(item => (
                  <div
                    key={item.id}
                    onClick={() => { onNavigate('deadlines'); onClose(); }}
                    className="p-2.5 rounded-lg hover:bg-[#f2f3ff] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#131b2e]">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-[#ba1a1a] font-medium mt-0.5">{item.dueText}</p>
                    </div>
                    <span className="text-xs text-[#0051d5] font-semibold">Inspect →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {filteredNotices.length > 0 && (
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0051d5]" />
                Official Notices ({filteredNotices.length})
              </p>
              <div className="space-y-1.5">
                {filteredNotices.map(notice => (
                  <div
                    key={notice.id}
                    onClick={() => { onNavigate('campus-notices'); onClose(); }}
                    className="p-2.5 rounded-lg hover:bg-[#f2f3ff] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#131b2e] line-clamp-1">{notice.title}</span>
                      <p className="text-[11px] text-[#444651] mt-0.5">{notice.sender} • {notice.publishedAgo}</p>
                    </div>
                    <span className="text-xs text-[#0051d5] font-semibold">Read →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faculty */}
          {filteredFaculty.length > 0 && (
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0051d5]" />
                Faculty Members ({filteredFaculty.length})
              </p>
              <div className="space-y-1.5">
                {filteredFaculty.map(fac => (
                  <div
                    key={fac.id}
                    onClick={() => { onNavigate('faculty-directory'); onClose(); }}
                    className="p-2.5 rounded-lg hover:bg-[#f2f3ff] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#131b2e]">{fac.name}</span>
                      <p className="text-[11px] text-[#444651] mt-0.5">{fac.title} • {fac.office}</p>
                    </div>
                    <span className="text-xs text-[#0051d5] font-semibold">Book Hours →</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
