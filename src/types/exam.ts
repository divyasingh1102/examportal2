export type UserRole = 'student' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  student_id?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface QuestionOption {
  id: number;
  label?: string; // 'A', 'B', 'C', 'D'
  option_text: string;
  is_correct?: boolean;
}

export interface Question {
  id: number;
  exam_id: number;
  number?: number;
  question_text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  explanation?: string;
  options: QuestionOption[];
  exam_title?: string;
}

export interface Exam {
  id: number;
  title: string;
  subject: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  max_violations: number;
  is_active: boolean | number;
  shuffle_questions?: boolean | number;
  shuffle_options?: boolean | number;
  question_count?: number;
  created_at?: string;
}

export type SubmissionType = 'manual' | 'timeout' | 'tab_violation';
export type AttemptStatus = 'in_progress' | 'completed' | 'disqualified';

export interface ExamAttempt {
  id: number;
  user_id: number;
  exam_id: number;
  start_time: string;
  end_time?: string;
  score: number;
  total_marks: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  status: AttemptStatus;
  submission_type: SubmissionType;
  tab_violations_count: number;
  created_at: string;
  exam_title?: string;
  subject?: string;
  user_name?: string;
  student_id?: string;
}

export interface AttemptAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  selected_option_id: number | null;
  is_correct: boolean | number;
  marks_awarded: number;
  question_text?: string;
  explanation?: string;
  category?: string;
  marks?: number;
  options?: QuestionOption[];
  selected_option_text?: string | null;
  correct_option_text?: string | null;
  correct_option_id?: number | null;
}

export interface TabViolation {
  id: number;
  attempt_id: number;
  user_id: number;
  violation_number: number;
  details: string;
  detected_at: string;
}

export interface AdminStats {
  totalExams: number;
  totalStudents: number;
  totalAttempts: number;
  globalAvgScore: number;
  flaggedAttemptsCount: number;
}

export interface QuestionAccuracy {
  questionId: number;
  examId: number;
  questionText: string;
  category: string;
  totalAnswered: number;
  totalCorrect: number;
  accuracyPercentage: number;
}

export interface ExamAverage {
  examId: number;
  title: string;
  subject: string;
  attemptCount: number;
  averageScore: number;
}

export interface PerformanceAnalytics {
  examAverages: ExamAverage[];
  questionAccuracy: QuestionAccuracy[];
  distribution: {
    belowPassing: number;
    average: number;
    distinction: number;
  };
  submissionBreakdown: {
    manual: number;
    timeout: number;
    tabViolation: number;
  };
}
