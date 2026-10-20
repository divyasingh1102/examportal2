import React, { useState } from 'react';
import { X, Calendar, Clock, AlertCircle, PlusCircle, BookmarkCheck } from 'lucide-react';
import { Course, DeadlineItem } from '../types/campus';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onAdd: (milestone: Omit<DeadlineItem, 'id'>) => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  onClose,
  courses,
  onAdd
}) => {
  const [title, setTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.code || 'CS 301');
  const [type, setType] = useState<'assignment' | 'exam' | 'lab' | 'event' | 'personal'>('assignment');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [submissionPortal, setSubmissionPortal] = useState('');
  const [category, setCategory] = useState<'academic' | 'extracurricular' | 'campus-life'>('academic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCourse = courses.find((c) => c.code === selectedCourse);
    const courseName = matchedCourse ? matchedCourse.name : selectedCourse;
    const instructor = matchedCourse ? matchedCourse.instructor : 'Self / Student Team';
    const color = matchedCourse ? matchedCourse.color : '#0051d5';

    // Format human-friendly due text
    let dueText = 'Upcoming deadline';
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) {
        dueText = `${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }

    onAdd({
      title: title.trim(),
      courseCode: selectedCourse,
      courseName,
      dueDate: dueDate || new Date().toISOString(),
      dueText,
      priority,
      type,
      category,
      instructor,
      submissionPortal: submissionPortal.trim() || 'Student Registry Submission',
      completed: false,
      color
    });

    // Reset and close
    setTitle('');
    setDueDate('');
    setSubmissionPortal('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0051d5] text-white flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">
                Academic Milestone Tracker
              </span>
              <h3 className="font-bold text-base text-[#131b2e]">Add Custom Deliverable</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
              Deliverable Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CS 301 Raft Milestone 3 or Personal Exam Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#faf8ff] border border-[#dae2fd] text-sm text-[#131b2e] focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
                Course or Program
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#faf8ff] border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name.slice(0, 24)}...
                  </option>
                ))}
                <option value="Personal / Study Group">Personal / Study Group</option>
                <option value="Campus Club / Event">Campus Club / Event</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
                Milestone Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#faf8ff] border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none"
              >
                <option value="assignment">Assignment / PSet</option>
                <option value="exam">Midterm / Exam</option>
                <option value="lab">Lab Milestone</option>
                <option value="event">Campus Event / Hackathon</option>
                <option value="personal">Personal Study Milestone</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#faf8ff] border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['high', 'medium', 'low'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`p-2 rounded-xl text-center font-bold capitalize border transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
                          : p === 'medium'
                          ? 'bg-[#fffbeb] text-[#92400e] border-[#b45309]'
                          : 'bg-[#dbe1ff] text-[#00174b] border-[#0051d5]'
                        : 'bg-white text-[#757682] border-[#dae2fd]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
              Submission Platform or Venue Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Gradescope, GitHub Classroom, Turing Arena B4"
              value={submissionPortal}
              onChange={(e) => setSubmissionPortal(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#faf8ff] border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
              Category
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: 'academic', label: 'Academic' },
                { id: 'extracurricular', label: 'Extracurricular' },
                { id: 'campus-life', label: 'Campus Life' }
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    category === c.id
                      ? 'bg-[#00236f] text-white border-[#00236f]'
                      : 'bg-[#f2f3ff] text-[#444651] border-[#dae2fd]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#e2e7ff] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#444651] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0051d5] text-white hover:bg-[#00236f] font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add to Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
