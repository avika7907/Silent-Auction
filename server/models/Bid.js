import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a bid amount'],
    min: [1, 'Bid amount must be at least $1']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
bidSchema.index({ item: 1, createdAt: -1 });
bidSchema.index({ bidder: 1 });

export default mongoose.model('Bid', bidSchema);
