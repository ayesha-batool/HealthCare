# Deployment Guide - Vercel

This guide will help you deploy your MERN stack Healthcare Appointment System to Vercel. Vercel will host both your frontend (React) and backend (Express API) on the same domain.

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (or MongoDB connection string)
- Vercel account (sign up at [vercel.com](https://vercel.com))

## Step 1: Prepare Your MongoDB Database

1. **MongoDB Atlas Setup** (if not already done):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/healthcare-appointments`
   - Add `0.0.0.0/0` to IP Whitelist (allows connections from anywhere)

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Create Vercel Project**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Select your repository

3. **Configure the Project**:
   - Vercel will auto-detect settings from `vercel.json`
   - If needed, manually configure:
     - **Framework Preset**: Other
     - **Root Directory**: Leave as is (root)
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Output Directory**: `frontend/dist`
     - **Install Command**: `npm install && cd frontend && npm install`

4. **Set Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add the following:
     - `MONGO_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`
     - Note: `PORT` is not needed (Vercel handles this automatically)

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at: `https://your-app.vercel.app`

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project settings

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGO_URI
   vercel env add NODE_ENV
   ```
   - Enter the values when prompted

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

1. **Test API Endpoints**:
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"API is running",...}`
   - Visit: `https://your-app.vercel.app/api/`
   - Should return: `{"message":"Healthcare Appointment System API","version":"1.0.0"}`

2. **Test Frontend**:
   - Visit: `https://your-app.vercel.app`
   - Open browser DevTools → Network tab
   - Try creating an appointment
   - Verify API calls are working (should go to `/api/*` endpoints)

3. **Test Full Flow**:
   - Create a provider
   - Create an appointment
   - Verify data persists in MongoDB

## How It Works

### API Routes
- All API routes are handled by `api/index.js`
- Vercel automatically routes `/api/*` requests to serverless functions
- The Express app in `api/index.js` handles all API endpoints

### Frontend
- Frontend is built and served as static files from `frontend/dist`
- React Router handles client-side routing
- API calls use relative URLs (`/api/*`) since everything is on the same domain

### Routing
- `/api/*` → Serverless function (`api/index.js`)
- `/*` → Frontend React app (SPA routing)

## Troubleshooting

### Build Fails

**Issue**: Build command fails
- **Solution**: 
  - Check build logs in Vercel dashboard
  - Verify all dependencies are in `package.json` and `frontend/package.json`
  - Ensure Node.js version is compatible (Vercel uses Node 18+ by default)
  - Check that `vercel.json` is correctly formatted

**Issue**: Frontend build fails
- **Solution**:
  - Check build logs in Vercel dashboard
  - Verify `frontend/package.json` has all dependencies
  - Ensure Vite configuration is correct
  - Check for any build errors in the logs

### API Routes Not Working

**Issue**: `/api/*` routes return 404
- **Solution**: 
  - Ensure `api/index.js` exists and exports the Express app
  - Check `vercel.json` has correct rewrite rules
  - Verify the file structure matches Vercel's expectations
  - Check Vercel function logs in the dashboard

**Issue**: API returns errors
- **Solution**:
  - Check Vercel function logs in dashboard
  - Verify `MONGO_URI` environment variable is set correctly
  - Ensure MongoDB Atlas allows connections from Vercel (IP whitelist)
  - Check database connection string format

### Database Connection Issues

**Issue**: Database connection fails
- **Solution**:
  - Verify `MONGO_URI` is set correctly in Vercel environment variables
  - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
  - Ensure database user has proper permissions
  - Check connection string format is correct
  - Note: Serverless functions may have connection pooling issues - the code uses connection caching

**Issue**: Cold start connection errors
- **Solution**:
  - The `api/index.js` uses connection caching for serverless environments
  - First request after inactivity may be slower (cold start)
  - Consider using MongoDB connection pooling options

### Frontend Issues

**Issue**: Frontend shows blank page
- **Solution**:
  - Check browser console for errors
  - Verify `vercel.json` rewrite rules are correct
  - Ensure `frontend/dist` folder exists after build
  - Check that React Router is configured correctly

**Issue**: API calls fail
- **Solution**:
  - Verify API calls use relative URLs (`/api/*`)
  - Check browser console for CORS errors (shouldn't happen on same domain)
  - Verify API endpoints are accessible
  - Check Vercel function logs

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NODE_ENV` | Environment mode | `production` |

**Note**: `PORT` is automatically handled by Vercel - do not set it manually.

## Updating Your Deployment

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

2. **Vercel automatically redeploys**:
   - Vercel watches your GitHub repository
   - Automatic deployments on push to main branch
   - Preview deployments for pull requests

## Custom Domains

1. **Add Custom Domain**:
   - Go to Vercel dashboard → Your project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - HTTPS is enabled by default

## Vercel Free Tier Limitations

- **100GB bandwidth** per month
- **100 serverless function invocations** per day (hobby plan)
- **Unlimited** deployments
- **Preview deployments** for every push/PR

**Upgrade to Pro Plan** for:
- More serverless function invocations
- More bandwidth
- Team collaboration features
- Advanced analytics

## Project Structure

```
.
├── api/
│   └── index.js          # Express app for serverless functions
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
├── frontend/
│   ├── src/
│   ├── dist/             # Built frontend (generated)
│   └── package.json
├── vercel.json           # Vercel configuration
└── package.json
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)

## Notes

- Vercel automatically provides HTTPS
- Serverless functions have cold starts (first request may be slower)
- Database connections are cached to improve performance
- All API routes are prefixed with `/api`
- Frontend and backend are on the same domain (no CORS issues)
- Automatic deployments on every push to main branch
- Preview deployments for pull requests

## Common Commands

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Add environment variable
vercel env add MONGO_URI

# Remove environment variable
vercel env rm MONGO_URI
```

