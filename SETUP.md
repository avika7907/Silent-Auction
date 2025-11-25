# Silent Auction - Quick Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```powershell
cd server
npm install
```

**Frontend:**
```powershell
cd client
npm install
```

### Step 2: Setup Environment Variables

**Backend (.env):**
```powershell
cd server
copy .env.example .env
```

Edit `server/.env` - **Minimum required:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/silent-auction
JWT_SECRET=my_super_secret_key_12345
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# For email (optional for testing - emails will fail but app works)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@silentauction.com
```

**Frontend (.env):**
```powershell
cd client
copy .env.example .env
```

Content should be:
```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Start MongoDB

**Option A - Local MongoDB:**
```powershell
mongod
```

**Option B - Use MongoDB Atlas (Free Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Replace MONGODB_URI in server/.env

### Step 4: Run the Application

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```
✅ Server running at http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```
✅ App running at http://localhost:5173

### Step 5: Test the Application

1. **Open browser:** http://localhost:5173
2. **Register as Admin:**
   - Username: admin
   - Email: admin@test.com
   - Password: admin123
   - Role: Admin

3. **Go to Admin Panel** (button in navbar)

4. **Add Test Items** (add 5-10 items):
   ```
   Title: Vintage Watch
   Description: Beautiful antique pocket watch from 1920s
   Image URL: https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400
   Starting Bid: 50
   ```

5. **Register as Bidder:**
   - Open incognito window
   - Register with different email
   - Role: Bidder

6. **Place Bids:**
   - Browse items
   - Click on item
   - Enter bid amount
   - See real-time updates!

7. **Close Auction (as Admin):**
   - Go back to admin panel
   - Click "Close" on an item
   - Winner is automatically determined

8. **Send Emails (Optional):**
   - Configure email in .env
   - Click "Notify Winners"

## Default Test Accounts

Create these manually for testing:

**Admin:**
- Email: admin@test.com
- Password: admin123

**Bidder 1:**
- Email: bidder1@test.com
- Password: bidder123

**Bidder 2:**
- Email: bidder2@test.com
- Password: bidder123

## Sample Item Data

Use these for quick testing:

```json
{
  "title": "Vintage Camera",
  "description": "Classic 35mm film camera in excellent condition",
  "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
  "startingBid": 75
}

{
  "title": "Antique Books Set",
  "description": "Collection of rare first edition books",
  "imageUrl": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
  "startingBid": 100
}

{
  "title": "Art Deco Lamp",
  "description": "Beautiful 1930s table lamp with original shade",
  "imageUrl": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400",
  "startingBid": 60
}

{
  "title": "Vintage Vinyl Records",
  "description": "Collection of 20 classic jazz albums",
  "imageUrl": "https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=400",
  "startingBid": 45
}

{
  "title": "Classic Typewriter",
  "description": "Working Royal typewriter from 1950s",
  "imageUrl": "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=400",
  "startingBid": 80
}
```

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas (cloud database)
- Check MONGODB_URI in .env

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Email not sending"
**Solution:**
- App works without email configuration
- Emails are optional for testing
- To enable: Use Gmail App Password (not regular password)

### Issue: "Real-time updates not working"
**Solution:**
- Make sure both frontend and backend are running
- Check browser console for errors
- Refresh the page

## Project Features Checklist

✅ User Registration & Login
✅ JWT Authentication
✅ Admin & Bidder Roles
✅ Add/Delete Auction Items (Admin)
✅ Browse Items with Search
✅ Place Bids (with validation)
✅ Real-time Bid Updates
✅ Bid History Display
✅ Highlight Winning Bid
✅ Close Auction (Admin)
✅ Auto-declare Winners
✅ Email Notifications
✅ Responsive Design
✅ Clean UI with Tailwind CSS

## Next Steps

1. ✅ Test all features locally
2. 📝 Record video demonstration
3. 🚀 Deploy to production:
   - Backend → Render.com
   - Frontend → Vercel.com
   - Database → MongoDB Atlas
4. 📄 Submit project with:
   - GitHub repository link
   - Live application URL
   - Video demonstration
   - This documentation

## Need Help?

- Check the main README.md for detailed information
- Review API endpoints in the documentation
- Check console for error messages
- Ensure all dependencies are installed

## Development Tips

- Use React DevTools for debugging
- Check Network tab for API calls
- MongoDB Compass for database visualization
- Postman for API testing

Good luck with your project! 🚀
