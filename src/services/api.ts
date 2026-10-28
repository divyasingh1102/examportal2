import {
  User,
  Exam,
  Question,
  ExamAttempt,
  AttemptAnswer,
  TabViolation,
  AdminStats,
  PerformanceAnalytics
} from '../types/exam';

const API_BASE = '/api';

function getStoredToken(): string | null {
  return localStorage.getItem('exam_portal_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('exam_portal_token', token);
  } else {
    localStorage.removeItem('exam_portal_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err: any) {
    // If server is temporarily unreachable, provide seamless client fallback
    console.warn(`[API] Network notice on ${endpoint}:`, err.message);
    throw err;
  }
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string; role?: string }) =>
    request<{ success: boolean; token: string; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (payload: { name: string; email: string; password: string; student_id?: string }) =>
    request<{ success: boolean; token: string; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () =>
    request<{ success: boolean; user: User }>('/auth/me')
};

// Exam API
export const examApi = {
  getExams: () =>
    request<{ success: boolean; exams: Exam[] }>('/exams'),

  getExamById: (id: number) =>
    request<{ success: boolean; exam: Exam }>(`/exams/${id}`),

  startExam: (examId: number) =>
    request<{
      success: boolean;
      attemptId: number;
      exam: { id: number; title: string; subject: string; duration_minutes: number; total_marks: number; max_violations: number };
      questions: Question[];
      startedAt: string;
    }>(`/exams/${examId}/start`, {
      method: 'POST'
    }),

  recordViolation: (attemptId: number, details?: string) =>
    request<{
      success: boolean;
      violationNumber: number;
      maxViolations: number;
      isTerminated: boolean;
      message: string;
    }>(`/exams/attempts/${attemptId}/violation`, {
      method: 'POST',
      body: JSON.stringify({ details })
    }),

  submitExam: (attemptId: number, payload: { answers: Record<number, number>; submissionType?: string }) =>
    request<{
      success: boolean;
      message: string;
      result: {
        attemptId: number;
        score: number;
        totalMarks: number;
        totalQuestions: number;
        correctAnswers: number;
        percentage: number;
        submissionType: string;
        violationsCount: number;
        passed: boolean;
      };
    }>(`/exams/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getAttemptResult: (attemptId: number) =>
    request<{
      success: boolean;
      attempt: ExamAttempt;
      answers: AttemptAnswer[];
      violations: TabViolation[];
    }>(`/exams/attempts/${attemptId}/result`),

  getStudentAttempts: () =>
    request<{ success: boolean; attempts: ExamAttempt[] }>('/exams/student/my-attempts')
};

// Admin API
export const adminApi = {
  getStats: () =>
    request<{ success: boolean; stats: AdminStats }>('/admin/stats'),

  getAnalytics: () =>
    request<{ success: boolean; analytics: PerformanceAnalytics }>('/admin/analytics'),

  getQuestions: () =>
    request<{ success: boolean; questions: Question[] }>('/admin/questions'),

  createQuestion: (payload: {
    exam_id: number;
    question_text: string;
    category?: string;
    difficulty?: string;
    marks?: number;
    explanation?: string;
    options: { option_text: string; is_correct: boolean }[];
  }) =>
    request<{ success: boolean; message: string; questionId: number }>('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  deleteQuestion: (id: number) =>
    request<{ success: boolean; message: string }>(`/admin/questions/${id}`, {
      method: 'DELETE'
    }),

  createExam: (payload: Partial<Exam>) =>
    request<{ success: boolean; message: string; examId: number }>('/admin/exams', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getAllAttempts: () =>
    request<{ success: boolean; attempts: ExamAttempt[] }>('/admin/attempts')
};
