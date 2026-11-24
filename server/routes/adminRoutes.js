import express from 'express';
import {
  getAdminStats,
  getAdminItems,
  deleteAdminItem,
  getAdminReports,
  updateAdminReport,
  getAdminUsers,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin-only guard applied to all routes in this router
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/items', getAdminItems);
router.delete('/items/:id', deleteAdminItem);
router.get('/reports', getAdminReports);
router.put('/reports/:id', updateAdminReport);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
