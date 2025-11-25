import express from 'express';
import {
  notifyWinners,
  getWinners,
  closeAllAuctions
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/notify-winners', protect, adminOnly, notifyWinners);
router.get('/winners', protect, adminOnly, getWinners);
router.post('/close-all', protect, adminOnly, closeAllAuctions);

export default router;
