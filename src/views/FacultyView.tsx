import React, { useState } from 'react';
import { mockFacultyList } from '../data/mockData';
import { FacultyMember } from '../types/campus';
import { Mail, MapPin, Clock, BookOpen, Calendar, Search, CheckCircle2 } from 'lucide-react';

export const FacultyView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filtered = mockFacultyList.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.research.some(r => r.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBookHours = (faculty: FacultyMember) => {
    setSelectedFaculty(faculty);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedFaculty(null);
    }, 2500);
  };

  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold uppercase tracking-wider">
              Faculty & Academic Advisors
            </span>
            <span className="text-[11px] text-[#757682] font-semibold">Verified Contact Info</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">Faculty Directory & Office Hours</h1>
          <p className="text-sm text-[#444651] mt-1">
            Connect with course professors, book 1-on-1 office hour slots, and explore department research labs.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#757682] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by professor, research topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] placeholder:text-[#757682] focus:outline-none border border-[#dae2fd]"
          />
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-4 rounded-xl bg-[#d1fae5] border border-[#10b981]/30 flex items-center gap-3 text-xs text-[#047857] animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            Office Hour consultation confirmed with <strong>{selectedFaculty?.name}</strong>! Calendar invitation dispatched to alex.chen@campus.edu.
          </span>
        </div>
      )}

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(faculty => (
          <div
            key={faculty.id}
            className="p-6 bg-white rounded-xl shadow-xs border border-[#e2e7ff] hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#131b2e]">{faculty.name}</h3>
                    <p className="text-xs text-[#0051d5] font-semibold">{faculty.title}</p>
                    <p className="text-[11px] text-[#757682]">{faculty.department}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  faculty.availableToday ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#f2f3ff] text-[#757682]'
                }`}>
                  {faculty.availableToday ? 'Available Today' : 'Office Hours Tomorrow'}
                </span>
              </div>

              {/* Office & Hours */}
              <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#e2e7ff] space-y-1.5 text-xs text-[#444651]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0051d5]" />
                  <span>{faculty.office}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0051d5]" />
                  <span><strong>Office Hours:</strong> {faculty.officeHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#0051d5]" />
                  <a href={`mailto:${faculty.email}`} className="text-[#0051d5] hover:underline font-mono">
                    {faculty.email}
                  </a>
                </div>
              </div>

              {/* Research Interests */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1.5">
                  Research & Focus Areas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {faculty.research.map(r => (
                    <span key={r} className="px-2 py-0.5 rounded-md bg-[#f2f3ff] text-[#444651] text-[11px] border border-[#dae2fd]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Book Office Hours Action */}
            <div className="pt-3 border-t border-[#f2f3ff] flex items-center justify-between">
              <span className="text-[11px] text-[#757682]">
                Courses: {faculty.coursesTaught.join(', ')}
              </span>
              <button
                type="button"
                onClick={() => handleBookHours(faculty)}
                className="px-4 py-2 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Office Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
