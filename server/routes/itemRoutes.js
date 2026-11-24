import express from 'express';
import {
  getItems,
  getHomepageSummary,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
} from '../controllers/itemController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Specific routes before parameterized :id
router.get('/summary', getHomepageSummary);
router.get('/user/me', protect, getMyItems);

router
  .route('/')
  .get(getItems)
  .post(protect, upload.single('image'), createItem);

router
  .route('/:id')
  .get(optionalAuth, getItemById)
  .put(protect, upload.single('image'), updateItem)
  .delete(protect, deleteItem);

export default router;
