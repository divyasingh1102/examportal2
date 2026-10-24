export type UserRole = 'student' | 'faculty';

export interface StudentProfile {
  name: string;
  id: string;
  year: string;
  cohort: string;
  term: string;
  avatarUrl?: string;
  gpa: number;
  cohortRank: string;
  activeDeadlinesCount: number;
  unreadNoticesCount: number;
  enrolledCredits: number;
  cardBalance: number;
  email?: string;
  major?: string;
  advisor?: string;
  academicStatus?: string;
  attendanceRate?: string;
  completedCredits?: number;
  totalCredits?: number;
}

export interface FacultyProfile {
  name: string;
  id: string;
  title: string;
  department: string;
  office: string;
  email: string;
  activeCourses: string[];
  pendingSubmissionsCount: number;
}

export interface DeadlineItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  dueText: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  type: 'assignment' | 'exam' | 'event' | 'lab' | 'personal';
  instructor: string;
  submissionPortal: string;
  completed: boolean;
  progressPercent?: number;
  progressLabel?: string;
  sublabel?: string;
  category: 'academic' | 'extracurricular' | 'campus-life';
  color: string;
}

export interface NoticeItem {
  id: string;
  sender: string;
  senderShort: string;
  verified: boolean;
  publishedAgo: string;
  targetCohort: string;
  badge?: string;
  badgeType?: 'pinned' | 'speaker' | 'billing' | 'general';
  title: string;
  summary: string;
  category: 'all' | 'exams' | 'departmental' | 'workshops' | 'bursar' | 'campus-life';
  eventMeta?: {
    date: string;
    location: string;
    spotsLeft?: number;
  };
  attachments?: {
    name: string;
    size: string;
    type: 'pdf' | 'xlsx' | 'doc';
    restricted?: boolean;
    url?: string;
  }[];
  externalLink?: {
    text: string;
    url: string;
  };
}

export interface ScheduleItem {
  id: string;
  time: string;
  courseCode: string;
  courseName: string;
  location: string;
  type: 'lecture' | 'recitation' | 'lab' | 'office-hours';
  isOngoing?: boolean;
  until?: string;
  verifiedVia?: string;
}

export interface Course {
  code: string;
  name: string;
  department: string;
  instructor: string;
  instructorEmail: string;
  credits: number;
  room: string;
  schedule: string;
  description: string;
  color: string;
  syllabusUrl?: string;
  gradesWeight: {
    homework: number;
    midterm: number;
    project: number;
    final: number;
  };
  currentGrade?: string;
  currentPercentage?: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  office: string;
  officeHours: string;
  research: string[];
  coursesTaught: string[];
  availableToday: boolean;
}

export interface CampusItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  inStock: boolean;
  badge?: string;
}

export interface ItemOrder {
  id: string;
  buyerName: string;
  buyerId: string;
  buyerEmail: string;
  pickupLocation: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt?: string;
}
