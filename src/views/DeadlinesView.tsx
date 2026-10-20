import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { DeadlineItem } from '../types/campus';
import { Clock, Calendar, CheckCircle2, AlertCircle, Plus, Filter, Check } from 'lucide-react';
import { AddMilestoneModal } from '../components/AddMilestoneModal';

interface DeadlinesViewProps {
  onOpenSubmitModal: () => void;
  onOpenStudyGuide: () => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({ onOpenSubmitModal, onOpenStudyGuide }) => {
  const { deadlines, toggleDeadline, addDeadline, courses } = useCampus();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeCount = deadlines.filter((d) => !d.completed).length;

  const filtered = deadlines.filter((d) => {
    if (filterType !== 'all' && d.type !== filterType) return false;
    if (filterPriority !== 'all' && d.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold uppercase tracking-wider">
              Academic Crunch Period
            </span>
            <span className="text-[11px] text-[#757682] font-semibold">
              {activeCount} Active Deliverable{activeCount === 1 ? '' : 's'} Remaining
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">Deadlines & Exam Milestones</h1>
          <p className="text-sm text-[#444651] mt-1">
            Chronological academic deliverables, autograder test suites, and exam venue seating information.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#00236f] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Custom Milestone
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-xl border border-[#e2e7ff]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#757682] uppercase tracking-wider mr-1">Type:</span>
          {['all', 'assignment', 'exam', 'lab', 'event', 'personal'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#00236f] text-white'
                  : 'bg-[#f2f3ff] text-[#444651] hover:bg-[#eaedff]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#757682] uppercase tracking-wider mr-1">Priority:</span>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterPriority === p
                  ? 'bg-[#0051d5] text-white'
                  : 'bg-[#f2f3ff] text-[#444651] hover:bg-[#eaedff]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#e2e7ff] text-[#757682] text-xs">
            No milestones found matching the selected filters.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-6 bg-white rounded-xl shadow-xs border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${
                item.completed ? 'border-[#e2e7ff] opacity-60 bg-[#faf8ff]' : 'border-[#e2e7ff] hover:shadow-md'
              }`}
            >
              <div
                className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full"
                style={{ backgroundColor: item.color || '#0051d5' }}
              ></div>

              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleDeadline(item.id)}
                  className="mt-1 w-5 h-5 rounded text-[#0051d5] accent-[#0051d5] cursor-pointer"
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${item.color || '#0051d5'}15`,
                        color: item.color || '#0051d5'
                      }}
                    >
                      {item.courseCode}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        item.completed
                          ? 'bg-[#d1fae5] text-[#047857]'
                          : item.priority === 'high'
                          ? 'text-[#ba1a1a] bg-[#ffdad6]'
                          : 'text-[#92400e] bg-[#fffbeb]'
                      }`}
                    >
                      {item.completed ? 'Completed' : item.dueText}
                    </span>
                    <span className="text-xs font-semibold text-[#444651] bg-[#f2f3ff] px-2 py-0.5 rounded-full uppercase">
                      {item.type}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold ${
                      item.completed ? 'line-through text-[#757682]' : 'text-[#131b2e]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#444651] flex items-center gap-2 flex-wrap">
                    <span>Instructor: {item.instructor}</span>
                    <span>•</span>
                    <span>{item.submissionPortal}</span>
                  </p>
                </div>
              </div>

              {/* Right Status & Actions */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pl-9 md:pl-0">
                {item.progressPercent !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[10px] text-[#757682] uppercase font-bold">{item.sublabel}</p>
                      <p className="text-xs font-bold text-[#131b2e]">{item.progressLabel}</p>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-2 py-1 rounded ${
                        item.progressPercent === 100
                          ? 'text-[#047857] bg-[#d1fae5]'
                          : 'text-[#0051d5] bg-[#dbe1ff]'
                      }`}
                    >
                      {item.progressPercent}%
                    </span>
                  </div>
                )}

                {item.courseCode === 'CS 301' && item.type === 'assignment' && !item.completed && (
                  <button
                    type="button"
                    onClick={onOpenSubmitModal}
                    className="px-4 py-2 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    Submit Now
                  </button>
                )}

                {(item.id === 'deadline-3' || item.type === 'exam') && (
                  <button
                    type="button"
                    onClick={onOpenStudyGuide}
                    className="px-4 py-2 rounded-lg bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd] text-xs font-semibold transition-all cursor-pointer"
                  >
                    Study Guide
                  </button>
                )}

                {!(item.courseCode === 'CS 301' && item.type === 'assignment' && !item.completed) &&
                  item.id !== 'deadline-3' && (
                    <button
                      type="button"
                      onClick={() => toggleDeadline(item.id)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
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
          ))
        )}
      </div>

      {/* Add Custom Milestone Modal */}
      <AddMilestoneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        courses={courses}
        onAdd={addDeadline}
      />
    </div>
  );
};
