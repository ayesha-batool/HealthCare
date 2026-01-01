# Vercel Separate Deployment Guide

This guide shows how to deploy your frontend and backend as **separate Vercel projects**. This approach is **recommended** because it's:
- ✅ Easier to debug
- ✅ More reliable
- ✅ Better separation of concerns
- ✅ Independent scaling
- ✅ Easier to manage

## Architecture

- **Frontend**: Separate Vercel project (static site)
- **Backend**: Separate Vercel project (serverless functions)
- **Communication**: Frontend calls backend via API URL

## Step 1: Deploy Backend (API) to Vercel

### Option A: Create Backend-Only Project

1. **Create a new Vercel project**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - **Project Name**: `healthcare-api` (or your choice)

2. **Configure Backend Project**:
   - **Root Directory**: Leave empty (root)
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (no build needed for API)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - **DO NOT SET** `PORT` (Vercel handles this)

4. **Create `vercel.json` for Backend**:
   Create a file `vercel-backend.json` (we'll rename it):
   ```json
   {
     "functions": {
       "api/index.js": {
         "runtime": "@vercel/node"
       }
     }
   }
   ```

5. **Deploy**:
   - Click "Deploy"
   - Note your backend URL: `https://healthcare-api.vercel.app`

### Option B: Use Existing Backend Structure

If you want to keep everything in one repo but deploy separately:

1. Create a new Vercel project pointing to the same repo
2. Set **Root Directory** to root (same as current)
3. Configure as above
4. The `api/` folder will be automatically detected

## Step 2: Update Backend CORS

Update `api/index.js` to allow your frontend domain:

```javascript
// CORS - Allow frontend domain
app.use((req, res, next) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:5173', // Development
        'http://localhost:3000'  // Development
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
```

## Step 3: Deploy Frontend to Vercel

1. **Create a new Vercel project**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - **Project Name**: `healthcare-app` (or your choice)

2. **Configure Frontend Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (or Other)
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - `VITE_API_URL`: Your backend URL (e.g., `https://healthcare-api.vercel.app`)
   - **Important**: No trailing slash!

4. **Create `vercel.json` for Frontend**:
   Create `vercel-frontend.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

5. **Deploy**:
   - Click "Deploy"
   - Note your frontend URL: `https://healthcare-app.vercel.app`

## Step 4: Update Frontend API Configuration

Update `frontend/src/config/api.js`:

```javascript
// API Configuration
const getApiUrl = () => {
  // Use environment variable in production
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Development: use proxy or localhost
  return import.meta.env.DEV ? 'http://localhost:5000' : '';
}

export const API_URL = getApiUrl();

export const apiEndpoint = (path) => {
  const baseUrl = API_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
```

## Step 5: Update Backend Environment Variables

After deploying frontend, update backend:

1. Go to Backend Vercel project → Settings → Environment Variables
2. Add `FRONTEND_URL`: Your frontend URL (e.g., `https://healthcare-app.vercel.app`)
3. Redeploy backend

## Alternative: Monorepo with Separate Deployments

If you want to keep everything in one repo but deploy separately:

### Backend Project Configuration:
- **Root Directory**: `/` (root)
- **Build Command**: (empty or `npm install`)
- **Output Directory**: (empty)
- Files: `api/`, `backend/`, `package.json`

### Frontend Project Configuration:
- **Root Directory**: `/frontend`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`
- Files: `frontend/` folder

## Benefits of Separate Deployments

1. **Independent Scaling**: Scale frontend and backend separately
2. **Easier Debugging**: Clear separation of logs and errors
3. **Better Performance**: Frontend is pure static (faster)
4. **Flexibility**: Can deploy frontend/backend independently
5. **Cost Optimization**: Only pay for what you use
6. **No Routing Conflicts**: No need to handle `/api/*` routing

## Testing

1. **Test Backend**:
   - `https://healthcare-api.vercel.app/health`
   - `https://healthcare-api.vercel.app/appointments`

2. **Test Frontend**:
   - `https://healthcare-app.vercel.app`
   - Check browser console for API calls
   - Verify API calls go to backend URL

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` is set in backend
- Check CORS middleware allows your frontend domain
- Ensure no trailing slash in URLs

### API Not Found
- Verify `VITE_API_URL` is set correctly in frontend
- Check backend is deployed and accessible
- Verify environment variables are set

### Build Errors
- Backend: Usually no build needed
- Frontend: Check `frontend/package.json` has all dependencies

## Recommended Setup

**Backend Project**:
- Name: `healthcare-api`
- Root: `/` (or create separate backend folder)
- Environment: `MONGO_URI`, `NODE_ENV`, `FRONTEND_URL`

**Frontend Project**:
- Name: `healthcare-app`
- Root: `/frontend`
- Environment: `VITE_API_URL`

This setup is much cleaner and easier to maintain!

