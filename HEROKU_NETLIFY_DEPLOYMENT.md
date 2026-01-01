# Deployment Guide - Heroku (Backend) + Netlify (Frontend)

This guide will help you deploy your MERN stack Healthcare Appointment System using:
- **Heroku** for the Node.js/Express backend
- **Netlify** for the React frontend

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (or MongoDB connection string)
- Heroku account (sign up at [heroku.com](https://heroku.com))
- Netlify account (sign up at [netlify.com](https://netlify.com))
- Heroku CLI (optional, for CLI deployment)

## Step 1: Prepare Your MongoDB Database

1. **MongoDB Atlas Setup** (if not already done):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/healthcare-appointments`
   - Add `0.0.0.0/0` to IP Whitelist (allows connections from anywhere)

## Step 2: Deploy Backend to Heroku

### Option A: Using Heroku Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Heroku and Netlify deployment"
   git push origin main
   ```

2. **Create Heroku App**:
   - Go to [heroku.com](https://heroku.com) and sign in
   - Click "New" → "Create new app"
   - Choose an app name (e.g., `healthcare-appointments-api`)
   - Select a region (US or Europe)
   - Click "Create app"

3. **Connect to GitHub**:
   - In your app dashboard, go to "Deploy" tab
   - Under "Deployment method", select "GitHub"
   - Connect your GitHub account if not already connected
   - Search for and select your repository
   - Click "Connect"

4. **Set Environment Variables**:
   - Go to "Settings" tab
   - Click "Reveal Config Vars"
   - Add the following:
     - `MONGO_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Netlify URL (you'll update this after deploying frontend)
     - Note: `PORT` is automatically set by Heroku

5. **Deploy**:
   - Go to "Deploy" tab
   - Under "Manual deploy", select your branch (usually `main`)
   - Click "Deploy Branch"
   - Wait for deployment to complete
   - Note your Heroku backend URL (e.g., `https://your-app-name.herokuapp.com`)

6. **Enable Automatic Deploys** (Optional):
   - In "Deploy" tab, under "Automatic deploys"
   - Select your branch
   - Click "Enable Automatic Deploys"

### Option B: Using Heroku CLI

1. **Install Heroku CLI**:
   - Download from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
   - Or use: `npm install -g heroku`

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```
   (Replace `your-app-name` with your desired app name, or leave blank for auto-generated name)

4. **Set Environment Variables**:
   ```bash
   heroku config:set MONGO_URI="your-mongodb-connection-string"
   heroku config:set NODE_ENV="production"
   heroku config:set FRONTEND_URL="your-netlify-url"
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```
   (If your default branch is `master`, use `git push heroku master`)

6. **Open Your App**:
   ```bash
   heroku open
   ```

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
     - `VITE_API_URL`: Your Heroku backend URL (e.g., `https://your-app-name.herokuapp.com`)
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
   netlify env:set VITE_API_URL "https://your-heroku-backend.herokuapp.com"
   ```

## Step 4: Update Backend CORS Settings

After deploying the frontend, update the Heroku backend:

1. **Update Environment Variable**:
   - Go to Heroku dashboard → Your app → Settings
   - Click "Reveal Config Vars"
   - Update `FRONTEND_URL` to your Netlify URL
   - Heroku will automatically restart the app

   Or using CLI:
   ```bash
   heroku config:set FRONTEND_URL="https://your-app.netlify.app"
   ```

## Step 5: Verify Deployment

1. **Test Backend**:
   - Visit: `https://your-app-name.herokuapp.com/api/health`
   - Should return: `{"status":"ok","message":"API is running",...}`

2. **Test Frontend**:
   - Visit your Netlify URL
   - Open browser DevTools → Network tab
   - Try creating an appointment
   - Verify API calls are going to Heroku backend

3. **Test Full Flow**:
   - Create a provider
   - Create an appointment
   - Verify data persists in MongoDB

## Troubleshooting

### Backend Issues

**Issue**: Heroku build fails
- **Solution**: 
  - Check build logs: `heroku logs --tail` or in Heroku dashboard
  - Verify all dependencies are in `package.json` (not just `devDependencies`)
  - Ensure Node.js version is compatible (Heroku uses Node 18+ by default)
  - Check that `Procfile` exists and is correct

**Issue**: App crashes on startup
- **Solution**:
  - Check logs: `heroku logs --tail`
  - Verify `MONGO_URI` is set correctly
  - Ensure MongoDB Atlas allows connections from Heroku (IP whitelist `0.0.0.0/0`)
  - Verify `PORT` is not hardcoded (Heroku sets this automatically)

**Issue**: Database connection fails
- **Solution**:
  - Verify `MONGO_URI` is set correctly in Heroku config vars
  - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
  - Ensure database user has proper permissions
  - Check connection string format is correct

**Issue**: CORS errors
- **Solution**:
  - Verify `FRONTEND_URL` is set to your Netlify URL
  - Check backend logs for CORS-related errors
  - Ensure Netlify URL is in allowed origins
  - Restart Heroku app: `heroku restart`

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
  - Verify Heroku backend is running and accessible
  - Check browser console for specific error messages
  - Ensure CORS is configured correctly in backend

**Issue**: Frontend shows blank page
- **Solution**:
  - Check browser console for errors
  - Verify `netlify.toml` redirects are configured
  - Check that `frontend/dist` folder exists after build
  - Verify environment variables are set correctly

### Environment Variables

**Backend (Heroku)**:
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Netlify frontend URL | `https://your-app.netlify.app` |
| `PORT` | Server port | Auto-set by Heroku (don't set manually) |

**Frontend (Netlify)**:
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Heroku backend URL | `https://your-app-name.herokuapp.com` |

## Updating Your Deployment

### Backend Updates (Heroku)
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Backend update"
   git push origin main
   ```
2. If automatic deploys are enabled, Heroku will redeploy automatically
3. Or manually deploy: `git push heroku main`

### Frontend Updates (Netlify)
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Frontend update"
   git push origin main
   ```
2. Netlify automatically redeploys on push

## Custom Domains

### Heroku (Backend)
1. Go to Heroku dashboard → Your app → Settings
2. Click "Add domain"
3. Enter your custom domain
4. Follow DNS configuration instructions
5. Update `FRONTEND_URL` if needed

### Netlify (Frontend)
1. Go to Netlify dashboard → Your site → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` in Heroku after domain is active

## Free Tier Limitations

### Heroku
- **550-1000 free dyno hours** per month (shared across all apps)
- Apps sleep after 30 minutes of inactivity (free tier)
- **Cold starts**: First request after sleep may take 10-30 seconds
- Limited to 1 web dyno on free tier

**Upgrade to Eco Dyno ($5/month)** for:
- Always-on service (no sleep)
- Faster response times
- More reliable performance

### Netlify
- **100GB bandwidth** per month
- **300 build minutes** per month
- Unlimited sites on free tier

## Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Check config vars
heroku config

# Set config var
heroku config:set KEY=value

# Restart app
heroku restart

# Open app in browser
heroku open

# Run one-off commands
heroku run node backend/seed.js

# Scale dynos (requires paid plan)
heroku ps:scale web=1
```

## Additional Resources

- [Heroku Documentation](https://devcenter.heroku.com)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)

## Notes

- Heroku automatically provides HTTPS
- Netlify automatically provides HTTPS
- Health checks are available at `/api/health`
- Frontend uses environment variables for API URL
- CORS is configured to allow Netlify domains
- Both platforms support automatic deployments from GitHub
- Heroku free tier apps sleep after inactivity (consider Eco dyno for production)

