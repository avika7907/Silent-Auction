import Item from '../models/Item.js';
import Bid from '../models/Bid.js';

// @desc    Get all items
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const items = await Item.find(query)
      .populate('createdBy', 'username')
      .populate('winner', 'username email')
      .sort('-createdAt');
      
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('winner', 'username email');
      
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private/Admin
export const createItem = async (req, res) => {
  try {
    const { title, description, imageUrl, startingBid } = req.body;

    // Check item limit (30 items max)
    const itemCount = await Item.countDocuments();
    if (itemCount >= 30) {
      return res.status(400).json({ message: 'Maximum limit of 30 items reached' });
    }

    const item = await Item.create({
      title,
      description,
      imageUrl,
      startingBid,
      currentBid: startingBid,
      createdBy: req.user._id
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private/Admin
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const { title, description, imageUrl, startingBid } = req.body;

    item.title = title || item.title;
    item.description = description || item.description;
    item.imageUrl = imageUrl || item.imageUrl;
    item.startingBid = startingBid || item.startingBid;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private/Admin
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete all bids associated with this item
    await Bid.deleteMany({ item: item._id });
    
    await item.deleteOne();
    res.json({ message: 'Item and associated bids removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Close auction for an item
// @route   PUT /api/items/:id/close
// @access  Private/Admin
export const closeAuction = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status === 'closed') {
      return res.status(400).json({ message: 'Auction already closed' });
    }

    // Get the highest bid
    const highestBid = await Bid.findOne({ item: item._id })
      .sort('-amount')
      .populate('bidder', 'username email');

    if (highestBid) {
      item.winner = highestBid.bidder._id;
      item.winningAmount = highestBid.amount;
    }

    item.status = 'closed';
    await item.save();

    res.json({
      message: 'Auction closed successfully',
      item,
      winner: highestBid ? {
        userId: highestBid.bidder._id,
        username: highestBid.bidder.username,
        email: highestBid.bidder.email,
        amount: highestBid.amount
      } : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
