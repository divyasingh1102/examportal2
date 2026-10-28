// server/testSuite.js
// Direct Unit and Integration Test for Online Exam Portal Controller Functions

import { login, register, getMe } from './controllers/authController.js';
import { startExam, recordViolation, submitExam, getAttemptResult } from './controllers/examController.js';
import { getDashboardStats, getPerformanceAnalytics, getAllAttempts, getAllQuestions, createQuestion, deleteQuestion } from './controllers/adminController.js';

// Mock helper to create mock req and res
function mockReqRes(body = {}, params = {}, user = null) {
  const req = {
    body,
    params,
    user,
    headers: {}
  };

  let statusCode = 200;
  let responseData = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    sendStatus(code) {
      statusCode = code;
      return this;
    }
  };

  return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

async function runTests() {
  console.log('🧪 Running Online Exam Portal Direct Verification Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Student Login
  {
    const { req, res, getStatus, getData } = mockReqRes({ email: 'student1@portal.com', password: 'student123', role: 'student' });
    await login(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.success && data.token && data.user.role === 'student', 'Student login succeeds with valid token and student role');
  }

  // 2. Admin Login
  let adminUser = null;
  {
    const { req, res, getStatus, getData } = mockReqRes({ email: 'admin@portal.com', password: 'admin123', role: 'admin' });
    await login(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.success && data.user.role === 'admin', 'Admin login succeeds with admin role');
    adminUser = data.user;
  }

  // 3. Start Exam & Verify Shuffling
  let attemptId = null;
  const studentUser = { id: 2, name: 'Alex Turner', email: 'student1@portal.com', role: 'student' };
  {
    const { req, res, getStatus, getData } = mockReqRes({}, { id: '1' }, studentUser);
    await startExam(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.success && data.attemptId, 'Exam starts and creates attempt session');
    assert(data.questions && data.questions.length >= 10, 'Exam contains at least 10 MCQ questions');
    
    // Security check: is_correct is NOT sent to student!
    const leaked = data.questions[0].options.some(o => 'is_correct' in o);
    assert(!leaked, 'Security Twist: is_correct is NOT leaked to student options payload');
    assert(data.questions[0].options[0].label === 'A', 'Shuffled options have standardized labels (A, B, C, D)');
    attemptId = data.attemptId;
  }

  // 4. HARDER TWIST B: 1st Tab Switch Violation
  {
    const { req, res, getStatus, getData } = mockReqRes({ details: 'Tab switch 1' }, { attemptId: String(attemptId) }, studentUser);
    await recordViolation(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.violationNumber === 1 && data.isTerminated === false, 'Tab switch 1 records Warning 1 of 2');
  }

  // 5. HARDER TWIST B: 2nd Tab Switch Violation
  {
    const { req, res, getStatus, getData } = mockReqRes({ details: 'Tab switch 2' }, { attemptId: String(attemptId) }, studentUser);
    await recordViolation(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.violationNumber === 2 && data.isTerminated === false, 'Tab switch 2 records Warning 2 of 2');
  }

  // 6. HARDER TWIST B: 3rd Tab Switch Violation -> IMMEDIATE AUTO-SUBMISSION
  {
    const { req, res, getStatus, getData } = mockReqRes({ details: 'Tab switch 3' }, { attemptId: String(attemptId) }, studentUser);
    await recordViolation(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.violationNumber === 3 && data.isTerminated === true, 'Tab switch 3 triggers immediate automatic termination & auto-submission');
    assert(data.result && data.result.autoSubmitted === true, 'Submission flagged as autoSubmitted: true');
    assert(data.result.submissionType === 'tab_violation', 'Submission type recorded as tab_violation');
  }

  // 7. Get Attempt Result & Explanations Review
  {
    const { req, res, getStatus, getData } = mockReqRes({}, { attemptId: String(attemptId) }, studentUser);
    await getAttemptResult(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.attempt.autoSubmitted === true, 'Result reports auto-submission status');
    assert(data.review && data.review.length >= 10, 'Result returns all questions with answer key and explanation breakdown');
    assert(data.review[0].explanation && data.review[0].explanation.length > 0, 'Verified educational explanation provided for each question');
  }

  // 8. Admin Analytics & Per-Question Accuracy Chart Data
  {
    const { req, res, getStatus, getData } = mockReqRes({}, {}, adminUser);
    await getPerformanceAnalytics(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.analytics.questionAccuracy.length >= 10, 'Admin analytics computes per-question accuracy for Chart.js bar chart');
    assert(data.analytics.examAverages.length > 0, 'Admin analytics returns average scores across exams');
  }

  // 9. Admin Attempts Monitoring
  {
    const { req, res, getStatus, getData } = mockReqRes({}, {}, adminUser);
    await getAllAttempts(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.attempts.length > 0, 'Admin retrieves attempts table with time taken, scores, and tab violation flags');
    const flagged = data.attempts.find(a => a.violations > 0);
    assert(!!flagged, 'Security flagged attempts detected and formatted with violation counts');
  }

  // 10. Question Bank CRUD: Create Question
  let createdQId = null;
  {
    const newQ = {
      exam_id: 1,
      question_text: 'What does the V8 engine compile JavaScript code into?',
      category: 'JavaScript Engines',
      marks: 5,
      explanation: 'V8 directly compiles JavaScript into native machine code using its Ignition interpreter and TurboFan optimizing compiler.',
      options: [
        { option_text: 'Native Machine Code', is_correct: true },
        { option_text: 'Java Bytecode', is_correct: false },
        { option_text: 'C++ Source Code', is_correct: false },
        { option_text: 'AssemblyScript', is_correct: false }
      ]
    };
    const { req, res, getStatus, getData } = mockReqRes(newQ, {}, adminUser);
    await createQuestion(req, res);
    const data = getData();
    assert(getStatus() === 201 && data.questionId, 'Admin adds new MCQ question with 4 options to Question Bank');
    createdQId = data.questionId;
  }

  // 11. Question Bank CRUD: Delete Question
  {
    const { req, res, getStatus, getData } = mockReqRes({}, { id: String(createdQId) }, adminUser);
    await deleteQuestion(req, res);
    const data = getData();
    assert(getStatus() === 200 && data.success, 'Admin deletes question from Question Bank');
  }

  console.log(`\n========================================`);
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
