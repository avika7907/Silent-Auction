import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an item title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an item description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Auction+Item'
  },
  startingBid: {
    type: Number,
    required: [true, 'Please provide a starting bid'],
    min: [1, 'Starting bid must be at least $1']
  },
  currentBid: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  winningAmount: {
    type: Number,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Item', itemSchema);
