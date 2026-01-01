# Quick Setup: Separate Deployments (RECOMMENDED)

The combined deployment is having routing issues. **Separate deployments are much more reliable.**

## ✅ Your Code is Already Ready!

Your `frontend/src/config/api.js` already supports separate deployments - it will use `VITE_API_URL` if set.

## Step-by-Step Setup

### 1. Create Backend Project (API Only)

1. **Vercel Dashboard** → "Add New Project"
2. **Import your GitHub repo** (same repo)
3. **Settings**:
   - **Name**: `healthcare-api`
   - **Root Directory**: `/` (root, leave empty)
   - **Framework**: Other
   - **Build Command**: (empty)
   - **Output Directory**: (empty)
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   MONGO_URI = your-mongodb-connection-string
   NODE_ENV = production
   FRONTEND_URL = (set after frontend deploys)
   ```

5. **Update `vercel.json` in your repo** (root level):
   ```json
   {
     "functions": {
       "api/index.js": {
         "runtime": "@vercel/node"
       }
     }
   }
   ```

6. **Deploy** → Note URL: `https://healthcare-api.vercel.app`

### 2. Create Frontend Project (Separate)

1. **Vercel Dashboard** → "Add New Project" (NEW project!)
2. **Import the SAME GitHub repo**
3. **Settings**:
   - **Name**: `healthcare-app`
   - **Root Directory**: `frontend` ⚠️ CRITICAL!
   - **Framework**: Vite
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://healthcare-api.vercel.app
   ```
   ⚠️ **No trailing slash!**

5. **Create `frontend/vercel.json`**:
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

6. **Deploy** → Note URL: `https://healthcare-app.vercel.app`

### 3. Update Backend CORS

1. Go to **Backend project** → Settings → Environment Variables
2. Add: `FRONTEND_URL` = `https://healthcare-app.vercel.app`
3. Backend will auto-redeploy

### 4. Test

- ✅ Backend: `https://healthcare-api.vercel.app/health`
- ✅ Backend: `https://healthcare-api.vercel.app/appointments`
- ✅ Frontend: `https://healthcare-app.vercel.app`

## Why This Works

- ✅ No routing conflicts
- ✅ Clear separation
- ✅ Easier debugging
- ✅ More reliable

## File Structure

```
/
├── api/index.js          # Backend function
├── backend/              # Backend code
├── frontend/
│   ├── vercel.json       # Frontend config (create this)
│   └── src/
└── vercel.json           # Backend config (update this)
```

That's it! This will work much better than the combined approach.

