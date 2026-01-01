# Quick Fix for Vercel 404 Error

## Issues Found in Your Vercel Configuration

Based on your deployment screenshot, here are the issues:

### 1. Environment Variables - FIX THESE:

**Remove these environment variables:**
- ❌ `PORT` = `5000` - **DELETE THIS** (Vercel handles PORT automatically)
- ❌ `NODE_ENV` = `development` - **CHANGE TO** `production`

**Keep these:**
- ✅ `MONGO_URI` = Your MongoDB connection string

### 2. Steps to Fix:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Remove `PORT` variable:**
   - Click the "-" button next to `PORT`
   - Vercel automatically sets PORT, so this conflicts

3. **Update `NODE_ENV`:**
   - Change `NODE_ENV` from `development` to `production`
   - Or delete it and add it again with value `production`

4. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger redeployment

### 3. Verify API is Working:

After redeploying, test:
- `https://your-app.vercel.app/api/health` - Should return JSON
- `https://your-app.vercel.app/api/` - Should return API info

### 4. If Still Not Working:

Check the Vercel function logs:
- Go to your deployment → Functions tab
- Check for any errors in `/api` function logs
- Verify MongoDB connection string is correct

## Correct Environment Variables:

```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/dbname
NODE_ENV = production
```

**DO NOT SET:**
- PORT (Vercel handles this)
- Any other variables unless needed

