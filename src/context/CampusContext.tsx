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
  mockDeadlines,
  mockNotices,
  mockCourses,
  mockFacultyList,
  mockSchedule
} from '../data/mockData';

const DEADLINES_STORAGE_KEY = 'campuspulse_deadlines_v1';
const NOTICES_STORAGE_KEY = 'campuspulse_notices_v1';
const READ_NOTICES_STORAGE_KEY = 'campuspulse_read_notices_v1';
const WALLET_STORAGE_KEY = 'campuspulse_wallet_v1';
const API_KEY_STORAGE_KEY = 'campuspulse_gemini_api_key_v1';

interface CampusContextType {
  student: StudentProfile;
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
  // 1. Deadlines with localStorage persistence
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    try {
      const saved = localStorage.getItem(DEADLINES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load deadlines from localStorage', e);
    }
    return mockDeadlines;
  });

  // 2. Notices with localStorage persistence
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

  // 5. Gemini API Key (checks environment variable first, then localStorage)
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

  // Sync to localStorage
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
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextCompleted = !d.completed;
          showToast(
            nextCompleted
              ? `Completed: "${d.title}"`
              : `Marked pending: "${d.title}"`
          );
          return { ...d, completed: nextCompleted };
        }
        return d;
      })
    );
  };

  const addDeadline = (newDeadlineData: Omit<DeadlineItem, 'id'>) => {
    const newId = `custom-deadline-${Date.now()}`;
    const item: DeadlineItem = {
      ...newDeadlineData,
      id: newId
    };
    setDeadlines((prev) => [item, ...prev]);
    showToast(`Added new milestone: "${item.title}"`);
  };

  const submitAssignment = (courseCode: string, commitHash: string, gradeText = '20/20 Passed (100%)') => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.courseCode === courseCode && d.type === 'assignment' && !d.completed) {
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
      id: `notice-post-${Date.now()}`,
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
  };

  const rsvpNoticeEvent = (noticeId: string): boolean => {
    let success = false;
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId && n.eventMeta && (n.eventMeta.spotsLeft ?? 0) > 0) {
          success = true;
          return {
            ...n,
            eventMeta: {
              ...n.eventMeta,
              spotsLeft: (n.eventMeta.spotsLeft ?? 1) - 1
            }
          };
        }
        return n;
      })
    );
    return success;
  };

  const addCardFunds = (amount: number) => {
    setCardBalance((prev) => prev + amount);
    showToast(`$${amount.toFixed(2)} added to Campus Card wallet.`);
  };

  const resetAllToDefault = () => {
    setDeadlines(mockDeadlines);
    setNotices(mockNotices);
    setReadNoticeIds([]);
    setCardBalance(mockStudent.cardBalance);
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
          ...mockStudent,
          term: 'Spring 2025 • Term B',
          cardBalance,
          activeDeadlinesCount,
          unreadNoticesCount
        },
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
