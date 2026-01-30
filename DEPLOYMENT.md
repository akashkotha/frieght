# Deployment Guide - Freight ERP System

## 🚀 Quick Deployment

Your application is ready to deploy! Follow these steps to get it online.

---

## Part 1: Deploy Backend (Railway)

### Step 1: Prepare Backend for Deployment

1. **Update CORS in Program.cs** (if needed for production domain):
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowFrontend", policy =>
       {
           policy.WithOrigins("https://your-frontend-url.vercel.app")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });
   ```

2. **Ensure database file is included**:
   - The `FreightERP.db` file will be created automatically on first run
   - Migrations will run automatically

### Step 2: Deploy to Railway

1. **Create Railway Account**:
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend/FreightERP.API` as the root directory

3. **Configure Build Settings**:
   - Railway will auto-detect .NET
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `dotnet out/FreightERP.API.dll`

4. **Set Environment Variables** (Optional):
   ```
   ASPNETCORE_ENVIRONMENT=Production
   Jwt__Key=YourProductionSecretKey
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Copy the generated URL (e.g., `https://freighterp-production.up.railway.app`)

### Alternative: Deploy to Azure

1. **Create Azure Account** (free tier available)
2. **Create App Service**:
   - Runtime: .NET 10
   - OS: Linux
3. **Deploy via GitHub Actions** or Azure CLI
4. **Configure connection string** in Azure portal

---

## Part 2: Deploy Frontend (Vercel)

### Step 1: Update API URL

1. **Create environment file** `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Update api.js** to use environment variable:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';
   ```

### Step 2: Deploy to Vercel

1. **Create Vercel Account**:
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `frontend` as the root directory

3. **Configure Build Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Alternative: Deploy to Netlify

1. **Create Netlify Account**
2. **New site from Git**
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment variables**: Same as Vercel
5. **Deploy**

---

## Part 3: Post-Deployment

### 1. Update CORS

Update backend `Program.cs` with your frontend URL:
```csharp
policy.WithOrigins("https://your-app.vercel.app")
```

Redeploy backend after this change.

### 2. Test the Application

1. **Visit your frontend URL**
2. **Login**: admin / Admin@123
3. **Test each page**:
   - Dashboard - Check charts load
   - Customers - Add/Edit/Delete
   - Vendors - Add/Edit/Delete
   - Shipments - Create/View/Update Status
   - Invoices - View/Update Payment

### 3. Seed Production Data

1. Go to `https://your-backend-url/swagger`
2. Execute `POST /api/seed/populate`
3. Refresh your frontend dashboard

---

## 📋 Deployment Checklist

### Backend
- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Swagger accessible
- [ ] Database created
- [ ] Seed data added

### Frontend
- [ ] API URL updated
- [ ] Environment variables set
- [ ] Vercel project created
- [ ] Build successful
- [ ] Site accessible
- [ ] Login works
- [ ] All pages load
- [ ] API calls working

### Final Steps
- [ ] CORS configured correctly
- [ ] All features tested
- [ ] Demo credentials work
- [ ] URLs documented
- [ ] README updated

---

## 🌐 Your Live URLs

After deployment, you'll have:

**Frontend**: `https://freight-erp.vercel.app`
**Backend API**: `https://freight-erp.railway.app`
**Swagger**: `https://freight-erp.railway.app/swagger`

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify API URL in frontend `.env.production`
- Check browser console for errors

### Database not found
- Ensure migrations run on startup
- Check Railway logs
- Verify SQLite file is created

### Build fails
- Check Node version (use 18.x or 20.x)
- Check .NET version (10.x)
- Review build logs

---

## 💡 Pro Tips

1. **Custom Domain** (Optional):
   - Vercel: Add custom domain in settings
   - Railway: Add custom domain in settings

2. **Monitoring**:
   - Railway provides logs and metrics
   - Vercel provides analytics

3. **Auto-Deploy**:
   - Both platforms auto-deploy on git push
   - Perfect for continuous deployment

4. **Free Tier Limits**:
   - Railway: 500 hours/month
   - Vercel: Unlimited for personal projects

---

## 📝 For Your Interview

**Share these URLs with Softlink:**

```
Frontend: https://your-app.vercel.app
Backend API: https://your-backend.railway.app
Swagger Docs: https://your-backend.railway.app/swagger

Demo Credentials:
Username: admin
Password: Admin@123
```

---

**Your application is production-ready!** 🎉

Both Railway and Vercel offer free tiers perfect for demos and interviews. The deployment process takes about 15-20 minutes total.
