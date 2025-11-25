# Silent Auction React Application

A full-stack minimalist React.js application for managing silent auctions with real-time bidding, admin controls, and email notifications.

## 🎯 Features

### User Roles
- **Bidders**: Register, login, browse items, place bids, track bid status
- **Admin**: Manage auction items, close auctions, declare winners, send email notifications

### Core Functionality
- ✅ JWT-based authentication and authorization
- ✅ Real-time bid tracking with Socket.IO
- ✅ Auction item management (up to 30 items)
- ✅ Bid validation ($1 minimum increment)
- ✅ Search functionality for items
- ✅ Bid history per item with highlighted top bid
- ✅ Admin controls for closing auctions
- ✅ Automatic winner declaration
- ✅ Email notifications for winners
- ✅ Responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Socket.IO Client
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Socket.IO
- Nodemailer
- bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Email service credentials (Gmail recommended)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd Silent-Auction
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your configuration
```

**Configure `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/silent-auction
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d
NODE_ENV=development

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@silentauction.com

CLIENT_URL=http://localhost:5173
```

**Gmail Setup for Email Notifications:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use the generated password in `EMAIL_PASSWORD`

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

**Configure `.env` file:**
```env
VITE_API_URL=http://localhost:5000
```

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

**Option B: MongoDB Atlas**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `MONGODB_URI` in server `.env`

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📖 User Guide

### For Bidders

1. **Register an Account**
   - Navigate to http://localhost:5173
   - Click "Register"
   - Fill in username, email, password
   - Select "Bidder" role
   - Click "Register"

2. **Browse Items**
   - View all auction items on the home page
   - Use search bar to find specific items
   - Filter by status (Active/Closed)

3. **Place a Bid**
   - Click on any item to view details
   - Enter bid amount (must be at least $1 more than current bid)
   - Click "Place Bid"
   - See real-time updates as other users bid

4. **Track Your Bids**
   - Green highlight indicates you're currently winning
   - View complete bid history on item detail page
   - Receive email notification if you win

### For Admin

1. **Register as Admin**
   - Register with "Admin" role selected
   - Access Admin Panel from navbar

2. **Add Auction Items**
   - Click "Add New Item" in Admin Panel
   - Fill in title, description, image URL, starting bid
   - Maximum 30 items allowed
   - Submit to create item

3. **Monitor Auctions**
   - View all active items with current bids
   - See bid activity in real-time

4. **Close Auctions**
   - **Single Item**: Click "Close" on individual item
   - **All Items**: Click "Close All Auctions"
   - System automatically determines winner (highest bidder)

5. **Notify Winners**
   - After closing auctions, click "Notify Winners"
   - System sends email to all winners
   - View results in browser console

6. **Manage Items**
   - Delete items that haven't received bids
   - View closed auctions with winner information

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Items
- `GET /api/items` - Get all items (with optional search/filter)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item (admin only)
- `PUT /api/items/:id` - Update item (admin only)
- `DELETE /api/items/:id` - Delete item (admin only)
- `PUT /api/items/:id/close` - Close auction (admin only)

### Bids
- `POST /api/bids` - Place bid (protected)
- `GET /api/bids/item/:itemId` - Get all bids for item
- `GET /api/bids/my-bids` - Get user's bids (protected)
- `GET /api/bids/highest` - Get highest bids for all items

### Admin
- `POST /api/admin/close-all` - Close all auctions (admin only)
- `POST /api/admin/notify-winners` - Send winner emails (admin only)
- `GET /api/admin/winners` - Get all winners (admin only)

## 🌐 Deployment

### Deploy Backend (Render)

1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Add all environment variables from `.env`
5. Deploy

### Deploy Frontend (Vercel/Netlify)

**Vercel:**
```bash
cd client
npm install -g vercel
vercel
```

**Netlify:**
```bash
cd client
npm run build
# Drag and drop 'dist' folder to Netlify
```

**Important:** Update `VITE_API_URL` in client `.env` to your deployed backend URL

### Deploy Database (MongoDB Atlas)

1. Create cluster at https://mongodb.com/cloud/atlas
2. Get connection string
3. Update backend `MONGODB_URI`

## 🧪 Testing

### Test Admin Account
```
Email: admin@test.com
Password: admin123
Role: admin
```

### Test Bidder Account
```
Email: bidder@test.com
Password: bidder123
Role: bidder
```

### Sample Test Flow
1. Create admin account
2. Add 5-10 auction items
3. Create bidder accounts
4. Place competing bids on items
5. Monitor real-time updates
6. Close auctions as admin
7. Check winner list
8. Send email notifications

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Whitelist your IP address

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check EMAIL_* variables in `.env`
- Enable "Less secure app access" if using regular password (not recommended)

### Socket.IO Connection Failed
- Ensure backend is running
- Check CORS configuration
- Verify `VITE_API_URL` matches backend URL

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in server/.env or client/vite.config.js
```

## 📁 Project Structure

```
Silent-Auction/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API & Socket utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## 🎥 Video Demonstration

Record a video showing:
1. User registration and login
2. Browsing auction items
3. Placing bids with real-time updates
4. Admin adding new items
5. Admin closing auction
6. Winner declaration
7. Email notification process

## 📝 Success Metrics

✅ Functional authentication system
✅ Real-time bid updates via Socket.IO
✅ Bid validation (minimum $1 increment)
✅ Admin can close auctions and declare winners
✅ Email notifications to winners
✅ Clean, responsive UI with Tailwind CSS
✅ Search functionality
✅ No critical bugs

## 🚀 Extra Credit Features Implemented

✅ Real-time push notifications via Socket.IO
✅ Full authentication and authorization
✅ Role-based access control
✅ Search and filter functionality
✅ Responsive design

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👨‍💻 Author

Built for Silent Auction Project Assignment

## 🙏 Acknowledgments

- React team for amazing framework
- MongoDB for database
- Socket.IO for real-time functionality
- Tailwind CSS for styling
