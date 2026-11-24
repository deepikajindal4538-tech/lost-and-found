import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, authorize('admin'), getReports);

export default router;
