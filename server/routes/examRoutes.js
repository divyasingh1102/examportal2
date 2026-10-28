// server/routes/examRoutes.js
import express from 'express';
import {
  getExams,
  getExamById,
  startExam,
  recordViolation,
  submitExam,
  getAttemptResult,
  getStudentAttempts
} from '../controllers/examController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public / Student Catalog
router.get('/', getExams);
router.get('/:id', getExamById);

// Student Exam Flow
router.post('/:id/start', authenticate, startExam);
router.post('/attempts/:attemptId/violation', authenticate, recordViolation);
router.post('/attempts/:attemptId/submit', authenticate, submitExam);
router.get('/attempts/:attemptId/result', authenticate, getAttemptResult);
router.get('/student/my-attempts', authenticate, getStudentAttempts);

export default router;
