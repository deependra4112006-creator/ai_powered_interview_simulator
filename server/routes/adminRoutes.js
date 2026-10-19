import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Allow authenticated users to view/manage admin demo panel
router.use(protect);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/questions', getAdminQuestions);
router.post('/questions', createAdminQuestion);
router.put('/questions/:id', updateAdminQuestion);
router.delete('/questions/:id', deleteAdminQuestion);

export default router;
