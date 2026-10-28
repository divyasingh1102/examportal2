// server/routes/adminRoutes.js
import express from 'express';
import {
  getDashboardStats,
  getPerformanceAnalytics,
  getAllAttempts,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createExam
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/analytics', getPerformanceAnalytics);
router.get('/attempts', getAllAttempts);
router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/exams', createExam);

export default router;
