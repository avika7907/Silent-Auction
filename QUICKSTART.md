# 🚀 Quick Start - Ready to Run!

## Your Silent Auction app is ready! Here's how to start:

### ✅ Step 1: Start MongoDB

**Option A - If you have MongoDB installed locally:**
```powershell
mongod
```
Keep this terminal open!

**Option B - Use MongoDB Atlas (Cloud - Recommended):**
1. Go to https://mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string
4. Replace MONGODB_URI in `server\.env`

### ✅ Step 2: Start Backend Server

Open a **NEW** PowerShell terminal:
```powershell
cd "c:\Users\Krishna\OneDrive\Desktop\Silent-Auction\server"
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### ✅ Step 3: Start Frontend

Open **ANOTHER** PowerShell terminal:
```powershell
cd "c:\Users\Krishna\OneDrive\Desktop\Silent-Auction\client"
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

### ✅ Step 4: Open in Browser

1. Go to: **http://localhost:5173**
2. You should see the Silent Auction homepage!

## 🎯 First Time Setup

### Create Admin Account:
1. Click "Register"
2. Fill in:
   - Username: `admin`
   - Email: `admin@test.com`
   - Password: `admin123`
   - Role: **Admin**
3. Click Register

### Add Some Auction Items:
1. After login, click "Admin Panel" in navbar
2. Click "Add New Item"
3. Add a test item:
   ```
   Title: Vintage Camera
   Description: Classic 35mm camera in great condition
   Image URL: https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400
   Starting Bid: 50
   ```
4. Add 4-5 more items

### Test Bidding:
1. Open an **Incognito/Private window**
2. Go to http://localhost:5173
3. Register as a bidder:
   - Username: `bidder1`
   - Email: `bidder1@test.com`
   - Password: `bidder123`
   - Role: **Bidder**
4. Click on an item
5. Place a bid!
6. Watch real-time updates! ✨

## 📁 Project Structure

```
Silent-Auction/
├── client/          ← React Frontend
├── server/          ← Express Backend
├── README.md        ← Full documentation
├── SETUP.md         ← Detailed setup guide
└── DEPLOYMENT.md    ← How to deploy online
```

## 🎮 Features to Test

✅ **User Registration & Login**
- Register with Admin role
- Register with Bidder role

✅ **Browse Items**
- View all auction items
- Search items
- Filter by status

✅ **Place Bids**
- Click on item
- Enter bid amount
- See real-time updates

✅ **Admin Features**
- Add new items (max 30)
- Close auctions
- View winners
- Send email notifications

✅ **Real-time Updates**
- Open same item in 2 browsers
- Place bid in one
- See update in other instantly!

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
→ Make sure MongoDB is running (`mongod`) or use MongoDB Atlas

### "Port 5000 already in use"
→ Stop other servers or change PORT in server\.env

### "Module not found"
→ Run `npm install` in both client and server folders

### Real-time updates not working
→ Make sure both frontend and backend are running

## 📚 Documentation Files

- **README.md** - Complete project documentation
- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - How to deploy to production
- **QUICKSTART.md** - This file!

## 🎓 Next Steps

1. ✅ Test all features locally
2. 📹 Record video demonstration
3. 🚀 Deploy to production (see DEPLOYMENT.md)
4. 📦 Push to GitHub
5. 🎉 Submit your project!

## 📞 Need Help?

Check these files for more info:
- Detailed setup: **SETUP.md**
- Full documentation: **README.md**
- Deployment guide: **DEPLOYMENT.md**

## 🌟 Success Checklist

Before considering the project complete:

- [ ] Backend running successfully
- [ ] Frontend running successfully
- [ ] Can register users
- [ ] Can login
- [ ] Can add items (as admin)
- [ ] Can browse items
- [ ] Can place bids
- [ ] Real-time updates working
- [ ] Can close auctions
- [ ] Winners declared correctly
- [ ] Email configured (optional)
- [ ] Responsive design works
- [ ] No console errors

## 🎬 Video Demo Checklist

Record a video showing:
1. User registration (admin & bidder)
2. Admin adding items
3. Browsing items
4. Placing bids
5. Real-time bid updates
6. Admin closing auction
7. Winner declaration
8. Email notification process

---

**Everything is set up and ready to go! Just follow the 4 steps above to start. 🚀**

**Happy bidding! 🎉**
