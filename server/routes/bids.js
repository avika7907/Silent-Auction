import express from 'express';
import {
  getItemBids,
  getMyBids,
  placeBid,
  getHighestBids
} from '../controllers/bidController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, placeBid);
router.get('/my-bids', protect, getMyBids);
router.get('/highest', getHighestBids);
router.get('/item/:itemId', getItemBids);

export default router;
