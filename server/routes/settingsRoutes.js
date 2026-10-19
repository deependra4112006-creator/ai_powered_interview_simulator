import express from 'express';
import { getSystemSettings, testLLMConnection } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSystemSettings);
router.post('/test-llm', protect, testLLMConnection);

export default router;
