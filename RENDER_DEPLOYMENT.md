# Deployment Guide - Render

This guide will help you deploy your MERN stack Healthcare Appointment System to Render.

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (or MongoDB connection string)
- Render account (sign up at [render.com](https://render.com))

## Step 1: Prepare Your MongoDB Database

1. **MongoDB Atlas Setup** (if not already done):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/healthcare-appointments`
   - Add `0.0.0.0/0` to IP Whitelist (allows connections from anywhere)

## Step 2: Deploy to Render

### Option A: Using Render Blueprint (Recommended - Easiest)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
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
     - `PORT`: `10000` (already set in render.yaml)

5. **Deploy**:
   - Click "Apply" to start the deployment
   - Render will build and deploy your application

### Option B: Manual Setup (Without Blueprint)

1. **Create a New Web Service**:
   - Go to [render.com](https://render.com) dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**:
   - **Name**: `healthcare-appointments` (or your preferred name)
   - **Region**: `Oregon` (or closest to your users)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (root of repo)
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd frontend && npm install && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**:
   - Go to "Environment" tab
   - Add:
     - `MONGO_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render sets this automatically, but you can specify)

4. **Deploy**:
   - Click "Create Web Service"
   - Render will start building and deploying

## Step 3: Verify Deployment

1. **Check Build Logs**:
   - Wait for the build to complete
   - Check for any errors in the build logs

2. **Test Your Application**:
   - Visit your Render URL: `https://your-app-name.onrender.com`
   - Test the API: `https://your-app-name.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"API is running",...}`

3. **Test Frontend**:
   - Navigate to your app URL
   - Try creating an appointment
   - Check if providers load correctly

## Step 4: Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain
   - Follow Render's DNS configuration instructions

## Troubleshooting

### Build Fails

**Issue**: Build command fails
- **Solution**: Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (Render uses Node 18+ by default)

**Issue**: Frontend build fails
- **Solution**: Check `frontend/package.json` for all dependencies
- Verify Vite configuration is correct

### Application Crashes

**Issue**: App crashes on startup
- **Solution**: 
  - Check service logs in Render dashboard
  - Verify `MONGO_URI` is set correctly
  - Ensure MongoDB Atlas allows connections from Render (IP whitelist)

**Issue**: Database connection fails
- **Solution**:
  - Verify MongoDB connection string is correct
  - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
  - Ensure database user has proper permissions

### API Routes Not Working

**Issue**: `/api/*` routes return 404
- **Solution**: 
  - Verify routes are defined in `backend/index.js`
  - Check that API routes are mounted before static file serving
  - Review service logs for routing errors

### Frontend Not Loading

**Issue**: Frontend shows blank page or errors
- **Solution**:
  - Verify `frontend/dist` folder exists after build
  - Check browser console for errors
  - Ensure static file serving is configured in `backend/index.js`

### CORS Errors

**Issue**: CORS errors in browser console
- **Solution**: 
  - CORS is already configured in `backend/index.js`
  - If issues persist, check the CORS middleware configuration

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` (Render sets this automatically) |

## Render Free Tier Limitations

- **Spinning Down**: Free tier services spin down after 15 minutes of inactivity
- **Cold Starts**: First request after spin-down may take 30-60 seconds
- **Build Time**: Limited build time per month
- **Bandwidth**: Limited bandwidth per month

**Upgrade to Paid Plan** for:
- Always-on services (no spin-down)
- Faster cold starts
- More resources
- Better performance

## Updating Your Deployment

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

2. **Render will automatically redeploy**:
   - Render watches your GitHub repository
   - Automatic deployments on push to main branch
   - Manual deployments available in dashboard

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Notes

- Render automatically provides HTTPS
- Health checks are configured at `/api/health`
- Static files are served from `frontend/dist` in production
- API routes are prefixed with `/api`
- Frontend uses relative URLs, so it works automatically with the same domain

