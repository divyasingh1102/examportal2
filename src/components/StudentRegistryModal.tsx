import React, { useState } from 'react';
import {
  X,
  Users,
  Search,
  CheckCircle2,
  GraduationCap,
  Award,
  CreditCard,
  UserCheck,
  PlusCircle,
  RefreshCw,
  Mail,
  BookOpen,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { StudentProfile } from '../types/campus';

interface StudentRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentRegistryModal: React.FC<StudentRegistryModalProps> = ({ isOpen, onClose }) => {
  const {
    students,
    student: activeStudent,
    selectStudent,
    addOrUpdateStudent,
    refreshStudents,
    isSupabaseLive,
    showToast
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'directory' | 'add'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMajor, setNewMajor] = useState('Computer Science & Engineering');
  const [newYear, setNewYear] = useState('CS Junior (Yr 3)');
  const [newCohort, setNewCohort] = useState('CS 3rd Year Cohort');
  const [newGpa, setNewGpa] = useState('3.80');
  const [newCredits, setNewCredits] = useState('16');
  const [newBalance, setNewBalance] = useState('40.00');
  const [newAdvisor, setNewAdvisor] = useState('Prof. Marcus Miller');
  const [newStatus, setNewStatus] = useState("Dean's Honors List (In Good Standing)");

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStudents();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.major && s.major.toLowerCase().includes(q)) ||
      s.cohort.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newId.trim()) {
      showToast('Please enter both student name and ID.');
      return;
    }

    setIsSubmitting(true);

    const formattedId = newId.trim().startsWith('#') ? newId.trim() : `#${newId.trim()}`;
    const newProfile: StudentProfile = {
      id: formattedId,
      name: newName.trim(),
      email: newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      year: newYear,
      cohort: newCohort,
      term: 'Spring 2025 • Term B',
      gpa: parseFloat(newGpa) || 3.75,
      cohortRank: parseFloat(newGpa) >= 3.9 ? 'Top 3% CS Cohort' : 'Top 10% CS Cohort',
      activeDeadlinesCount: 3,
      unreadNoticesCount: 2,
      enrolledCredits: parseInt(newCredits) || 16,
      cardBalance: parseFloat(newBalance) || 35.00,
      major: newMajor.trim(),
      advisor: newAdvisor.trim(),
      academicStatus: newStatus.trim(),
      attendanceRate: '98%',
      completedCredits: 84,
      totalCredits: 120
    };

    await addOrUpdateStudent(newProfile);
    selectStudent(newProfile.id);

    setIsSubmitting(false);
    setActiveTab('directory');
    setNewName('');
    setNewId('');
    setNewEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0051d5] text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">
                  Student Information System
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isSupabaseLive
                      ? 'bg-[#d1fae5] text-[#047857]'
                      : 'bg-[#fef3c7] text-[#92400e]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSupabaseLive ? 'bg-[#10b981] animate-pulse' : 'bg-[#d97706]'
                    }`}
                  ></span>
                  {isSupabaseLive ? 'Supabase Live' : 'Offline Cache'}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#131b2e]">
                CampusPulse Academic Student Registry
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh from Supabase Cloud"
              className="p-1.5 rounded-lg text-[#444651] hover:text-[#0051d5] hover:bg-[#eaedff] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center justify-between border-b border-[#e2e7ff] px-6 bg-white">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'border-[#0051d5] text-[#0051d5]'
                  : 'border-transparent text-[#757682] hover:text-[#131b2e]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Enrolled Students ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'add'
                  ? 'border-[#0051d5] text-[#0051d5]'
                  : 'border-transparent text-[#757682] hover:text-[#131b2e]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Add Student Data
            </button>
          </div>

          {activeTab === 'directory' && (
            <div className="relative my-2 w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#757682]" />
              <input
                type="text"
                placeholder="Search name, ID or major..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#faf8ff] border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
              />
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'directory' ? (
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-[#757682]">
                  <p className="text-sm font-semibold">No student records matching "{searchTerm}".</p>
                  <p className="text-xs mt-1">Try another search keyword or add a new student profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStudents.map((s) => {
                    const isActive = s.id === activeStudent.id;
                    return (
                      <div
                        key={s.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isActive
                            ? 'bg-[#dbe1ff]/20 border-[#0051d5] shadow-xs ring-1 ring-[#0051d5]/30'
                            : 'bg-white border-[#e2e7ff] hover:border-[#dae2fd] hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#e2e7ff] text-[#00236f] flex items-center justify-center font-bold text-sm shrink-0 border border-[#dae2fd]">
                              {s.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-[#131b2e]">{s.name}</h4>
                                {isActive && (
                                  <span className="text-[10px] font-bold bg-[#0051d5] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" />
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#757682] font-mono mt-0.5">
                                ID: {s.id} • {s.year}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-[#0051d5] font-mono">
                              GPA {s.gpa.toFixed(2)}
                            </span>
                            <p className="text-[10px] text-[#047857] font-semibold">{s.cohortRank}</p>
                          </div>
                        </div>

                        {/* Extra Details */}
                        <div className="p-2.5 rounded-lg bg-[#faf8ff] border border-[#f2f3ff] text-xs space-y-1">
                          <div className="flex items-center justify-between text-[#444651]">
                            <span className="text-[11px] text-[#757682]">Major:</span>
                            <span className="font-semibold text-right truncate max-w-[200px]">
                              {s.major || 'Computer Science & Engineering'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[#444651]">
                            <span className="text-[11px] text-[#757682]">Academic Standing:</span>
                            <span className="font-semibold text-[#00236f] text-right truncate max-w-[200px]">
                              {s.academicStatus || "In Good Standing"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[#444651]">
                            <span className="text-[11px] text-[#757682]">Campus Card Balance:</span>
                            <span className="font-mono font-bold text-[#0051d5]">
                              ${(s.cardBalance || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-[#757682] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {s.email || `${s.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`}
                          </span>

                          <button
                            type="button"
                            onClick={() => selectStudent(s.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#dbe1ff] text-[#00236f]'
                                : 'bg-[#0051d5] text-white hover:bg-[#00236f]'
                            }`}
                          >
                            {isActive ? 'Current Session' : 'Switch To Profile'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Add Student Form */
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#dae2fd] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#0051d5] shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-[#00236f]">New Student Enrollment</h4>
                  <p className="text-[11px] text-[#757682]">
                    Register a new student into the CampusPulse Information System. Once submitted, records sync directly to Supabase.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Patel"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    Student Roll # / ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #984215"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    University Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya.patel@campus.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    value={newMajor}
                    onChange={(e) => setNewMajor(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    Current GPA (0.00 - 4.00)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={newGpa}
                    onChange={(e) => setNewGpa(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    Enrolled Credits (Term B)
                  </label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    Campus Card Opening Balance ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                    Academic Advisor
                  </label>
                  <input
                    type="text"
                    value={newAdvisor}
                    onChange={(e) => setNewAdvisor(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                  Academic Standing & Honors
                </label>
                <input
                  type="text"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e2e7ff]">
                <button
                  type="button"
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 text-xs font-semibold text-[#444651] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0051d5] hover:bg-[#00236f] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Saving to Database...' : 'Save & Enroll Student in Supabase'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
