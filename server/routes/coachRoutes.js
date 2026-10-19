import express from 'express';
import { chatWithCoach } from '../controllers/coachController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Allow authenticated or guest candidates to interact with the coach
router.post('/chat', protect, chatWithCoach);

export default router;
