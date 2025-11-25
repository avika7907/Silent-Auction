import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load env vars
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import bidRoutes from './routes/bids.js';
import adminRoutes from './routes/admin.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.set('io', io);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('join-auction', (itemId) => {
    socket.join(`item-${itemId}`);
    console.log(`User ${socket.id} joined item-${itemId}`);
  });

  socket.on('leave-auction', (itemId) => {
    socket.leave(`item-${itemId}`);
    console.log(`User ${socket.id} left item-${itemId}`);
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Export io for use in controllers
export { io };

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
