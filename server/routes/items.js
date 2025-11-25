import express from 'express';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  closeAuction
} from '../controllers/itemController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, adminOnly, createItem);

router.route('/:id')
  .get(getItem)
  .put(protect, adminOnly, updateItem)
  .delete(protect, adminOnly, deleteItem);

router.put('/:id/close', protect, adminOnly, closeAuction);

export default router;
