import React, { useState } from 'react';
import { mockCourses } from '../data/mockData';
import { Course } from '../types/campus';
import { BookOpen, User, MapPin, Clock, FileText, Download, Award, Search, ChevronRight } from 'lucide-react';

interface CoursesViewProps {
  onOpenSubmitModal: () => void;
  onOpenStudyGuide: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ onOpenSubmitModal, onOpenStudyGuide }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(mockCourses[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = mockCourses.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold uppercase tracking-wider">
              Enrolled Term B • Spring 2025
            </span>
            <span className="text-[11px] text-[#757682] font-semibold">16 Credits Enrolled</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">Courses & Syllabi</h1>
          <p className="text-sm text-[#444651] mt-1">
            Access course syllabi, lecture schedules, grade weightings, and instructor office hours.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#757682] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] placeholder:text-[#757682] focus:outline-none border border-[#dae2fd]"
          />
        </div>
      </div>

      {/* Grid: Course List & Course Detail Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (5 cols): Course List Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#757682]">Enrolled Courses ({mockCourses.length})</h2>
          {filteredCourses.map((c) => {
            const isSelected = selectedCourse.code === c.code;
            return (
              <div
                key={c.code}
                onClick={() => setSelectedCourse(c)}
                className={`p-5 rounded-xl border transition-all cursor-pointer bg-white relative ${
                  isSelected
                    ? 'border-[#0051d5] shadow-md ring-2 ring-[#0051d5]/15'
                    : 'border-[#e2e7ff] hover:border-[#dae2fd] shadow-xs'
                }`}
              >
                <div
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                  style={{ backgroundColor: c.color }}
                ></div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${c.color}15`, color: c.color }}
                      >
                        {c.code}
                      </span>
                      <span className="text-[11px] text-[#757682] font-semibold">{c.credits} Credits</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#131b2e] mt-1.5 line-clamp-1">{c.name}</h3>
                    <p className="text-xs text-[#444651] mt-1 flex items-center gap-2">
                      <span>{c.instructor}</span>
                      <span>•</span>
                      <span>{c.room}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#047857] bg-[#d1fae5] px-2 py-0.5 rounded">
                      {c.currentGrade} ({c.currentPercentage}%)
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#f2f3ff] flex items-center justify-between text-xs text-[#757682]">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {c.schedule}
                  </span>
                  <span className="text-[#0051d5] font-semibold flex items-center gap-0.5">
                    View Syllabus <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col (7 cols): Selected Course Deep Syllabus Details */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff] space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#e2e7ff] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: selectedCourse.color }}
                >
                  {selectedCourse.code}
                </span>
                <span className="text-xs text-[#757682] font-semibold">{selectedCourse.department} Department</span>
              </div>
              <h2 className="text-xl font-bold text-[#131b2e] mt-2">{selectedCourse.name}</h2>
              <p className="text-xs text-[#444651] mt-1">Instructor: {selectedCourse.instructor} ({selectedCourse.instructorEmail})</p>
            </div>

            <button
              onClick={() => alert(`Downloading official PDF Syllabus for ${selectedCourse.code}`)}
              className="px-3.5 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#0051d5] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#dae2fd] shrink-0"
            >
              <Download className="w-4 h-4" />
              Syllabus PDF
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#757682] mb-2">Course Overview</h4>
            <p className="text-xs sm:text-sm text-[#444651] leading-relaxed bg-[#faf8ff] p-4 rounded-xl border border-[#e2e7ff]">
              {selectedCourse.description}
            </p>
          </div>

          {/* Schedule & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
              <span className="text-[10px] font-bold uppercase text-[#757682]">Lectures & Labs</span>
              <p className="font-semibold text-xs text-[#131b2e] mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0051d5]" />
                {selectedCourse.schedule}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
              <span className="text-[10px] font-bold uppercase text-[#757682]">Assigned Room</span>
              <p className="font-semibold text-xs text-[#131b2e] mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0051d5]" />
                {selectedCourse.room}
              </p>
            </div>
          </div>

          {/* Grade Weighting Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#757682] mb-3">Grade Assessment Weights</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#e2e7ff] text-center">
                <span className="text-[10px] text-[#757682] font-semibold uppercase">Homework</span>
                <p className="text-lg font-bold text-[#131b2e] mt-1">{selectedCourse.gradesWeight.homework}%</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#e2e7ff] text-center">
                <span className="text-[10px] text-[#757682] font-semibold uppercase">Midterm</span>
                <p className="text-lg font-bold text-[#131b2e] mt-1">{selectedCourse.gradesWeight.midterm}%</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#e2e7ff] text-center">
                <span className="text-[10px] text-[#757682] font-semibold uppercase">Projects/Labs</span>
                <p className="text-lg font-bold text-[#131b2e] mt-1">{selectedCourse.gradesWeight.project}%</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#e2e7ff] text-center">
                <span className="text-[10px] text-[#757682] font-semibold uppercase">Final Exam</span>
                <p className="text-lg font-bold text-[#131b2e] mt-1">{selectedCourse.gradesWeight.final}%</p>
              </div>
            </div>
          </div>

          {/* Quick Actions for this course */}
          <div className="pt-4 border-t border-[#e2e7ff] flex items-center gap-3">
            {selectedCourse.code === 'CS 301' && (
              <button
                onClick={onOpenSubmitModal}
                className="px-4 py-2 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] text-xs font-semibold shadow-xs transition-colors"
              >
                Submit Milestone 2 (Raft)
              </button>
            )}
            {selectedCourse.code === 'CS 380' && (
              <button
                onClick={onOpenStudyGuide}
                className="px-4 py-2 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] text-xs font-semibold shadow-xs transition-colors"
              >
                Open Midterm Study Guide
              </button>
            )}
            <button
              onClick={() => alert(`Contacting ${selectedCourse.instructor} via email`)}
              className="px-4 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold transition-colors border border-[#dae2fd]"
            >
              Email Instructor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
