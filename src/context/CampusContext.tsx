import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  DeadlineItem,
  NoticeItem,
  Course,
  FacultyMember,
  ScheduleItem
} from '../types/campus';
import {
  mockStudent,
  mockStudentsRegistry,
  mockDeadlines,
  mockNotices,
  mockCourses,
  mockFacultyList,
  mockSchedule
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STUDENTS_STORAGE_KEY = 'campuspulse_students_v1';
const ACTIVE_STUDENT_ID_KEY = 'campuspulse_active_student_id_v1';
const DEADLINES_STORAGE_KEY = 'campuspulse_deadlines_v1';
const NOTICES_STORAGE_KEY = 'campuspulse_notices_v1';
const READ_NOTICES_STORAGE_KEY = 'campuspulse_read_notices_v1';
const WALLET_STORAGE_KEY = 'campuspulse_wallet_v1';
const API_KEY_STORAGE_KEY = 'campuspulse_gemini_api_key_v1';

// Helpers to map Supabase database rows to TypeScript interfaces
function mapRowToDeadline(row: any): DeadlineItem {
  return {
    id: row.id,
    courseCode: row.course_code || row.courseCode || 'CS 301',
    courseName: row.course_name || row.courseName || '',
    title: row.title || 'Untitled Milestone',
    dueDate: row.due_date || row.dueDate || new Date().toISOString(),
    dueText: row.due_text || row.dueText || 'Upcoming',
    priority: row.priority || 'medium',
    type: row.type || 'assignment',
    instructor: row.instructor || '',
    submissionPortal: row.submission_portal || row.submissionPortal || '',
    completed: Boolean(row.completed),
    progressPercent: row.progress_percent ?? row.progressPercent,
    progressLabel: row.progress_label || row.progressLabel,
    sublabel: row.sublabel,
    category: row.category || 'academic',
    color: row.color || '#0051d5'
  };
}

function mapDeadlineToRow(item: DeadlineItem) {
  return {
    id: item.id,
    course_code: item.courseCode,
    course_name: item.courseName,
    title: item.title,
    due_date: item.dueDate,
    due_text: item.dueText,
    priority: item.priority,
    type: item.type,
    instructor: item.instructor,
    submission_portal: item.submissionPortal,
    completed: item.completed,
    progress_percent: item.progressPercent,
    progress_label: item.progressLabel,
    sublabel: item.sublabel,
    category: item.category,
    color: item.color
  };
}

function mapRowToNotice(row: any): NoticeItem {
  return {
    id: row.id,
    sender: row.sender || 'Campus Administration',
    senderShort: row.sender_short || row.senderShort || 'OA',
    verified: Boolean(row.verified ?? true),
    publishedAgo: row.published_ago || row.publishedAgo || 'Recently',
    targetCohort: row.target_cohort || row.targetCohort || 'Campus-Wide',
    badge: row.badge,
    badgeType: row.badge_type || row.badgeType || 'general',
    title: row.title || 'Untitled Notice',
    summary: row.summary || '',
    category: row.category || 'departmental',
    eventMeta: row.event_meta || row.eventMeta,
    attachments: row.attachments,
    externalLink: row.external_link || row.externalLink
  };
}

function mapNoticeToRow(notice: NoticeItem) {
  return {
    id: notice.id,
    sender: notice.sender,
    sender_short: notice.senderShort,
    verified: notice.verified,
    published_ago: notice.publishedAgo,
    target_cohort: notice.targetCohort,
    badge: notice.badge,
    badge_type: notice.badgeType,
    title: notice.title,
    summary: notice.summary,
    category: notice.category,
    event_meta: notice.eventMeta,
    attachments: notice.attachments,
    external_link: notice.externalLink
  };
}

function mapRowToStudent(row: any): StudentProfile {
  return {
    id: row.id || row.student_id || '#984210',
    name: row.name || 'Student',
    year: row.year || 'CS Junior (Yr 3)',
    cohort: row.cohort || 'CS 3rd Year Cohort',
    term: row.term || 'Spring 2025 • Term B',
    avatarUrl: row.avatar_url || row.avatarUrl,
    gpa: Number(row.gpa ?? 3.82),
    cohortRank: row.cohort_rank || row.cohortRank || 'Top 10% CS Cohort',
    activeDeadlinesCount: Number(row.active_deadlines_count ?? 3),
    unreadNoticesCount: Number(row.unread_notices_count ?? 2),
    enrolledCredits: Number(row.enrolled_credits ?? 16),
    cardBalance: Number(row.card_balance ?? 38.50),
    email: row.email || `${(row.name || 'student').toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
    major: row.major || 'Computer Science & Engineering',
    advisor: row.advisor || 'Prof. Marcus Miller',
    academicStatus: row.academic_status || row.academicStatus || 'In Good Standing',
    attendanceRate: row.attendance_rate || row.attendanceRate || '96%',
    completedCredits: Number(row.completed_credits ?? 84),
    totalCredits: Number(row.total_credits ?? 120)
  };
}

function mapStudentToRow(s: StudentProfile) {
  return {
    id: s.id,
    name: s.name,
    year: s.year,
    cohort: s.cohort,
    term: s.term,
    avatar_url: s.avatarUrl,
    gpa: s.gpa,
    cohort_rank: s.cohortRank,
    active_deadlines_count: s.activeDeadlinesCount,
    unread_notices_count: s.unreadNoticesCount,
    enrolled_credits: s.enrolledCredits,
    card_balance: s.cardBalance,
    email: s.email,
    major: s.major,
    advisor: s.advisor,
    academic_status: s.academicStatus,
    attendance_rate: s.attendanceRate,
    completed_credits: s.completedCredits,
    total_credits: s.totalCredits
  };
}

interface CampusContextType {
  student: StudentProfile;
  students: StudentProfile[];
  selectStudent: (id: string) => void;
  addOrUpdateStudent: (profile: StudentProfile) => Promise<boolean>;
  refreshStudents: () => Promise<void>;
  deadlines: DeadlineItem[];
  notices: NoticeItem[];
  courses: Course[];
  facultyList: FacultyMember[];
  schedule: ScheduleItem[];
  readNoticeIds: string[];
  cardBalance: number;
  unreadNoticesCount: number;
  activeDeadlinesCount: number;
  toastMessage: string | null;
  geminiApiKey: string;
  isSupabaseLive: boolean;
  showToast: (message: string) => void;
  setGeminiApiKey: (key: string) => void;
  toggleDeadline: (id: string) => void;
  addDeadline: (deadline: Omit<DeadlineItem, 'id'>) => void;
  submitAssignment: (courseCode: string, commitHash: string, gradeText?: string) => void;
  markNoticeAsRead: (id: string) => void;
  markAllNoticesAsRead: () => void;
  addNotice: (notice: {
    title: string;
    summary: string;
    category: 'all' | 'exams' | 'departmental' | 'workshops' | 'bursar' | 'campus-life';
    sender?: string;
    targetCohort?: string;
    badge?: string;
  }) => void;
  rsvpNoticeEvent: (noticeId: string) => boolean;
  addCardFunds: (amount: number) => void;
  resetAllToDefault: () => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 0. Students Registry with localStorage persistence fallback
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load students from localStorage', e);
    }
    return mockStudentsRegistry;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    try {
      return localStorage.getItem(ACTIVE_STUDENT_ID_KEY) || mockStudent.id;
    } catch {
      return mockStudent.id;
    }
  });

  // 1. Deadlines with localStorage persistence fallback
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    try {
      const saved = localStorage.getItem(DEADLINES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load deadlines from localStorage', e);
    }
    return mockDeadlines;
  });

  // 2. Notices with localStorage persistence fallback
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTICES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load notices from localStorage', e);
    }
    return mockNotices;
  });

  // 3. Read notices tracker
  const [readNoticeIds, setReadNoticeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(READ_NOTICES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load read notices from localStorage', e);
    }
    return [];
  });

  // 4. Wallet card balance
  const [cardBalance, setCardBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      if (saved) return parseFloat(saved);
    } catch (e) {
      console.warn('Failed to load wallet balance from localStorage', e);
    }
    return mockStudent.cardBalance;
  });

  // 5. Gemini API Key
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (envKey && envKey !== 'MY_GEMINI_API_KEY') {
      return envKey;
    }
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  // 6. Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4000);
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key.trim());
    try {
      if (key.trim()) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not save API key to localStorage', e);
    }
  };

  // 7. Supabase live synchronization (if configured in .env.local)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;

    // Load remote students
    supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (!error && data && data.length > 0) {
          setStudents(data.map(mapRowToStudent));
        }
      });

    // Load remote deadlines
    supabase
      .from('deadlines')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (!error && data && data.length > 0) {
          setDeadlines(data.map(mapRowToDeadline));
        }
      });

    // Load remote notices
    supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (!error && data && data.length > 0) {
          setNotices(data.map(mapRowToNotice));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.warn('Failed to save students', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_STUDENT_ID_KEY, activeStudentId);
    } catch (e) {
      console.warn('Failed to save active student ID', e);
    }
  }, [activeStudentId]);

  useEffect(() => {
    try {
      localStorage.setItem(DEADLINES_STORAGE_KEY, JSON.stringify(deadlines));
    } catch (e) {
      console.warn('Failed to save deadlines', e);
    }
  }, [deadlines]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
    } catch (e) {
      console.warn('Failed to save notices', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(READ_NOTICES_STORAGE_KEY, JSON.stringify(readNoticeIds));
    } catch (e) {
      console.warn('Failed to save read notices', e);
    }
  }, [readNoticeIds]);

  useEffect(() => {
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, cardBalance.toString());
    } catch (e) {
      console.warn('Failed to save wallet balance', e);
    }
  }, [cardBalance]);

  // Derived counts
  const unreadNoticesCount = notices.filter((n) => !readNoticeIds.includes(n.id)).length;
  const activeDeadlinesCount = deadlines.filter((d) => !d.completed).length;

  const toggleDeadline = (id: string) => {
    let nextStatus = false;
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          nextStatus = !d.completed;
          showToast(
            nextStatus
              ? `Completed: "${d.title}"`
              : `Marked pending: "${d.title}"`
          );
          return { ...d, completed: nextStatus };
        }
        return d;
      })
    );

    // Sync update to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('deadlines')
        .update({ completed: nextStatus })
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.warn('Supabase deadline update note:', error.message);
          }
        });
    }
  };

  const addDeadline = (newDeadlineData: Omit<DeadlineItem, 'id'>) => {
    const newId = `deadline-${Date.now()}`;
    const item: DeadlineItem = {
      ...newDeadlineData,
      id: newId
    };
    setDeadlines((prev) => [item, ...prev]);
    showToast(`Added new milestone: "${item.title}"`);

    // Sync insert to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('deadlines')
        .insert([mapDeadlineToRow(item)])
        .then(({ error }) => {
          if (error) {
            console.warn('Supabase deadline insert note:', error.message);
          }
        });
    }
  };

  const submitAssignment = (courseCode: string, commitHash: string, gradeText = '20/20 Passed (100%)') => {
    let targetId = '';
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.courseCode === courseCode && d.type === 'assignment' && !d.completed) {
          targetId = d.id;
          return {
            ...d,
            completed: true,
            progressPercent: 100,
            progressLabel: gradeText,
            sublabel: `Commit ${commitHash.slice(0, 7)}`
          };
        }
        return d;
      })
    );

    showToast(`${courseCode} Milestone submitted! Autograder: ${gradeText}`);

    if (targetId && isSupabaseConfigured && supabase) {
      supabase
        .from('deadlines')
        .update({
          completed: true,
          progress_percent: 100,
          progress_label: gradeText,
          sublabel: `Commit ${commitHash.slice(0, 7)}`
        })
        .eq('id', targetId)
        .then(({ error }) => {
          if (error) console.warn('Supabase assignment update note:', error.message);
        });
    }
  };

  const markNoticeAsRead = (id: string) => {
    setReadNoticeIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAllNoticesAsRead = () => {
    setReadNoticeIds(notices.map((n) => n.id));
    showToast('All campus notices marked as read.');
  };

  const addNotice = (newNoticeData: {
    title: string;
    summary: string;
    category: 'all' | 'exams' | 'departmental' | 'workshops' | 'bursar' | 'campus-life';
    sender?: string;
    targetCohort?: string;
    badge?: string;
  }) => {
    const sender = newNoticeData.sender || 'Department of Computer Science & Engineering';
    const initials = sender
      .split(' ')
      .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
      .map((w) => w[0])
      .slice(0, 2)
      .join('');

    const newNotice: NoticeItem = {
      id: `notice-${Date.now()}`,
      title: newNoticeData.title,
      summary: newNoticeData.summary,
      category: newNoticeData.category === 'all' ? 'departmental' : newNoticeData.category,
      sender,
      senderShort: initials || 'DEPT',
      verified: true,
      publishedAgo: 'Just now',
      targetCohort: newNoticeData.targetCohort || 'Target: CS Students & Faculty',
      badge: newNoticeData.badge || 'Faculty Announcement',
      badgeType: 'general'
    };

    setNotices((prev) => [newNotice, ...prev]);
    showToast(`Notice broadcasted: "${newNotice.title}"`);

    // Sync insert to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('notices')
        .insert([mapNoticeToRow(newNotice)])
        .then(({ error }) => {
          if (error) {
            console.warn('Supabase notice insert note:', error.message);
          }
        });
    }
  };

  const rsvpNoticeEvent = (noticeId: string): boolean => {
    let success = false;
    let nextSpots = 0;
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId && n.eventMeta && (n.eventMeta.spotsLeft ?? 0) > 0) {
          success = true;
          nextSpots = (n.eventMeta.spotsLeft ?? 1) - 1;
          return {
            ...n,
            eventMeta: {
              ...n.eventMeta,
              spotsLeft: nextSpots
            }
          };
        }
        return n;
      })
    );

    if (success && isSupabaseConfigured && supabase) {
      // Sync spots update to Supabase
      supabase
        .from('campus_events')
        .update({ spots_left: nextSpots })
        .eq('notice_id', noticeId)
        .then(({ error }) => {
          if (error) console.warn('Supabase event spots update note:', error.message);
        });
    }

    return success;
  };

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0] || mockStudent;

  const selectStudent = (id: string) => {
    setActiveStudentId(id);
    try {
      localStorage.setItem(ACTIVE_STUDENT_ID_KEY, id);
    } catch (e) {
      console.warn('Failed to save active student ID', e);
    }
    const target = students.find((s) => s.id === id);
    if (target) {
      setCardBalance(target.cardBalance);
      showToast(`Switched active profile: ${target.name} (${target.id}) • ${target.major || target.cohort}`);
    }
  };

  const refreshStudents = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase.from('students').select('*').order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        setStudents(data.map(mapRowToStudent));
        showToast('Student registry synchronized with Supabase cloud.');
      }
    } catch (e) {
      console.warn('Failed to refresh students from Supabase', e);
    }
  };

  const addOrUpdateStudent = async (profile: StudentProfile): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const row = mapStudentToRow(profile);
        const { error } = await supabase.from('students').upsert([row]);
        if (error) {
          console.warn('Supabase student upsert note:', error.message);
        } else {
          console.log('Student synced to Supabase cloud!');
        }
      } catch (err) {
        console.warn('Supabase student save error:', err);
      }
    }

    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === profile.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = profile;
        return next;
      }
      return [profile, ...prev];
    });

    showToast(`Student record for ${profile.name} saved successfully.`);
    return true;
  };

  const addCardFunds = (amount: number) => {
    setCardBalance((prev) => {
      const next = prev + amount;
      if (isSupabaseConfigured && supabase) {
        supabase
          .from('students')
          .update({ card_balance: next })
          .eq('id', activeStudent.id)
          .then(({ error }) => {
            if (error) console.warn('Supabase balance sync note:', error.message);
          });
      }
      return next;
    });
    showToast(`$${amount.toFixed(2)} added to Campus Card wallet.`);
  };

  const resetAllToDefault = () => {
    setStudents(mockStudentsRegistry);
    setActiveStudentId(mockStudent.id);
    setDeadlines(mockDeadlines);
    setNotices(mockNotices);
    setReadNoticeIds([]);
    setCardBalance(mockStudent.cardBalance);
    localStorage.removeItem(STUDENTS_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_STUDENT_ID_KEY);
    localStorage.removeItem(DEADLINES_STORAGE_KEY);
    localStorage.removeItem(NOTICES_STORAGE_KEY);
    localStorage.removeItem(READ_NOTICES_STORAGE_KEY);
    localStorage.removeItem(WALLET_STORAGE_KEY);
    showToast('Campus data reset to initial official state.');
  };

  return (
    <CampusContext.Provider
      value={{
        student: {
          ...activeStudent,
          term: 'Spring 2025 • Term B',
          cardBalance,
          activeDeadlinesCount,
          unreadNoticesCount
        },
        students,
        selectStudent,
        addOrUpdateStudent,
        refreshStudents,
        deadlines,
        notices,
        courses: mockCourses,
        facultyList: mockFacultyList,
        schedule: mockSchedule,
        readNoticeIds,
        cardBalance,
        unreadNoticesCount,
        activeDeadlinesCount,
        toastMessage,
        geminiApiKey,
        isSupabaseLive: isSupabaseConfigured,
        showToast,
        setGeminiApiKey,
        toggleDeadline,
        addDeadline,
        submitAssignment,
        markNoticeAsRead,
        markAllNoticesAsRead,
        addNotice,
        rsvpNoticeEvent,
        addCardFunds,
        resetAllToDefault
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
