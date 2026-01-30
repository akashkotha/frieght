# Railway Deployment - Quick Fix

## Problem
Railway can't detect your .NET project because you have a monorepo structure with both `backend` and `frontend` folders.

## Solution

### Method 1: Railway Dashboard (Easiest)

1. Go to your Railway project
2. Click on your service
3. Go to **Settings** tab
4. Under **"Source"** or **"Build"** section, set:
   - **Root Directory**: `backend/FreightERP.API`
   - **Build Command**: `dotnet publish -c Release -o out`
   - **Start Command**: `dotnet out/FreightERP.API.dll`

5. Go to **Variables** tab and add:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   ```

6. Click **"Deploy"** or **"Redeploy"**

### Method 2: Configuration Files (Already Created)

I've created two files for you:
- `nixpacks.toml` - Tells Railway how to build
- `railway.json` - Service configuration

**To use them:**
```bash
git add nixpacks.toml railway.json
git commit -m "Add Railway config"
git push
```

Railway will auto-detect and use these files.

## Expected Result

After deployment succeeds, you'll get a URL like:
`https://freight-erp-production.up.railway.app`

Test it:
- API: `https://your-url.railway.app/api/auth/login`
- Swagger: `https://your-url.railway.app/swagger`

## Common Issues

**Issue**: "Could not determine how to build"
**Fix**: Set Root Directory to `backend/FreightERP.API`

**Issue**: "Port binding error"
**Fix**: Add `ASPNETCORE_URLS=http://0.0.0.0:$PORT` to environment variables

**Issue**: "Database not found"
**Fix**: The SQLite database will be created automatically on first run

## Next Steps

After backend is deployed:
1. Copy your Railway URL
2. Update frontend `.env.production` with the URL
3. Deploy frontend to Vercel
