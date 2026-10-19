import express from 'express';
import {
  createSession,
  getSessionById,
  submitAnswer,
  requestHint,
  runCode,
  completeSession,
  getUserSessions,
  deleteSession,
  clearUserHistory
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/sessions', createSession);
router.get('/sessions', getUserSessions);
router.delete('/sessions/clear-history', clearUserHistory);
router.get('/sessions/:id', getSessionById);
router.post('/sessions/:id/submit-answer', submitAnswer);
router.post('/sessions/:id/hint', requestHint);
router.post('/sessions/:id/complete', completeSession);
router.delete('/sessions/:id', deleteSession);
router.post('/run-code', runCode);

export default router;
