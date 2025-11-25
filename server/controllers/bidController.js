import Bid from '../models/Bid.js';
import Item from '../models/Item.js';

// @desc    Get all bids for an item
// @route   GET /api/bids/item/:itemId
// @access  Public
export const getItemBids = async (req, res) => {
  try {
    const bids = await Bid.find({ item: req.params.itemId })
      .populate('bidder', 'username')
      .sort('-amount');
      
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bids
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate('item', 'title imageUrl status')
      .sort('-createdAt');
      
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
export const placeBid = async (req, res) => {
  try {
    const { itemId, amount } = req.body;

    // Check if item exists and is active
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status === 'closed') {
      return res.status(400).json({ message: 'Auction is closed for this item' });
    }

    // Get current highest bid
    const highestBid = await Bid.findOne({ item: itemId }).sort('-amount');
    const currentHighest = highestBid ? highestBid.amount : item.startingBid;

    // Validate bid amount (must be at least $1 more than current highest)
    if (amount <= currentHighest) {
      return res.status(400).json({ 
        message: `Bid must be at least $${currentHighest + 1}`,
        currentBid: currentHighest
      });
    }

    // Create bid
    const bid = await Bid.create({
      item: itemId,
      bidder: req.user._id,
      amount
    });

    // Update item's current bid
    item.currentBid = amount;
    await item.save();

    // Populate the bid with bidder info
    await bid.populate('bidder', 'username');

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`item-${itemId}`).emit('new-bid', {
        itemId,
        bid: {
          _id: bid._id,
          amount: bid.amount,
          bidder: {
            _id: bid.bidder._id,
            username: bid.bidder.username
          },
          createdAt: bid.createdAt
        },
        currentBid: amount
      });
    }

    res.status(201).json(bid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get highest bid for each item
// @route   GET /api/bids/highest
// @access  Public
export const getHighestBids = async (req, res) => {
  try {
    const highestBids = await Bid.aggregate([
      {
        $sort: { amount: -1 }
      },
      {
        $group: {
          _id: '$item',
          highestBid: { $first: '$amount' },
          bidder: { $first: '$bidder' },
          createdAt: { $first: '$createdAt' }
        }
      }
    ]);

    res.json(highestBids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
