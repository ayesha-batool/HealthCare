# Deployment Guide - Render (Backend) + Netlify (Frontend)

This guide will help you deploy your MERN stack Healthcare Appointment System using:
- **Render** for the Node.js/Express backend
- **Netlify** for the React frontend

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (or MongoDB connection string)
- Render account (sign up at [render.com](https://render.com))
- Netlify account (sign up at [netlify.com](https://netlify.com))

## Step 1: Prepare Your MongoDB Database

1. **MongoDB Atlas Setup** (if not already done):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/healthcare-appointments`
   - Add `0.0.0.0/0` to IP Whitelist (allows connections from anywhere)

## Step 2: Deploy Backend to Render

### Option A: Using Render Blueprint (Recommended - Easiest)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Render and Netlify deployment"
   git push origin main
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" → "Blueprint"
   - Connect your GitHub account if not already connected
   - Select your repository

3. **Render will automatically detect `render.yaml`**:
   - The blueprint will create a web service with the configuration from `render.yaml`
   - Review the settings and click "Apply"

4. **Set Environment Variables**:
   - In the service settings, go to "Environment"
   - Add the following environment variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production` (already set in render.yaml)
     - `FRONTEND_URL`: Your Netlify URL (you'll update this after deploying frontend)
     - `PORT`: `10000` (already set in render.yaml)

5. **Deploy**:
   - Click "Apply" to start the deployment
   - Render will build and deploy your application
   - Wait for deployment to complete
   - Note your Render backend URL (e.g., `https://healthcare-appointments-api.onrender.com`)

### Option B: Manual Setup (Without Blueprint)

1. **Create a New Web Service**:
   - Go to [render.com](https://render.com) dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**:
   - **Name**: `healthcare-appointments-api` (or your preferred name)
   - **Region**: `Oregon` (or closest to your users)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (root of repo)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**:
   - Go to "Environment" tab
   - Add:
     - `MONGO_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Netlify URL (set after frontend deployment)
     - `PORT`: `10000` (Render sets this automatically, but you can specify)

4. **Deploy**:
   - Click "Create Web Service"
   - Render will start building and deploying

## Step 3: Deploy Frontend to Netlify

### Option A: Using Netlify Dashboard

1. **Create Netlify Site**:
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

2. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
   - These are already configured in `netlify.toml`

3. **Set Environment Variables**:
   - Go to "Site settings" → "Environment variables"
   - Click "Add variable"
   - Add:
     - `VITE_API_URL`: Your Render backend URL (e.g., `https://healthcare-appointments-api.onrender.com`)
     - Make sure to include the full URL without trailing slash

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your frontend
   - Note your Netlify URL (e.g., `https://your-app.netlify.app`)

### Option B: Using Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**:
   ```bash
   cd frontend
   netlify init
   netlify deploy --prod
   ```

4. **Set Environment Variables**:
   ```bash
   netlify env:set VITE_API_URL "https://healthcare-appointments-api.onrender.com"
   ```

## Step 4: Update Backend CORS Settings

After deploying the frontend, update the Render backend:

1. **Update Environment Variable**:
   - Go to Render dashboard → Your service → Environment
   - Update `FRONTEND_URL` to your Netlify URL
   - Render will automatically redeploy

## Step 5: Verify Deployment

1. **Test Backend**:
   - Visit: `https://healthcare-appointments-api.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"API is running",...}`

2. **Test Frontend**:
   - Visit your Netlify URL
   - Open browser DevTools → Network tab
   - Try creating an appointment
   - Verify API calls are going to Render backend

3. **Test Full Flow**:
   - Create a provider
   - Create an appointment
   - Verify data persists in MongoDB

## Troubleshooting

### Backend Issues

**Issue**: Render build fails
- **Solution**: 
  - Check build logs in Render dashboard
  - Verify all dependencies are in `package.json`
  - Ensure Node.js version is compatible (Render uses Node 18+ by default)
  - Check that `render.yaml` is correctly formatted

**Issue**: App crashes on startup
- **Solution**: 
  - Check service logs in Render dashboard
  - Verify `MONGO_URI` is set correctly
  - Ensure MongoDB Atlas allows connections from Render (IP whitelist)
  - Verify `PORT` is set to `10000` or let Render handle it automatically

**Issue**: Database connection fails
- **Solution**:
  - Verify MongoDB connection string is correct
  - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
  - Ensure database user has proper permissions
  - Check connection string format is correct

**Issue**: CORS errors
- **Solution**:
  - Verify `FRONTEND_URL` is set to your Netlify URL
  - Check backend logs for CORS-related errors
  - Ensure Netlify URL is in allowed origins
  - Restart Render service if needed

### Frontend Issues

**Issue**: Netlify build fails
- **Solution**:
  - Check build logs in Netlify dashboard
  - Verify `frontend/package.json` has all dependencies
  - Ensure Vite configuration is correct
  - Check that base directory is set to `frontend`

**Issue**: API calls fail (404 or CORS)
- **Solution**:
  - Verify `VITE_API_URL` is set correctly in Netlify
  - Check that the URL includes `https://` and no trailing slash
  - Verify Render backend is running and accessible
  - Check browser console for specific error messages
  - Ensure CORS is configured correctly in backend

**Issue**: Frontend shows blank page
- **Solution**:
  - Check browser console for errors
  - Verify `netlify.toml` redirects are configured
  - Check that `frontend/dist` folder exists after build
  - Verify environment variables are set correctly

### Environment Variables

**Backend (Render)**:
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Netlify frontend URL | `https://your-app.netlify.app` |
| `PORT` | Server port | `10000` (set in render.yaml) |

**Frontend (Netlify)**:
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Render backend URL | `https://healthcare-appointments-api.onrender.com` |

## Updating Your Deployment

### Backend Updates (Render)
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Backend update"
   git push origin main
   ```
2. Render automatically redeploys on push (if auto-deploy is enabled)
3. Or manually trigger deployment from Render dashboard

### Frontend Updates (Netlify)
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Frontend update"
   git push origin main
   ```
2. Netlify automatically redeploys on push

## Custom Domains

### Render (Backend)
1. Go to Render dashboard → Your service → Settings
2. Click "Custom Domains"
3. Add your domain
4. Follow Render's DNS configuration instructions
5. Update `FRONTEND_URL` if needed

### Netlify (Frontend)
1. Go to Netlify dashboard → Your site → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` in Render after domain is active

## Free Tier Limitations

### Render
- **Spinning Down**: Free tier services spin down after 15 minutes of inactivity
- **Cold Starts**: First request after spin-down may take 30-60 seconds
- **Build Time**: Limited build time per month
- **Bandwidth**: Limited bandwidth per month

**Upgrade to Paid Plan** for:
- Always-on services (no spin-down)
- Faster cold starts
- More resources
- Better performance

### Netlify
- **100GB bandwidth** per month
- **300 build minutes** per month
- Unlimited sites on free tier

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Notes

- Render automatically provides HTTPS
- Netlify automatically provides HTTPS
- Health checks are available at `/api/health`
- Frontend uses environment variables for API URL
- CORS is configured to allow Netlify domains
- Both platforms support automatic deployments from GitHub
- Render free tier services spin down after inactivity (first request may be slow)

