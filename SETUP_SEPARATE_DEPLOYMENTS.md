# Quick Setup: Separate Frontend and Backend on Vercel

Since the combined deployment is having routing issues, let's set up **separate deployments** - this is more reliable and easier to debug.

## Step 1: Deploy Backend (API) First

### Create Backend Project on Vercel:

1. **Go to Vercel Dashboard** → "Add New Project"
2. **Import your GitHub repository** (same repo)
3. **Project Settings**:
   - **Project Name**: `healthcare-api` (or your choice)
   - **Root Directory**: `/` (leave empty - root)
   - **Framework Preset**: Other
   - **Build Command**: (leave empty - no build needed)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

4. **Environment Variables**:
   - `MONGO_URI` = Your MongoDB connection string
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = (we'll set this after frontend deploys)

5. **Create `vercel.json` for Backend**:
   In your repo root, create/update `vercel.json`:
   ```json
   {
     "functions": {
       "api/index.js": {
         "runtime": "@vercel/node"
       }
     }
   }
   ```

6. **Deploy** and note your backend URL: `https://healthcare-api.vercel.app`

## Step 2: Update Backend CORS

The backend already has CORS configured, but make sure `FRONTEND_URL` is set after frontend deploys.

## Step 3: Deploy Frontend

### Create Frontend Project on Vercel:

1. **Go to Vercel Dashboard** → "Add New Project" (NEW project, not the backend one)
2. **Import the SAME GitHub repository**
3. **Project Settings**:
   - **Project Name**: `healthcare-app` (or your choice)
   - **Root Directory**: `frontend` ⚠️ IMPORTANT!
   - **Framework Preset**: Vite (or Other)
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   - `VITE_API_URL` = `https://healthcare-api.vercel.app` ⚠️ No trailing slash!

5. **Create `vercel.json` for Frontend**:
   In `frontend/` folder, create `vercel.json`:
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

6. **Deploy** and note your frontend URL: `https://healthcare-app.vercel.app`

## Step 4: Update Backend with Frontend URL

1. Go to **Backend Vercel project** → Settings → Environment Variables
2. Add/Update: `FRONTEND_URL` = `https://healthcare-app.vercel.app`
3. Redeploy backend (or it will auto-redeploy)

## Step 5: Test

1. **Backend**: `https://healthcare-api.vercel.app/health` → Should return JSON
2. **Backend**: `https://healthcare-api.vercel.app/appointments` → Should return appointments
3. **Frontend**: `https://healthcare-app.vercel.app` → Should load and connect to backend

## Why This Works Better

✅ **No routing conflicts** - Each project handles its own routes  
✅ **Easier debugging** - Clear separation of logs  
✅ **Better performance** - Frontend is pure static  
✅ **Independent scaling** - Scale each separately  
✅ **Simpler configuration** - No complex rewrite rules  

## Current File Structure

Your repo should have:
```
/
├── api/
│   └── index.js          # Backend serverless function
├── backend/              # Backend code
├── frontend/
│   ├── src/
│   ├── dist/             # Built frontend
│   └── vercel.json       # Frontend Vercel config (create this)
├── vercel.json           # Backend Vercel config
└── package.json
```

## Troubleshooting

### Backend returns 404
- Check `api/index.js` exists and exports Express app
- Verify `vercel.json` has functions config
- Check function logs in Vercel dashboard

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly (no trailing slash)
- Check CORS in backend allows frontend URL
- Check browser console for CORS errors

### Build errors
- Backend: Usually no build needed
- Frontend: Check `frontend/package.json` has all dependencies

This setup is much more reliable than trying to combine both in one deployment!

