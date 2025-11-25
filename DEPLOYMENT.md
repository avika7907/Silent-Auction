# Deployment Guide

## Prerequisites
- GitHub account
- Vercel/Netlify account (frontend)
- Render account (backend)
- MongoDB Atlas account (database)

## Step 1: Database Deployment (MongoDB Atlas)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Grant "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/silent-auction?retryWrites=true&w=majority`

## Step 2: Backend Deployment (Render)

1. **Push Code to GitHub**
   ```bash
   cd Silent-Auction
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the Silent-Auction repo

4. **Configure Service**
   ```
   Name: silent-auction-api
   Region: Choose closest
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables**
   Click "Environment" and add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_string
   JWT_EXPIRE=7d
   NODE_ENV=production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_FROM=noreply@silentauction.com
   CLIENT_URL=https://your-app-name.vercel.app
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your API URL (e.g., `https://silent-auction-api.onrender.com`)

## Step 3: Frontend Deployment (Vercel)

1. **Update Frontend Environment**
   - Edit `client/.env`
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **Commit Changes**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

3. **Deploy to Vercel**
   
   **Option A - Vercel CLI:**
   ```bash
   npm install -g vercel
   cd client
   vercel
   ```
   Follow prompts:
   - Login to Vercel
   - Link to existing project or create new
   - Root directory: `./client`
   - Build command: `npm run build`
   - Output directory: `dist`

   **Option B - Vercel Dashboard:**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     ```
     Root Directory: client
     Build Command: npm run build
     Output Directory: dist
     ```
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```
   - Click "Deploy"

4. **Get Your Live URL**
   - Copy the URL (e.g., `https://silent-auction.vercel.app`)

## Step 4: Update Backend CORS

1. **Update Backend Environment Variable**
   - Go to Render dashboard
   - Find your web service
   - Environment → Edit
   - Update `CLIENT_URL` to your Vercel URL
   - Save changes
   - Service will redeploy automatically

## Step 5: Test Deployment

1. **Open Frontend URL**
   - Visit your Vercel URL
   - Register new account
   - Login

2. **Test All Features**
   - ✅ User registration
   - ✅ Login
   - ✅ Browse items
   - ✅ Place bids
   - ✅ Real-time updates
   - ✅ Admin panel
   - ✅ Close auction
   - ✅ Email notifications

## Alternative: Netlify Deployment

Instead of Vercel, you can use Netlify:

```bash
cd client
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=dist
```

Or drag and drop the `dist` folder to Netlify's web interface.

## Troubleshooting

### CORS Errors
**Problem:** Frontend can't connect to backend

**Solution:**
- Ensure `CLIENT_URL` in backend .env matches frontend URL
- Update server.js CORS configuration if needed:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### Database Connection Failed
**Problem:** Can't connect to MongoDB Atlas

**Solution:**
- Check connection string is correct
- Verify password doesn't contain special characters (or URL encode them)
- Confirm IP whitelist includes 0.0.0.0/0

### Build Failures
**Problem:** Deployment fails during build

**Solution:**
- Check build logs for errors
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### WebSocket Connection Issues
**Problem:** Real-time updates not working

**Solution:**
- Render free tier supports WebSockets
- Check Socket.IO configuration matches production URLs
- Verify backend logs for connection attempts

## Post-Deployment Checklist

✅ Backend deployed and accessible
✅ Frontend deployed and accessible
✅ Database connected successfully
✅ User registration working
✅ Login working
✅ Items displaying correctly
✅ Bidding functional
✅ Real-time updates working
✅ Admin panel accessible
✅ Email notifications configured
✅ CORS configured correctly
✅ Environment variables set

## Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

## Monitoring & Maintenance

- **Render Dashboard**: Monitor backend logs and performance
- **Vercel Dashboard**: Check frontend deployment status
- **MongoDB Atlas**: Monitor database usage and performance
- **Set up alerts**: Configure Render/Vercel to notify you of issues

## Cost Considerations

- **MongoDB Atlas**: Free tier (512MB storage)
- **Render**: Free tier (750 hours/month, may sleep after 15min inactivity)
- **Vercel**: Free tier (unlimited deployments)

**Note:** Free tier on Render may cause first request to be slow (cold start). Consider upgrading for production use.

## Environment Variables Summary

### Backend (Render)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
EMAIL_FROM=noreply@silentauction.com
CLIENT_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-api.onrender.com
```

## Success! 🎉

Your Silent Auction application is now live and accessible worldwide!

Share your deployment URLs:
- **Frontend**: https://silent-auction.vercel.app
- **Backend**: https://silent-auction-api.onrender.com
- **GitHub**: https://github.com/yourusername/silent-auction
