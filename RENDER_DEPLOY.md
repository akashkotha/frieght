# Render Deployment Guide - Freight ERP Backend

## 🚀 Deploy to Render (Recommended Alternative)

Render is easier than Railway for .NET applications and has excellent free tier support.

### Step 1: Push render.yaml to GitHub

The `render.yaml` file has been created in your root directory. Push it:

```bash
git add render.yaml
git commit -m "Add Render configuration"
git push
```

### Step 2: Deploy on Render

1. **Create Render Account**:
   - Go to https://render.com
   - Sign up with GitHub (free)

2. **Create New Web Service**:
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub account
   - Select your repository: `akashkotha/-Smart-Freight-Logistics-Management-System`
   - Render will automatically detect `render.yaml`

3. **Review Configuration**:
   - Service Name: `freight-erp-backend`
   - Runtime: `.NET`
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `dotnet out/FreightERP.API.dll`
   - Root Directory: `backend/FreightERP.API`

4. **Click "Apply"**:
   - Render will start building your app
   - Build takes 3-5 minutes
   - You'll get a URL like: `https://freight-erp-backend.onrender.com`

### Step 3: Test Your Deployment

After deployment completes, test these URLs:

- **API Health**: `https://your-app.onrender.com/api/auth/login`
- **Swagger Docs**: `https://your-app.onrender.com/swagger`

You should see the Swagger UI!

### Step 4: Seed Data

1. Go to Swagger: `https://your-app.onrender.com/swagger`
2. Find `POST /api/seed/populate`
3. Click "Try it out" → "Execute"
4. This will populate your database with test data

---

## ✅ Advantages of Render

- ✅ **Automatic Detection**: Detects .NET automatically
- ✅ **Free Tier**: 750 hours/month free
- ✅ **Auto-Deploy**: Deploys on every git push
- ✅ **Easy Setup**: Blueprint (render.yaml) makes it one-click
- ✅ **Better Logs**: Easier to debug than Railway
- ✅ **Persistent Storage**: SQLite database persists

---

## 🔧 Troubleshooting

### Build Fails
- Check Render build logs
- Ensure .NET SDK 8.0 is specified
- Verify `rootDir` is correct

### App Crashes on Start
- Check that `ASPNETCORE_URLS` is set to `http://0.0.0.0:$PORT`
- Verify start command uses `out/FreightERP.API.dll`

### Database Issues
- SQLite database is created automatically
- Data persists across deployments
- Check logs for migration errors

---

## 📝 Next Steps

After backend is deployed:

1. **Copy your Render URL**
2. **Update frontend** `api.js`:
   ```javascript
   const API_BASE_URL = 'https://your-app.onrender.com/api';
   ```
3. **Deploy frontend to Vercel** (same as before)
4. **Update CORS** in backend to allow frontend URL

---

## 🎯 Free Tier Limits

- **750 hours/month** (enough for 24/7 uptime)
- **Sleeps after 15 min inactivity** (wakes on first request)
- **512 MB RAM**
- **0.1 CPU**

Perfect for demos and interviews!
