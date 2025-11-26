import nodemailer from 'nodemailer';
import Item from '../models/Item.js';
import Bid from '../models/Bid.js';

// Create email transporter (using Nodemailer)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // For compatibility with various SMTP servers
    }
  });
};

// @desc    Send winner notification emails
// @route   POST /api/admin/notify-winners
// @access  Private/Admin
export const notifyWinners = async (req, res) => {
  try {
    // Get all closed items with winners
    const closedItems = await Item.find({ 
      status: 'closed',
      winner: { $ne: null }
    }).populate('winner', 'username email');

    if (closedItems.length === 0) {
      return res.status(400).json({ message: 'No winners to notify' });
    }

    const transporter = createTransporter();
    const emailResults = [];

    // Send email to each winner
    for (const item of closedItems) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: item.winner.email,
          subject: '🎉 Congratulations! You Won the Auction',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Congratulations ${item.winner.username}!</h2>
              <p>You have won the auction for:</p>
              <div style="border: 1px solid #E5E7EB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #111827; margin-top: 0;">${item.title}</h3>
                <p style="color: #6B7280;">${item.description}</p>
                <p style="font-size: 24px; color: #10B981; font-weight: bold;">
                  Winning Bid: $${item.winningAmount}
                </p>
              </div>
              <p>Thank you for participating in our silent auction!</p>
              <p style="color: #6B7280; font-size: 12px; margin-top: 40px;">
                This is an automated message from Silent Auction Platform
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        emailResults.push({
          item: item.title,
          winner: item.winner.email,
          status: 'sent'
        });
      } catch (emailError) {
        console.error(`Failed to send email for item ${item.title}:`, emailError);
        emailResults.push({
          item: item.title,
          winner: item.winner.email,
          status: 'failed',
          error: emailError.message
        });
      }
    }

    res.json({
      message: 'Email notification process completed',
      results: emailResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all winners
// @route   GET /api/admin/winners
// @access  Private/Admin
export const getWinners = async (req, res) => {
  try {
    const winners = await Item.find({ 
      status: 'closed',
      winner: { $ne: null }
    })
    .populate('winner', 'username email')
    .select('title winner winningAmount createdAt');

    const winnerList = winners.map(item => ({
      itemId: item._id,
      itemTitle: item.title,
      winnerId: item.winner._id,
      winnerUsername: item.winner.username,
      winnerEmail: item.winner.email,
      winningAmount: item.winningAmount,
      auctionDate: item.createdAt
    }));

    res.json(winnerList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Close all active auctions
// @route   POST /api/admin/close-all
// @access  Private/Admin
export const closeAllAuctions = async (req, res) => {
  try {
    const activeItems = await Item.find({ status: 'active' });

    if (activeItems.length === 0) {
      return res.status(400).json({ message: 'No active auctions to close' });
    }

    const results = [];

    for (const item of activeItems) {
      // Get highest bid for this item
      const highestBid = await Bid.findOne({ item: item._id })
        .sort('-amount')
        .populate('bidder', 'username email');

      if (highestBid) {
        item.winner = highestBid.bidder._id;
        item.winningAmount = highestBid.amount;
      }

      item.status = 'closed';
      await item.save();

      results.push({
        itemId: item._id,
        title: item.title,
        winner: highestBid ? highestBid.bidder.username : 'No bids',
        winningAmount: highestBid ? highestBid.amount : 0
      });
    }

    res.json({
      message: `Successfully closed ${results.length} auctions`,
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
