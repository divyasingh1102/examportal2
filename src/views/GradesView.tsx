import React from 'react';
import { Award, TrendingUp, CheckCircle, BarChart3, BookOpen, AlertCircle, Download } from 'lucide-react';
import { mockCourses } from '../data/mockData';

export const GradesView: React.FC = () => {
  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#047857] text-[11px] font-bold uppercase tracking-wider">
              Dean's Honors List Standing
            </span>
            <span className="text-[11px] text-[#757682] font-semibold">Verified Registry Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">Academic Analytics & Degree Audit</h1>
          <p className="text-sm text-[#444651] mt-1">
            Cumulative GPA, term grading curves, degree credit progression, and honors qualification.
          </p>
        </div>

        <button
          onClick={() => alert('Official Academic Transcript PDF downloaded.')}
          className="px-4 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#00236f] transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Download className="w-4 h-4" />
          Download Official Transcript (.pdf)
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Cumulative GPA</span>
            <TrendingUp className="w-4 h-4 text-[#0051d5]" />
          </div>
          <p className="text-3xl font-extrabold text-[#131b2e] mt-2">3.82</p>
          <p className="text-xs text-[#0051d5] font-semibold mt-1">Top 5% of Junior CS Class</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Term B Projected</span>
            <BarChart3 className="w-4 h-4 text-[#047857]" />
          </div>
          <p className="text-3xl font-extrabold text-[#047857] mt-2">3.91</p>
          <p className="text-xs text-[#444651] mt-1">Based on 4 enrolled courses</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Degree Progression</span>
            <Award className="w-4 h-4 text-[#b45309]" />
          </div>
          <p className="text-3xl font-extrabold text-[#131b2e] mt-2">84 / 120</p>
          <p className="text-xs text-[#b45309] font-semibold mt-1">70% Degree Completed</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs">
          <div className="flex items-center justify-between text-[#757682] text-xs font-bold uppercase">
            <span>Dean's List Status</span>
            <CheckCircle className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-3xl font-extrabold text-[#131b2e] mt-2">Qualified</p>
          <p className="text-xs text-[#047857] font-semibold mt-1">4 Consecutive Terms</p>
        </div>
      </div>

      {/* Main Grid: Course Breakdown & Degree Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (7 cols): Course Grade Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#e2e7ff] shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#131b2e]">Current Term Courses & Running Marks</h2>
            <p className="text-xs text-[#757682]">Live synced with Gradescope, Canvas LMS & department grade books</p>
          </div>

          <div className="space-y-4">
            {mockCourses.map(c => (
              <div key={c.code} className="p-4 rounded-xl bg-[#faf8ff] border border-[#e2e7ff] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-[#131b2e]">{c.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#047857] bg-[#d1fae5] px-2 py-0.5 rounded">
                    {c.currentGrade} ({c.currentPercentage}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${c.currentPercentage}%`,
                      backgroundColor: c.color
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#757682]">
                  <span>Instructor: {c.instructor}</span>
                  <span>4.0 Scale: {c.currentGrade === 'A+' || c.currentGrade === 'A' ? '4.00' : '3.70'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col (5 cols): Degree Audit Tracker */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-[#e2e7ff] shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#131b2e]">B.S. in Computer Science Audit</h2>
            <p className="text-xs text-[#757682]">Catalog Year: 2022-2026 • Expected Graduation: Spring 2026</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#131b2e]">General Education Core</span>
                <span className="text-[#047857] font-bold">24 / 24 Credits (100%)</span>
              </div>
              <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full w-full rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#131b2e]">CS Major Core Requirements</span>
                <span className="text-[#0051d5] font-bold">36 / 45 Credits (80%)</span>
              </div>
              <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0051d5] h-full w-[80%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#131b2e]">CS Upper-Level Electives</span>
                <span className="text-[#444651] font-bold">12 / 24 Credits (50%)</span>
              </div>
              <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#4059aa] h-full w-[50%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#131b2e]">Math & Science Foundations</span>
                <span className="text-[#047857] font-bold">12 / 12 Credits (100%)</span>
              </div>
              <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full w-full rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs text-[#444651] space-y-1">
            <p className="font-bold text-[#131b2e]">Academic Advisor Note:</p>
            <p>
              "Alex is ahead of schedule on CS Core requirements. Recommended for Senior Capstone CS 490 enrollment in Fall 2025."
            </p>
            <p className="text-[11px] text-[#757682] pt-1">— Dr. Sarah Lin (Undergraduate Advisor)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
