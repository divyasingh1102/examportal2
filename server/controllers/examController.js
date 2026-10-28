// server/controllers/examController.js
// Handles Exam Lifecycles, Shuffling, Tab Violation Counter, Server Timer, and Instant Grading

import { query } from '../db.js';

// Helper: Fisher-Yates True Random Shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. Get all active exams for student dashboard
export async function getExams(req, res) {
  try {
    const exams = await query('SELECT * FROM exams WHERE is_active = 1 ORDER BY id ASC');
    return res.json({ success: true, exams });
  } catch (err) {
    console.error('Error fetching exams:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve available exams.' });
  }
}

// 2. Get single exam info
export async function getExamById(req, res) {
  try {
    const examId = parseInt(req.params.id, 10);
    const rows = await query('SELECT * FROM exams WHERE id = ?', [examId]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }
    return res.json({ success: true, exam: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load exam details.' });
  }
}

// 3. Start Exam: HARDER TWIST A - Randomize question & option order per student attempt
export async function startExam(req, res) {
  try {
    const examId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    // Check exam exists and is active
    const examRows = await query('SELECT * FROM exams WHERE id = ? AND is_active = 1', [examId]);
    if (!examRows || examRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Exam is not currently active.' });
    }
    const exam = examRows[0];

    // Fetch all questions for this exam
    const questions = await query('SELECT * FROM questions WHERE exam_id = ?', [examId]);
    if (!questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'This exam currently has no questions.' });
    }

    // Check if student already has an active in_progress attempt
    const existingAttempts = await query(
      'SELECT * FROM attempts WHERE user_id = ? AND exam_id = ? AND status = ? ORDER BY id DESC',
      [userId, examId, 'in_progress']
    );

    if (existingAttempts && existingAttempts.length > 0) {
      const activeAttempt = existingAttempts[0];
      // Check if time expired on active attempt
      const startTime = new Date(activeAttempt.started_at).getTime();
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const totalAllowedSeconds = exam.duration_minutes * 60;

      if (elapsedSeconds < totalAllowedSeconds) {
        // Return existing attempt with restored order
        return restoreAttemptSession(activeAttempt, exam, questions, res);
      } else {
        // Auto-close late attempt
        await gradeAndCloseAttempt(activeAttempt.id, {}, 'timeout');
      }
    }

    // HARDER TWIST: 1. Shuffle question order
    let orderedQuestions = [...questions];
    if (exam.shuffle_questions) {
      orderedQuestions = shuffleArray(orderedQuestions);
    }
    const questionOrder = orderedQuestions.map(q => q.id);

    // HARDER TWIST: 2. Shuffle options for each question and record map
    const optionOrderMap = {};
    const sanitizedQuestions = [];

    for (let idx = 0; idx < orderedQuestions.length; idx++) {
      const q = orderedQuestions[idx];
      let opts = q.options ? [...q.options] : await query('SELECT * FROM options WHERE question_id = ?', [q.id]);
      
      if (exam.shuffle_options) {
        opts = shuffleArray(opts);
      }

      optionOrderMap[q.id] = opts.map(o => o.id);

      // Strip correct answers before sending to student!
      const clientOptions = opts.map((opt, optIdx) => ({
        id: opt.id,
        label: String.fromCharCode(65 + optIdx), // 'A', 'B', 'C', 'D'
        option_text: opt.option_text
      }));

      sanitizedQuestions.push({
        id: q.id,
        number: idx + 1,
        question_text: q.question_text,
        category: q.category,
        difficulty: q.difficulty,
        marks: q.marks,
        options: clientOptions
      });
    }

    // Compute total marks
    const totalExamMarks = questions.reduce((sum, q) => sum + (q.marks || 5), 0);

    // Save attempt with serialized shuffled orders
    const attemptResult = await query(
      'INSERT INTO attempts (user_id, exam_id, total_marks, question_order, option_order) VALUES (?, ?, ?, ?, ?)',
      [userId, examId, totalExamMarks, JSON.stringify(questionOrder), JSON.stringify(optionOrderMap)]
    );
    const attemptId = attemptResult.insertId;

    return res.json({
      success: true,
      attemptId,
      exam: {
        id: exam.id,
        title: exam.title,
        subject: exam.subject,
        duration_minutes: exam.duration_minutes,
        total_marks: totalExamMarks,
        max_violations: exam.max_violations || 3
      },
      questions: sanitizedQuestions,
      startedAt: new Date().toISOString(),
      remainingSeconds: exam.duration_minutes * 60,
      violations: 0
    });
  } catch (err) {
    console.error('Error starting exam:', err);
    return res.status(500).json({ success: false, message: 'Could not initialize exam attempt.' });
  }
}

// Helper: Restore ongoing attempt session on page refresh
async function restoreAttemptSession(attempt, exam, questions, res) {
  try {
    let questionOrder = [];
    let optionOrderMap = {};

    try {
      questionOrder = typeof attempt.question_order === 'string' ? JSON.parse(attempt.question_order) : attempt.question_order;
      optionOrderMap = typeof attempt.option_order === 'string' ? JSON.parse(attempt.option_order) : attempt.option_order;
    } catch (e) {
      questionOrder = questions.map(q => q.id);
    }

    const questionMap = new Map(questions.map(q => [q.id, q]));
    const sanitizedQuestions = [];

    // Reconstruct student's exact shuffled order
    const orderedQIds = (questionOrder && questionOrder.length > 0) ? questionOrder : questions.map(q => q.id);

    for (let idx = 0; idx < orderedQIds.length; idx++) {
      const qId = orderedQIds[idx];
      const q = questionMap.get(qId);
      if (!q) continue;

      let opts = q.options ? [...q.options] : await query('SELECT * FROM options WHERE question_id = ?', [q.id]);
      const storedOptOrder = optionOrderMap[qId] || [];

      if (storedOptOrder.length > 0) {
        const optMap = new Map(opts.map(o => [o.id, o]));
        opts = storedOptOrder.map(optId => optMap.get(optId)).filter(Boolean);
      }

      const clientOptions = opts.map((opt, optIdx) => ({
        id: opt.id,
        label: String.fromCharCode(65 + optIdx),
        option_text: opt.option_text
      }));

      sanitizedQuestions.push({
        id: q.id,
        number: idx + 1,
        question_text: q.question_text,
        category: q.category,
        difficulty: q.difficulty,
        marks: q.marks,
        options: clientOptions
      });
    }

    const startTime = new Date(attempt.started_at).getTime();
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const remainingSeconds = Math.max(0, (exam.duration_minutes * 60) - elapsedSeconds);

    return res.json({
      success: true,
      attemptId: attempt.id,
      exam: {
        id: exam.id,
        title: exam.title,
        subject: exam.subject,
        duration_minutes: exam.duration_minutes,
        total_marks: attempt.total_marks || exam.total_marks,
        max_violations: exam.max_violations || 3
      },
      questions: sanitizedQuestions,
      startedAt: attempt.started_at,
      remainingSeconds,
      violations: attempt.violations || 0
    });
  } catch (err) {
    console.error('Error restoring session:', err);
    return res.status(500).json({ success: false, message: 'Failed to restore attempt session.' });
  }
}

// 4. Record Tab Violation: HARDER TWIST B - Warn twice, auto-submit on 3rd
export async function recordViolation(req, res) {
  try {
    const attemptId = parseInt(req.params.attemptId || req.params.id, 10);
    const userId = req.user.id;
    const { details, currentAnswers } = req.body;

    const attemptRows = await query('SELECT * FROM attempts WHERE id = ? AND user_id = ?', [attemptId, userId]);
    if (!attemptRows || attemptRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Exam attempt not found.' });
    }

    const attempt = attemptRows[0];
    if (attempt.status === 'completed') {
      return res.json({
        success: true,
        message: 'Exam attempt is already completed.',
        isTerminated: true,
        violations: attempt.violations
      });
    }

    const newViolationCount = (attempt.violations || 0) + 1;

    // Log violation to database
    await query(
      'INSERT INTO tab_violations (attempt_id, user_id, violation_number, details) VALUES (?, ?, ?, ?)',
      [
        attemptId,
        userId,
        newViolationCount,
        details || (newViolationCount === 3 ? 'Tab switched 3rd time - Automatic submission triggered' : `Tab switch violation ${newViolationCount}/3`)
      ]
    );

    // Update attempt violation count in database
    await query(
      'UPDATE attempts SET violations = ? WHERE id = ?',
      [newViolationCount, attemptId]
    );

    // If 3rd violation: immediately auto-submit and grade!
    if (newViolationCount >= 3) {
      const gradeResult = await gradeAndCloseAttempt(attemptId, currentAnswers || {}, 'tab_violation');
      return res.json({
        success: true,
        violationNumber: newViolationCount,
        maxViolations: 3,
        isTerminated: true,
        message: 'Maximum of 3 tab switch violations reached! Your exam has been automatically submitted.',
        result: gradeResult
      });
    }

    return res.json({
      success: true,
      violationNumber: newViolationCount,
      maxViolations: 3,
      isTerminated: false,
      message: `Security warning ${newViolationCount} of 3: Tab switch or focus change detected.`
    });
  } catch (err) {
    console.error('Record violation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record tab violation.' });
  }
}

// 5. Submit Exam: Server-enforced Timer & Instant Automatic Grading
export async function submitExam(req, res) {
  try {
    const attemptId = parseInt(req.params.attemptId || req.params.id, 10);
    const userId = req.user.id;
    const { answers, submissionType } = req.body;

    const attemptRows = await query('SELECT * FROM attempts WHERE id = ? AND user_id = ?', [attemptId, userId]);
    if (!attemptRows || attemptRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Exam attempt not found.' });
    }

    const attempt = attemptRows[0];
    if (attempt.status === 'completed') {
      return res.json({
        success: true,
        message: 'Exam was already submitted.',
        alreadySubmitted: true,
        attemptId
      });
    }

    // SERVER-ENFORCED TIMER CHECK
    const examRows = await query('SELECT * FROM exams WHERE id = ?', [attempt.exam_id]);
    const exam = examRows[0];
    const startTime = new Date(attempt.started_at).getTime();
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const allowedSeconds = (exam.duration_minutes * 60) + 15; // 15-second grace period for latency

    let finalSubType = submissionType || 'manual';
    if (elapsedSeconds > allowedSeconds) {
      finalSubType = 'timeout';
    }

    const gradeResult = await gradeAndCloseAttempt(attemptId, answers || {}, finalSubType);

    return res.json({
      success: true,
      message: 'Exam submitted and graded successfully.',
      result: gradeResult
    });
  } catch (err) {
    console.error('Submit exam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit exam.' });
  }
}

// Core helper: Grade submission and record answers
async function gradeAndCloseAttempt(attemptId, answersMap, subType) {
  const attemptRows = await query('SELECT * FROM attempts WHERE id = ?', [attemptId]);
  const attempt = attemptRows[0];
  const examId = attempt.exam_id;

  const questions = await query('SELECT * FROM questions WHERE exam_id = ?', [examId]);

  let totalScore = 0;
  let totalPossible = 0;
  let correctCount = 0;

  for (const q of questions) {
    const marks = q.marks || 5;
    totalPossible += marks;

    // Selected option submitted by student
    const selectedOptionId = answersMap[q.id] ? parseInt(answersMap[q.id], 10) : null;

    // Find correct option from database
    const opts = q.options ? q.options : await query('SELECT * FROM options WHERE question_id = ?', [q.id]);
    const correctOpt = opts.find(o => o.is_correct === 1 || o.is_correct === true);

    const isCorrect = correctOpt && selectedOptionId === correctOpt.id;
    const marksAwarded = isCorrect ? marks : 0;

    if (isCorrect) correctCount++;
    totalScore += marksAwarded;

    // Save answer record
    await query(
      'INSERT INTO answers (attempt_id, question_id, selected_option_id, is_correct, marks_awarded) VALUES (?, ?, ?, ?, ?)',
      [attemptId, q.id, selectedOptionId, isCorrect ? 1 : 0, marksAwarded]
    );
  }

  const percentage = totalPossible > 0 ? parseFloat(((totalScore / totalPossible) * 100).toFixed(2)) : 0;
  const isAutoSubmitted = subType === 'tab_violation' || subType === 'timeout';

  // Update attempt status and score
  await query(
    'UPDATE attempts SET score = ?, percentage = ?, status = ?, submission_type = ?, auto_submitted = ? WHERE id = ?',
    [totalScore, percentage, 'completed', subType, isAutoSubmitted ? 1 : 0, attemptId]
  );

  return {
    attemptId,
    score: totalScore,
    totalMarks: totalPossible,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    percentage,
    submissionType: subType,
    autoSubmitted: isAutoSubmitted,
    violations: attempt.violations || (subType === 'tab_violation' ? 3 : 0),
    passed: percentage >= 40
  };
}

// 6. Get Attempt Result with Full Breakdown
export async function getAttemptResult(req, res) {
  try {
    const attemptId = parseInt(req.params.attemptId || req.params.id, 10);
    const userId = req.user.id;
    const userRole = req.user.role;

    const attemptRows = await query('SELECT * FROM attempts WHERE id = ?', [attemptId]);
    if (!attemptRows || attemptRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Attempt not found.' });
    }

    const attempt = attemptRows[0];
    if (userRole !== 'admin' && attempt.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this attempt result.' });
    }

    const examRows = await query('SELECT * FROM exams WHERE id = ?', [attempt.exam_id]);
    const exam = examRows[0] || {};

    const questions = await query('SELECT * FROM questions WHERE exam_id = ?', [attempt.exam_id]);
    const answers = await query('SELECT * FROM answers WHERE attempt_id = ?', [attemptId]);
    const violations = await query('SELECT * FROM tab_violations WHERE attempt_id = ? ORDER BY violation_number ASC', [attemptId]);

    const answersMap = new Map(answers.map(a => [a.question_id, a]));

    // Construct full review
    const review = questions.map((q, idx) => {
      const ans = answersMap.get(q.id);
      const opts = q.options ? q.options : [];
      const correctOpt = opts.find(o => o.is_correct === 1 || o.is_correct === true);
      const selectedOpt = ans ? opts.find(o => o.id === ans.selected_option_id) : null;

      return {
        questionId: q.id,
        number: idx + 1,
        questionText: q.question_text,
        category: q.category,
        marks: q.marks,
        explanation: q.explanation,
        options: opts.map(o => ({
          id: o.id,
          text: o.option_text,
          isCorrect: o.is_correct === 1 || o.is_correct === true
        })),
        selectedOptionId: ans ? ans.selected_option_id : null,
        selectedOptionText: selectedOpt ? selectedOpt.option_text : 'Not Answered',
        correctOptionId: correctOpt ? correctOpt.id : null,
        correctOptionText: correctOpt ? correctOpt.option_text : 'N/A',
        isCorrect: ans ? (ans.is_correct === 1 || ans.is_correct === true) : false,
        marksAwarded: ans ? ans.marks_awarded : 0
      };
    });

    return res.json({
      success: true,
      attempt: {
        id: attempt.id,
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject,
        score: attempt.score,
        totalMarks: attempt.total_marks || exam.total_marks,
        percentage: attempt.percentage,
        submissionType: attempt.submission_type,
        autoSubmitted: attempt.auto_submitted === 1 || attempt.auto_submitted === true,
        violations: attempt.violations,
        startedAt: attempt.started_at,
        submittedAt: attempt.submitted_at,
        passed: (attempt.percentage || 0) >= (exam.passing_marks ? (exam.passing_marks / exam.total_marks) * 100 : 40)
      },
      violations,
      review
    });
  } catch (err) {
    console.error('Error fetching result:', err);
    return res.status(500).json({ success: false, message: 'Failed to load attempt result.' });
  }
}

// 7. Get student's previous attempts for their dashboard
export async function getStudentAttempts(req, res) {
  try {
    const userId = req.user.id;
    const attempts = await query(
      'SELECT a.*, e.title as exam_title, e.subject FROM attempts a JOIN exams e ON a.exam_id = e.id WHERE a.user_id = ? ORDER BY a.id DESC',
      [userId]
    );

    // Fallback if JOIN wasn't executed by in-memory engine
    if (attempts.length > 0 && !attempts[0].exam_title) {
      const exams = await query('SELECT * FROM exams');
      const examMap = new Map(exams.map(e => [e.id, e]));
      attempts.forEach(a => {
        const e = examMap.get(a.exam_id);
        if (e) {
          a.exam_title = e.title;
          a.subject = e.subject;
        }
      });
    }

    return res.json({ success: true, attempts });
  } catch (err) {
    console.error('Error fetching student attempts:', err);
    return res.status(500).json({ success: false, message: 'Failed to load student history.' });
  }
}
