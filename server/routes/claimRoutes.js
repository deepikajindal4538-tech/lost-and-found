import express from 'express';
import {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  updateClaimStatus,
} from '../controllers/claimController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/my', protect, getMyClaims);
router.get('/received', protect, getReceivedClaims);
router.put('/:id', protect, updateClaimStatus);

export default router;
