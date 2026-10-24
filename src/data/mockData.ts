import {
  StudentProfile,
  FacultyProfile,
  DeadlineItem,
  NoticeItem,
  ScheduleItem,
  Course,
  FacultyMember
} from '../types/campus';

export const mockStudent: StudentProfile = {
  name: 'Alex Chen',
  id: '#984210',
  year: 'CS Junior (Yr 3)',
  cohort: 'CS 3rd Year Cohort',
  term: 'Spring 2025 • Term B',
  gpa: 3.82,
  cohortRank: 'Top 5% CS Cohort',
  activeDeadlinesCount: 3,
  unreadNoticesCount: 2,
  enrolledCredits: 16,
  cardBalance: 38.50,
  email: 'alex.chen@campus.edu',
  major: 'Computer Science & Engineering',
  advisor: 'Prof. Marcus Miller',
  academicStatus: 'Dean\'s Honors List (In Good Standing)',
  attendanceRate: '98%',
  completedCredits: 84,
  totalCredits: 120
};

export const mockStudentsRegistry: StudentProfile[] = [
  mockStudent,
  {
    name: 'Maya Patel',
    id: '#984211',
    year: 'CS Junior (Yr 3)',
    cohort: 'CS 3rd Year Cohort',
    term: 'Spring 2025 • Term B',
    gpa: 3.91,
    cohortRank: 'Top 2% CS Cohort',
    activeDeadlinesCount: 2,
    unreadNoticesCount: 1,
    enrolledCredits: 18,
    cardBalance: 52.00,
    email: 'maya.patel@campus.edu',
    major: 'Computer Systems & Cyber-Physical AI',
    advisor: 'Prof. Elena Rostova',
    academicStatus: 'President\'s Scholar (Highest Honors)',
    attendanceRate: '100%',
    completedCredits: 88,
    totalCredits: 120
  },
  {
    name: 'Liam O\'Connor',
    id: '#984212',
    year: 'CS Junior (Yr 3)',
    cohort: 'CS 3rd Year Cohort',
    term: 'Spring 2025 • Term B',
    gpa: 3.65,
    cohortRank: 'Top 15% CS Cohort',
    activeDeadlinesCount: 4,
    unreadNoticesCount: 3,
    enrolledCredits: 15,
    cardBalance: 14.25,
    email: 'l.oconnor@campus.edu',
    major: 'Distributed Cloud Architecture',
    advisor: 'Prof. Marcus Miller',
    academicStatus: 'In Good Standing',
    attendanceRate: '94%',
    completedCredits: 78,
    totalCredits: 120
  },
  {
    name: 'Sophia Zhang',
    id: '#984213',
    year: 'CS Junior (Yr 3)',
    cohort: 'CS 3rd Year Cohort',
    term: 'Spring 2025 • Term B',
    gpa: 3.98,
    cohortRank: 'Rank #1 in Class (Valedictorian Track)',
    activeDeadlinesCount: 1,
    unreadNoticesCount: 0,
    enrolledCredits: 20,
    cardBalance: 110.00,
    email: 'sophia.zhang@campus.edu',
    major: 'Theoretical Computer Science & Cryptography',
    advisor: 'Prof. Kenneth Vance',
    academicStatus: 'Turing Research Fellow (Summa Cum Laude)',
    attendanceRate: '99%',
    completedCredits: 92,
    totalCredits: 120
  },
  {
    name: 'David Kim',
    id: '#984214',
    year: 'CS Junior (Yr 3)',
    cohort: 'CS 3rd Year Cohort',
    term: 'Spring 2025 • Term B',
    gpa: 3.74,
    cohortRank: 'Top 10% CS Cohort',
    activeDeadlinesCount: 3,
    unreadNoticesCount: 1,
    enrolledCredits: 16,
    cardBalance: 45.00,
    email: 'david.kim@campus.edu',
    major: 'Machine Learning & High-Compute Systems',
    advisor: 'Prof. Kenneth Vance',
    academicStatus: 'Dean\'s Honors List',
    attendanceRate: '96%',
    completedCredits: 82,
    totalCredits: 120
  }
];

export const mockFaculty: FacultyProfile = {
  name: 'Prof. Marcus Miller',
  id: '#FAC-4019',
  title: 'Associate Professor of Computer Systems',
  department: 'Department of Computer Science & Engineering',
  office: 'Turing Hall, Room 512',
  email: 'm.miller@campus.edu',
  activeCourses: ['CS 301: Distributed Systems', 'CS 502: Advanced Cloud Arch'],
  pendingSubmissionsCount: 48,
};

export const mockDeadlines: DeadlineItem[] = [
  {
    id: 'deadline-1',
    courseCode: 'CS 301',
    courseName: 'Distributed Systems',
    title: 'Distributed Systems: Raft Consensus Implementation (Milestone 2)',
    dueText: 'Due in 6 hrs • 11:59 PM',
    dueDate: '2025-03-18T23:59:00',
    priority: 'high',
    type: 'assignment',
    instructor: 'Prof. Marcus Miller',
    submissionPortal: 'GitHub Classroom / Gradescope',
    completed: false,
    progressPercent: 80,
    progressLabel: '16/20 Passed',
    sublabel: 'Test Suite',
    category: 'academic',
    color: '#0051d5'
  },
  {
    id: 'deadline-2',
    courseCode: 'MATH 240',
    courseName: 'Probability & Stochastic Processes',
    title: 'Probability & Stochastic Processes: Problem Set 4',
    dueText: 'Tomorrow • 5:00 PM',
    dueDate: '2025-03-19T17:00:00',
    priority: 'medium',
    type: 'assignment',
    instructor: 'Prof. Elena Rostova',
    submissionPortal: 'Handwritten PDF or LaTeX',
    completed: false,
    progressPercent: 15,
    progressLabel: '1/6 Solved',
    sublabel: 'Problems',
    category: 'academic',
    color: '#4059aa'
  },
  {
    id: 'deadline-3',
    courseCode: 'CS 380',
    courseName: 'Search Algorithms & Deep RL',
    title: 'Midterm Examination: Search Algorithms & Deep RL',
    dueText: 'Friday • 10:00 AM - 12:00 PM',
    dueDate: '2025-03-21T10:00:00',
    priority: 'high',
    type: 'exam',
    instructor: 'Prof. Kenneth Vance',
    submissionPortal: 'Turing Hall Exam Arena B4 • Closed Book (1-page formula sheet allowed)',
    completed: false,
    category: 'academic',
    color: '#5c3800'
  },
  {
    id: 'deadline-4',
    courseCode: 'Campus Hack',
    courseName: 'Campus Hackathon',
    title: 'IEEE Annual 48h Spring Hackathon Team Registration',
    dueText: 'Sunday • 11:59 PM',
    dueDate: '2025-03-23T23:59:00',
    priority: 'medium',
    type: 'event',
    instructor: 'IEEE Student Branch',
    submissionPortal: 'Engineering Atrium • Team Status: 3/4 Members Locked',
    completed: false,
    category: 'extracurricular',
    color: '#316bf3'
  },
  {
    id: 'deadline-5',
    courseCode: 'CS 301',
    courseName: 'Distributed Systems',
    title: 'Lab 3: Paxos vs Raft Benchmark Report',
    dueText: 'Next Tuesday • 11:59 PM',
    dueDate: '2025-03-25T23:59:00',
    priority: 'low',
    type: 'lab',
    instructor: 'Prof. Marcus Miller',
    submissionPortal: 'Canvas LMS Submission',
    completed: false,
    progressPercent: 40,
    progressLabel: 'Draft saved',
    sublabel: 'Benchmarking',
    category: 'academic',
    color: '#0051d5'
  },
  {
    id: 'deadline-6',
    courseCode: 'ACM Club',
    courseName: 'Competitive Programming',
    title: 'ICPC Regional Warm-up Qualifiers',
    dueText: 'Next Saturday • 2:00 PM',
    dueDate: '2025-03-29T14:00:00',
    priority: 'low',
    type: 'event',
    instructor: 'ACM Student Chapter',
    submissionPortal: 'Codeforces Gym Private Arena',
    completed: false,
    category: 'extracurricular',
    color: '#00236f'
  }
];

export const mockNotices: NoticeItem[] = [
  {
    id: 'notice-1',
    sender: 'Office of the Dean of Academic Affairs',
    senderShort: 'OA',
    verified: true,
    publishedAgo: 'Published 2 hours ago',
    targetCohort: 'Target: CS 3rd Year Cohort',
    badge: 'Pinned Notice',
    badgeType: 'pinned',
    title: 'Spring 2025 Midterm Examination Timetable & Seating Configuration (Round 1)',
    summary: 'The comprehensive seating layout and invigilator rosters for the upcoming Spring Midterm assessments spanning March 17 to March 24 have been ratified. Computer Science junior examinees are required to present physical student credentials 15 minutes before the scheduled commencement.',
    category: 'exams',
    attachments: [
      {
        name: 'CS_Junior_Midterms_RoomAllotment_v2.pdf',
        size: '1.4 MB • Updated Today, 08:30 AM',
        type: 'pdf',
        restricted: false,
      },
      {
        name: 'Special Accommodations Roster.xlsx',
        size: '420 KB • Restricted',
        type: 'xlsx',
        restricted: true,
      }
    ]
  },
  {
    id: 'notice-2',
    sender: 'Department of Computer Science & Engineering',
    senderShort: 'CS',
    verified: true,
    publishedAgo: 'Yesterday at 3:15 PM',
    targetCohort: 'Target: All CS Majors & Faculty',
    badge: 'Distinguished Speaker',
    badgeType: 'speaker',
    title: 'Industry Keynote: Designing Distributed Fault-Tolerant Architectures at Planetary Scale',
    summary: 'Join us for a specialized technical session with Marcus Vance, Principal Solutions Architect at AWS Cloud Infrastructure. Topics include multi-region failover, consensus bottlenecks, and practical observability in Kubernetes clusters.',
    category: 'workshops',
    eventMeta: {
      date: 'Thursday, March 20 • 4:00 PM',
      location: 'Ada Lovelace Auditorium (Room 101)',
      spotsLeft: 42
    }
  },
  {
    id: 'notice-3',
    sender: 'Bursar & Financial Operations',
    senderShort: 'BF',
    verified: true,
    publishedAgo: '3 days ago',
    targetCohort: 'Campus-Wide',
    badge: 'Billing',
    badgeType: 'billing',
    title: 'Spring Term Installment #2 Due Date & Extended In-Person Cashier Desk Hours',
    summary: 'The secondary tuition billing installment for enrolled undergraduate and graduate scholars is scheduled for clearing on Friday, March 28. Students with pending department scholarships or teaching assistant stipends should confirm waivers through the Student Accounts Portal.',
    category: 'bursar',
    externalLink: {
      text: 'Open Student Account Gateway',
      url: '#'
    }
  },
  {
    id: 'notice-4',
    sender: 'Campus Career & Industry Relations',
    senderShort: 'CC',
    verified: true,
    publishedAgo: '4 days ago',
    targetCohort: 'Target: Juniors & Seniors',
    badge: 'Recruiting',
    badgeType: 'general',
    title: 'Summer 2025 Tech Internship On-Campus Interviews: Google, Stripe, Datadog',
    summary: 'Recruiter slots for software engineering and cloud infrastructure internships have opened on Handshake. Pre-screened candidates must submit updated resumes and GitHub profiles by Monday midnight.',
    category: 'departmental',
    eventMeta: {
      date: 'Monday, March 24 • 9:00 AM - 5:00 PM',
      location: 'Student Union, Multi-purpose Room B',
      spotsLeft: 18
    }
  },
  {
    id: 'notice-5',
    sender: 'University Library System',
    senderShort: 'UL',
    verified: true,
    publishedAgo: '5 days ago',
    targetCohort: 'All Enrolled Students',
    badge: 'Facility Update',
    badgeType: 'general',
    title: 'Turing Wing Extended 24/7 Hours & High-Performance Compute Stations',
    summary: 'In preparation for midterms, the 3rd floor quiet zone now features 14 dual-monitor GPU development pods accessible via student ID tap. Coffee stations will operate until 2:00 AM on weekdays.',
    category: 'campus-life',
    externalLink: {
      text: 'View Pod Availability',
      url: '#'
    }
  }
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: 'sched-1',
    time: '10:00 AM - 11:30 AM',
    courseCode: 'CS 301',
    courseName: 'Distributed Systems',
    location: 'Lecture • Room 402, Turing Hall',
    type: 'lecture',
    isOngoing: true,
    until: '11:30 AM',
    verifiedVia: 'GeoBeacon'
  },
  {
    id: 'sched-2',
    time: '1:30 PM - 3:00 PM',
    courseCode: 'MATH 240',
    courseName: 'Probability',
    location: 'Recitation Session • Hall C',
    type: 'recitation'
  },
  {
    id: 'sched-3',
    time: '3:30 PM - 5:00 PM',
    courseCode: 'CS 380',
    courseName: 'AI Lab Section',
    location: 'Hardware Lab 2 • GPU Cluster 04',
    type: 'lab'
  }
];

export const mockCourses: Course[] = [
  {
    code: 'CS 301',
    name: 'Distributed Systems & Cloud Infrastructure',
    department: 'Computer Science',
    instructor: 'Prof. Marcus Miller',
    instructorEmail: 'm.miller@campus.edu',
    credits: 4,
    room: 'Room 402, Turing Hall',
    schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
    description: 'Principles and paradigms of distributed computing systems, focusing on consensus algorithms (Paxos, Raft), RPC frameworks, fault tolerance, replication, and distributed transactions.',
    color: '#0051d5',
    gradesWeight: {
      homework: 25,
      midterm: 25,
      project: 30,
      final: 20
    },
    currentGrade: 'A',
    currentPercentage: 94.2
  },
  {
    code: 'MATH 240',
    name: 'Probability & Stochastic Processes',
    department: 'Mathematics',
    instructor: 'Prof. Elena Rostova',
    instructorEmail: 'e.rostova@campus.edu',
    credits: 4,
    room: 'Hall C, Gauss Building',
    schedule: 'Mon, Wed 1:30 PM - 3:00 PM',
    description: 'Axiomatic probability, random variables, joint distributions, Markov chains, Poisson processes, and introduction to Brownian motion with computational simulation in Python.',
    color: '#4059aa',
    gradesWeight: {
      homework: 30,
      midterm: 30,
      project: 0,
      final: 40
    },
    currentGrade: 'A-',
    currentPercentage: 91.5
  },
  {
    code: 'CS 380',
    name: 'Search Algorithms & Deep Reinforcement Learning',
    department: 'Computer Science',
    instructor: 'Prof. Kenneth Vance',
    instructorEmail: 'k.vance@campus.edu',
    credits: 4,
    room: 'Hardware Lab 2 & Arena B4',
    schedule: 'Tue, Thu 2:00 PM - 3:30 PM, Fri Lab 3:30 PM',
    description: 'State space search, adversarial game search, Markov Decision Processes, Q-learning, deep Q-networks (DQN), actor-critic architectures, and model-free policy gradients.',
    color: '#5c3800',
    gradesWeight: {
      homework: 20,
      midterm: 25,
      project: 35,
      final: 20
    },
    currentGrade: 'A',
    currentPercentage: 95.8
  },
  {
    code: 'CS 210',
    name: 'Advanced Data Structures & Analysis',
    department: 'Computer Science',
    instructor: 'Dr. Sarah Lin',
    instructorEmail: 's.lin@campus.edu',
    credits: 4,
    room: 'Room 210, Lovelace Hall',
    schedule: 'Tue, Thu 10:00 AM - 11:30 AM',
    description: 'Self-balancing trees, Fibonacci heaps, disjoint sets, amortized complexity, graph algorithms, max-flow/min-cut, randomized algorithms, and streaming sketches.',
    color: '#1e3a8a',
    gradesWeight: {
      homework: 30,
      midterm: 30,
      project: 20,
      final: 20
    },
    currentGrade: 'A+',
    currentPercentage: 98.0
  }
];

export const mockFacultyList: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Prof. Marcus Miller',
    title: 'Associate Professor of Computer Systems',
    department: 'Computer Science & Engineering',
    email: 'm.miller@campus.edu',
    office: 'Turing Hall, Room 512',
    officeHours: 'Wed 2:00 PM - 4:00 PM, Thu 10:00 AM - 12:00 PM',
    research: ['Distributed Consensus', 'Fault-Tolerant Storage', 'Serverless Runtime Architecture'],
    coursesTaught: ['CS 301: Distributed Systems', 'CS 502: Advanced Cloud Arch'],
    availableToday: true
  },
  {
    id: 'fac-2',
    name: 'Prof. Elena Rostova',
    title: 'Professor of Applied Mathematics',
    department: 'Mathematics & Statistics',
    email: 'e.rostova@campus.edu',
    office: 'Gauss Mathematical Sciences, Room 304',
    officeHours: 'Mon, Wed 3:30 PM - 5:00 PM',
    research: ['Stochastic Differential Equations', 'Markov Decision Models', 'High-Dimensional Statistics'],
    coursesTaught: ['MATH 240: Probability', 'MATH 410: Measure Theory'],
    availableToday: true
  },
  {
    id: 'fac-3',
    name: 'Prof. Kenneth Vance',
    title: 'Chair of Artificial Intelligence Lab',
    department: 'Computer Science & Engineering',
    email: 'k.vance@campus.edu',
    office: 'Lovelace Computing Center, Room 418',
    officeHours: 'Tue, Fri 1:00 PM - 3:00 PM',
    research: ['Deep Reinforcement Learning', 'Robotics Manipulation', 'Multi-Agent Emergence'],
    coursesTaught: ['CS 380: Search & Deep RL', 'CS 680: Autonomous Agents'],
    availableToday: false
  },
  {
    id: 'fac-4',
    name: 'Dr. Sarah Lin',
    title: 'Senior Lecturer & Undergraduate Academic Advisor',
    department: 'Computer Science & Engineering',
    email: 's.lin@campus.edu',
    office: 'Turing Hall, Room 204',
    officeHours: 'Daily 11:00 AM - 1:00 PM (Drop-in & Scheduled)',
    research: ['Algorithmic Complexity', 'Computer Science Pedagogy', 'Fairness in Automated Grading'],
    coursesTaught: ['CS 210: Data Structures', 'CS 101: Foundations of CS'],
    availableToday: true
  }
];

export const mockLibraryPods = [
  { id: 'pod-1', name: 'Focus Pod 301', floor: 'Floor 3 Silent Zone', status: 'available', hasMonitor: true, powerOutlet: true },
  { id: 'pod-2', name: 'Focus Pod 302', floor: 'Floor 3 Silent Zone', status: 'available', hasMonitor: true, powerOutlet: true },
  { id: 'pod-3', name: 'Focus Pod 303', floor: 'Floor 3 Silent Zone', status: 'occupied', until: '12:30 PM', hasMonitor: false, powerOutlet: true },
  { id: 'pod-4', name: 'Focus Pod 304', floor: 'Floor 3 Silent Zone', status: 'available', hasMonitor: true, powerOutlet: true },
  { id: 'pod-5', name: 'GPU Workstation Pod A', floor: 'Floor 3 High-Compute Lab', status: 'available', hasMonitor: true, powerOutlet: true, gpu: 'NVIDIA RTX 4090' },
  { id: 'pod-6', name: 'GPU Workstation Pod B', floor: 'Floor 3 High-Compute Lab', status: 'occupied', until: '2:00 PM', hasMonitor: true, powerOutlet: true, gpu: 'NVIDIA RTX 4090' }
];

export const mockCampusItems = [
  {
    id: 'item-1',
    name: 'CS 380 Deep RL & Search Course Reader',
    category: 'Textbooks & Packets',
    description: 'Official printed lecture notes, Bellman proofs, formula sheets, and past midterm practice packets.',
    price: 18.00,
    stock: 35,
    inStock: true,
    badge: 'Required Material'
  },
  {
    id: 'item-2',
    name: 'CS 301 Distributed Systems Hardware Lab Kit',
    category: 'Hardware & Lab Kits',
    description: 'Breadboard, ESP32 microcontrollers, network transceiver modules, and USB-C debugging cables.',
    price: 35.00,
    stock: 20,
    inStock: true,
    badge: 'Lab Essential'
  },
  {
    id: 'item-3',
    name: 'CampusPulse Engineering Varsity Hoodie',
    category: 'Campus Merchandise',
    description: 'Heavyweight organic cotton navy hoodie embroidered with the official university crest.',
    price: 28.00,
    stock: 45,
    inStock: true,
    badge: 'Official Swag'
  },
  {
    id: 'item-4',
    name: 'MATH 240 Stochastic Processes Solutions Manual',
    category: 'Textbooks & Packets',
    description: 'Step-by-step Markov Chain and Brownian motion simulation code walkthroughs in Python.',
    price: 22.00,
    stock: 18,
    inStock: true
  },
  {
    id: 'item-5',
    name: '24/7 Library RFID High-Speed Fast-Pass Badge',
    category: 'RFID & Passes',
    description: 'Contactless encrypted keycard for instant tap-in access to Turing Wing Floor 3 Silent Focus Pods.',
    price: 10.00,
    stock: 80,
    inStock: true,
    badge: 'Popular'
  }
];
