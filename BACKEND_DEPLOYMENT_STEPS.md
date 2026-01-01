# Backend-Only Deployment Steps

You're deploying the **backend/API only**. Here's the correct configuration:

## Vercel Project Settings

1. **Project Name**: `healthcare-api` (or your choice)
2. **Root Directory**: `/` (leave empty - root of repo)
3. **Framework Preset**: Other
4. **Build Command**: (leave EMPTY - no build needed for API)
5. **Output Directory**: (leave EMPTY)
6. **Install Command**: `npm install`

## Environment Variables

- `MONGO_URI` = Your MongoDB connection string
- `NODE_ENV` = `production`
- `FRONTEND_URL` = (set after frontend deploys)

## vercel.json

The root `vercel.json` should be:
```json
{
  "functions": {
    "api/index.js": {
      "runtime": "@vercel/node"
    }
  }
}
```

**NO build commands!** The backend doesn't need to build anything.

## What Happened

The error `cd frontend: No such file or directory` happened because:
- The `vercel.json` had `buildCommand: "cd frontend && ..."`
- But this is a backend-only deployment
- Backend doesn't need to build frontend

## Fixed

I've updated `vercel.json` to be backend-only. Now:
1. Push the changes
2. Redeploy on Vercel
3. It should work!

## Test After Deploy

- `https://your-backend.vercel.app/health` → Should return JSON
- `https://your-backend.vercel.app/appointments` → Should return appointments

