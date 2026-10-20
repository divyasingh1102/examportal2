import { GoogleGenAI } from '@google/genai';
import { Course, DeadlineItem, NoticeItem, FacultyMember } from '../types/campus';

export interface PulseAIMessage {
  id: string;
  sender: 'user' | 'pulseai';
  text: string;
  timestamp: string;
  sourcePolicy?: string;
  isOfflineFallback?: boolean;
}

export interface PulseAIContextData {
  studentName: string;
  studentId: string;
  gpa: number;
  term: string;
  enrolledCourses: Course[];
  deadlines: DeadlineItem[];
  notices: NoticeItem[];
  facultyList: FacultyMember[];
  cardBalance: number;
}

const buildSystemInstruction = (ctx: PulseAIContextData): string => {
  const deadlinesSummary = ctx.deadlines
    .map(
      (d) =>
        `- [${d.courseCode}] ${d.title} (Due: ${d.dueText}, Priority: ${d.priority}, Status: ${
          d.completed ? 'Completed' : 'Pending Action'
        }, Progress: ${d.progressLabel || 'N/A'})`
    )
    .join('\n');

  const coursesSummary = ctx.enrolledCourses
    .map(
      (c) =>
        `- ${c.code}: ${c.name} (Instructor: ${c.instructor}, Room: ${c.room}, Schedule: ${c.schedule}, Current Grade: ${c.currentGrade} / ${c.currentPercentage}%)`
    )
    .join('\n');

  const facultySummary = ctx.facultyList
    .map(
      (f) =>
        `- ${f.name} (${f.title}, ${f.department}). Office: ${f.office}, Hours: ${f.officeHours}, Email: ${f.email}`
    )
    .join('\n');

  return `You are PulseAI, the official Academic Intelligence & Student Registry Assistant for the university portal "CampusPulse".
You are assisting student ${ctx.studentName} (ID: ${ctx.studentId}, Term: ${ctx.term}, Cumulative GPA: ${ctx.gpa}, Card Balance: $${ctx.cardBalance.toFixed(2)}).

YOUR KNOWLEDGE BASE CONTAINS VERIFIED UNIVERSITY FACTS:
1. CURRENT ENROLLED COURSES:
${coursesSummary}

2. ACTIVE DELIVERABLES & DEADLINES:
${deadlinesSummary}

3. FACULTY REGISTRY & OFFICE HOURS:
${facultySummary}

4. INSTITUTIONAL POLICIES & ACADEMIC CODE:
- CS 301 Late Policy: Prof. Marcus Miller allots 3 total slip/grace days per semester. Raft Consensus Milestone 2 allows consuming at most 1 grace day with zero penalty. Submissions are verified through GitHub Classroom and Gradescope autograder (20 test cases).
- CS 380 Midterm Protocol: Friday 10:00 AM - 12:00 PM in Turing Hall Exam Arena B4. Closed-book, but students are permitted exactly one double-sided handwritten 8.5"x11" formula sheet (no photocopies or digital aids).
- Exam Clash Clearance: Students with scheduling conflicts must submit the Dean of Academic Affairs Clash Clearance Form at least 48 hours in advance.
- Library & Facilities: Turing Wing is open 24/7 with acoustic Silent Study on Floor 3 (32 dB limit). 14 private focus pods with dual displays and GPU workstations with NVIDIA RTX 4090s.
- Printing Quota: CS juniors have 120 free monochrome high-speed pages per calendar month.
- Bursar Billing: Spring Term Installment #2 is due Friday, March 28. Department fellowship and TA fee waivers must be cleared through Student Account Gateway.
- Attendance: Lectures enforce attendance tracking via GeoBeacon BLE telemetry.

BEHAVIORAL DIRECTIVES:
- Provide direct, concise, factual, and supportive responses tailored specifically to ${ctx.studentName}.
- Always cite the specific policy or course section when discussing deadlines, grace days, or exam rules (e.g., "[CS 301 Syllabus §3]", "[Dean of Academic Affairs Examination Protocol v2025]").
- If asked about something not in university records, politely state what is officially on file and offer guidance on contacting the relevant academic advisor or department office.
- Use clean formatting, bullet points where helpful, and bold key deadlines.`;
};

/**
 * Executes a real query against Google Gemini API using @google/genai
 */
export async function askGeminiPulseAI(
  apiKey: string,
  userPrompt: string,
  history: PulseAIMessage[],
  contextData: PulseAIContextData
): Promise<{ text: string; sourcePolicy?: string }> {
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('MISSING_API_KEY');
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const systemInstruction = buildSystemInstruction(contextData);

  // Format past turns for context continuity
  const contents = history
    .filter((m) => m.id !== 'welcome')
    .slice(-6)
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

  contents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    const responseText = response.text || 'I could not generate an answer at this time.';

    // Extract policy citation if present in response
    let policyCitation = 'CampusPulse Verified Academic Registry';
    const policyMatch = responseText.match(/\[([A-Z0-9\s§\.-]+)\]/);
    if (policyMatch) {
      policyCitation = policyMatch[1];
    } else if (userPrompt.toLowerCase().includes('grace') || userPrompt.toLowerCase().includes('301')) {
      policyCitation = 'CS 301 Syllabus Policy §3: Late Submissions & Grace Days';
    } else if (userPrompt.toLowerCase().includes('exam') || userPrompt.toLowerCase().includes('midterm')) {
      policyCitation = 'Dean of Academic Affairs Examination Protocol v2025.1';
    }

    return {
      text: responseText,
      sourcePolicy: policyCitation
    };
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    throw err;
  }
}

/**
 * Offline verified college information fallback when no API key is supplied
 */
export function getOfflineVerifiedAnswer(
  query: string,
  contextData: PulseAIContextData
): { text: string; sourcePolicy: string } {
  const lower = query.toLowerCase();

  if (lower.includes('grace day') || lower.includes('late slip') || lower.includes('301') || lower.includes('raft')) {
    return {
      text: `**CS 301 Grace Day Allotment:**\nProf. Marcus Miller grants **3 total grace days** per semester for CS 301. For Milestone 2 (Raft Consensus), you are permitted to use **at most 1 grace day** without any penalty. If submitted within 24 hours after 11:59 PM today, it will be automatically recorded as 1 consumed grace day with 0% grade deduction.\n\nYour commit is verified through Gradescope's 20-test autograder suite.`,
      sourcePolicy: 'CS 301 Course Syllabus • Section 3.2 Late Policies'
    };
  }

  if (lower.includes('exam') || lower.includes('midterm') || lower.includes('formula') || lower.includes('arena b4') || lower.includes('clash')) {
    return {
      text: `**CS 380 Midterm Logistics:**\n- **Date & Time:** This Friday, 10:00 AM – 12:00 PM\n- **Venue:** Turing Hall Exam Arena B4\n- **Weight:** 25% of final grade\n- **Permitted Aid:** Exactly **one double-sided handwritten 8.5"x11" formula sheet**. No digital devices, photocopies, or smart calculators permitted.\n- **Clash Form:** If you have an exam conflict, submit the Dean of Academic Affairs Conflict Clearance Form at least 48 hours prior.`,
      sourcePolicy: 'Dean of Academic Affairs Examination Protocol v2025.1'
    };
  }

  if (lower.includes('office hour') || lower.includes('miller') || lower.includes('rostova') || lower.includes('vance') || lower.includes('lin')) {
    return {
      text: `**Faculty Office Hours Schedule:**\n- **Prof. Marcus Miller:** Wed 2:00 PM – 4:00 PM & Thu 10:00 AM – 12:00 PM (Turing Hall 512)\n- **Prof. Elena Rostova:** Mon & Wed 3:30 PM – 5:00 PM (Gauss Hall 304)\n- **Prof. Kenneth Vance:** Tue & Fri 1:00 PM – 3:00 PM (Lovelace 418)\n- **Dr. Sarah Lin:** Daily 11:00 AM – 1:00 PM (Turing Hall 204)`,
      sourcePolicy: 'Computer Science & Mathematics Faculty Registry Directory'
    };
  }

  if (lower.includes('library') || lower.includes('pod') || lower.includes('print') || lower.includes('gpu')) {
    return {
      text: `**Library & Study Pod Facilities:**\n- **Main Library (Turing Wing):** Open 24/7 with badge access.\n- **Floor 3 Silent Zone:** Currently low noise level (32 dB). 14 private focus pods and high-performance GPU workstations (NVIDIA RTX 4090) are available.\n- **Print Quota:** CS undergraduates hold **120 free monochrome pages** remaining this month.`,
      sourcePolicy: 'University Library System & IoT Focus Pod Allocation'
    };
  }

  if (lower.includes('bursar') || lower.includes('tuition') || lower.includes('billing') || lower.includes('installment')) {
    return {
      text: `**Tuition & Bursar Operations:**\nSpring Term Installment #2 is due on **Friday, March 28**. If you hold teaching assistant fee waivers, department stipends, or merit awards, verify their clearance on the Student Account Gateway prior to the deadline to prevent administrative registration holds.`,
      sourcePolicy: 'Bursar & Financial Operations Circular #2025-08'
    };
  }

  if (lower.includes('grade') || lower.includes('gpa') || lower.includes('degree') || lower.includes('credit')) {
    return {
      text: `**Academic Standing for ${contextData.studentName}:**\n- **Cumulative GPA:** ${contextData.gpa} (Dean's Honors List Standing)\n- **Enrolled Credits:** 16 credits across CS 301, MATH 240, CS 380, and CS 210.\n- **Degree Progress:** 84 / 120 B.S. in Computer Science credits completed (70%). All General Education and Math foundation requirements are satisfied.`,
      sourcePolicy: 'Official University Registrar Degree Audit'
    };
  }

  return {
    text: `Under university regulations for ${contextData.term}, you are actively enrolled in 16 credits with ${contextData.deadlines.filter(d => !d.completed).length} active milestone deadlines remaining. You can ask me about **grace days for CS 301**, **exam rules for CS 380**, **faculty office hours**, or **library focus pods**.`,
    sourcePolicy: 'Campus Registry Student Handbook & Academic Code'
  };
}
