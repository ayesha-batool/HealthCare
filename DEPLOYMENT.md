# Deployment Guide - Vercel

## Prerequisites
- GitHub repository connected
- MongoDB Atlas account (or MongoDB connection string)
- Vercel account

## Step 1: Prepare Environment Variables

Before deploying, you need to set up environment variables in Vercel:

1. **MONGO_URI** - Your MongoDB connection string
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/healthcare-appointments`
   - For local: `mongodb://localhost:27017/healthcare-appointments`

2. **NODE_ENV** - Set to `production`

3. **PORT** - Vercel will handle this automatically

## Step 2: Deploy via Vercel Dashboard

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `ayesha-batool/HealthCare`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as is (root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install && cd frontend && npm install`

5. Add Environment Variables:
   - Go to Settings → Environment Variables
   - Add:
     - `MONGO_URI` = your MongoDB connection string
     - `NODE_ENV` = `production`

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables:
   ```bash
   vercel env add MONGO_URI
   vercel env add NODE_ENV
   ```

5. Deploy to production:
   ```bash
   vercel --prod
   ```

## Step 3: Update Frontend API URLs (if needed)

The frontend is configured to use `/api` which will work with Vercel's routing. No changes needed if using the provided configuration.

## Step 4: Verify Deployment

1. Check your Vercel dashboard for the deployment URL
2. Test the API: `https://your-app.vercel.app/api/health`
3. Test the frontend: `https://your-app.vercel.app`

## Troubleshooting

### API Routes Not Working
- Ensure `api/index.js` exists and exports the Express app
- Check Vercel function logs in the dashboard
- Verify environment variables are set correctly

### Database Connection Issues
- Verify `MONGO_URI` is set correctly in Vercel
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
- Ensure MongoDB connection string is correct

### Build Errors
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (Vercel uses Node 18+ by default)

## Alternative: Separate Deployments

If you prefer to deploy frontend and backend separately:

### Frontend Only (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Update API URLs in frontend to point to backend URL

### Backend Only (Vercel or Other Platform)
- Deploy backend as serverless functions
- Or use Render/Railway for traditional Node.js hosting
- Update frontend API URLs accordingly

## Notes

- Vercel automatically handles HTTPS
- Serverless functions have cold starts (first request may be slower)
- Free tier has limitations on function execution time
- Consider using MongoDB Atlas for production database

