import React from 'react';
import { X, Calendar, Clock, MapPin, Download } from 'lucide-react';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00236f] text-white flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#90a8ff]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">Term B • Enrolled Schedule</span>
              <h3 className="font-bold text-base text-[#131b2e]">Spring 2025 Complete Weekly Timetable</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timetable Matrix */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[700px] border border-[#e2e7ff] rounded-xl overflow-hidden">
            <div className="grid grid-cols-6 bg-[#f2f3ff] border-b border-[#e2e7ff] text-xs font-bold text-[#131b2e]">
              <div className="p-3 text-center border-r border-[#e2e7ff] text-[#757682]">Time</div>
              {days.map((d) => (
                <div key={d} className="p-3 text-center border-r last:border-r-0 border-[#e2e7ff]">
                  {d}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#e2e7ff] text-xs">
              {/* 10:00 - 11:30 AM */}
              <div className="grid grid-cols-6 min-h-[75px]">
                <div className="p-3 bg-[#faf8ff] text-[#757682] font-mono border-r border-[#e2e7ff] flex items-center justify-center text-[11px]">
                  10:00 AM
                </div>
                {/* Mon */}
                <div className="p-2 border-r border-[#e2e7ff] bg-[#dbe1ff]/30">
                  <div className="p-2 rounded-lg bg-[#dbe1ff] border border-[#b4c5ff] text-[#00174b]">
                    <span className="font-bold block">CS 301 Lecture</span>
                    <span className="text-[10px] text-[#264191]">Turing 402</span>
                  </div>
                </div>
                {/* Tue */}
                <div className="p-2 border-r border-[#e2e7ff] bg-[#eaedff]/20">
                  <div className="p-2 rounded-lg bg-[#eaedff] border border-[#dae2fd] text-[#131b2e]">
                    <span className="font-bold block">CS 210 Lecture</span>
                    <span className="text-[10px] text-[#444651]">Lovelace 210</span>
                  </div>
                </div>
                {/* Wed */}
                <div className="p-2 border-r border-[#e2e7ff] bg-[#dbe1ff]/30">
                  <div className="p-2 rounded-lg bg-[#0051d5] text-white">
                    <span className="font-bold block flex items-center justify-between">
                      CS 301 Lecture
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    </span>
                    <span className="text-[10px] text-[#dbe1ff]">Turing 402 • Now</span>
                  </div>
                </div>
                {/* Thu */}
                <div className="p-2 border-r border-[#e2e7ff] bg-[#eaedff]/20">
                  <div className="p-2 rounded-lg bg-[#eaedff] border border-[#dae2fd] text-[#131b2e]">
                    <span className="font-bold block">CS 210 Lecture</span>
                    <span className="text-[10px] text-[#444651]">Lovelace 210</span>
                  </div>
                </div>
                {/* Fri */}
                <div className="p-2">
                  <div className="p-2 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a]">
                    <span className="font-bold block">CS 380 Midterm</span>
                    <span className="text-[10px]">Arena B4 • 10:00 - 12:00</span>
                  </div>
                </div>
              </div>

              {/* 01:30 - 03:00 PM */}
              <div className="grid grid-cols-6 min-h-[75px]">
                <div className="p-3 bg-[#faf8ff] text-[#757682] font-mono border-r border-[#e2e7ff] flex items-center justify-center text-[11px]">
                  01:30 PM
                </div>
                {/* Mon */}
                <div className="p-2 border-r border-[#e2e7ff] bg-[#f2f3ff]">
                  <div className="p-2 rounded-lg bg-[#e2e7ff] text-[#131b2e]">
                    <span className="font-bold block">MATH 240 Lecture</span>
                    <span className="text-[10px] text-[#444651]">Hall C, Gauss</span>
                  </div>
                </div>
                {/* Tue */}
                <div className="p-2 border-r border-[#e2e7ff]">
                  <div className="p-2 rounded-lg bg-[#ffddb8]/40 border border-[#ffb95f] text-[#2a1700]">
                    <span className="font-bold block">CS 380 Lecture</span>
                    <span className="text-[10px]">Hardware Lab 2</span>
                  </div>
                </div>
                {/* Wed */}
                <div className="p-2 border-r border-[#e2e7ff] bg-[#f2f3ff]">
                  <div className="p-2 rounded-lg bg-[#e2e7ff] text-[#131b2e]">
                    <span className="font-bold block">MATH 240 Recitation</span>
                    <span className="text-[10px] text-[#444651]">Hall C • Today 1:30</span>
                  </div>
                </div>
                {/* Thu */}
                <div className="p-2 border-r border-[#e2e7ff]">
                  <div className="p-2 rounded-lg bg-[#ffddb8]/40 border border-[#ffb95f] text-[#2a1700]">
                    <span className="font-bold block">CS 380 Lecture</span>
                    <span className="text-[10px]">Hardware Lab 2</span>
                  </div>
                </div>
                {/* Fri */}
                <div className="p-2 text-center text-[#757682] flex items-center justify-center text-[11px]">
                  -
                </div>
              </div>

              {/* 03:30 - 05:00 PM */}
              <div className="grid grid-cols-6 min-h-[75px]">
                <div className="p-3 bg-[#faf8ff] text-[#757682] font-mono border-r border-[#e2e7ff] flex items-center justify-center text-[11px]">
                  03:30 PM
                </div>
                <div className="p-2 border-r border-[#e2e7ff] text-center text-[#757682] flex items-center justify-center text-[11px]">-</div>
                <div className="p-2 border-r border-[#e2e7ff] text-center text-[#757682] flex items-center justify-center text-[11px]">-</div>
                {/* Wed */}
                <div className="p-2 border-r border-[#e2e7ff] bg-[#dbe1ff]/20">
                  <div className="p-2 rounded-lg bg-[#dbe1ff] border border-[#b4c5ff] text-[#00174b]">
                    <span className="font-bold block">CS 380 AI Lab</span>
                    <span className="text-[10px]">GPU Cluster 04</span>
                  </div>
                </div>
                {/* Thu */}
                <div className="p-2 border-r border-[#e2e7ff]">
                  <div className="p-2 rounded-lg bg-[#f2f3ff] text-[#0051d5]">
                    <span className="font-bold block">Prof. Miller Office Hours</span>
                    <span className="text-[10px] text-[#444651]">Turing 512</span>
                  </div>
                </div>
                <div className="p-2 text-center text-[#757682] flex items-center justify-center text-[11px]">-</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e7ff] flex items-center justify-between bg-[#faf8ff]">
          <span className="text-xs text-[#757682]">16 Enrolled Units • Attendance registered via GeoBeacon</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Calendar synced! All lectures exported to your campus iCal stream.')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#0051d5] text-white hover:bg-[#00236f] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Sync to Google / Apple Calendar (.ics)
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-[#444651] hover:bg-[#eaedff] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
