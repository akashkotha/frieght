# Quick Start Guide - Freight ERP System

## 🚀 Running the Application

### Step 1: Start the Backend API

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd C:\Users\akask\OneDrive\Desktop\softlink\backend\FreightERP.API
   ```

2. Run the API:
   ```bash
   dotnet run
   ```

3. **Note the HTTPS port** from the output (usually `https://localhost:7xxx`)
   
4. The API will be available at that URL
   - Swagger UI: `https://localhost:7xxx/swagger`

### Step 2: Update Frontend API URL

1. Open `frontend/src/services/api.js`

2. Update line 3 with your actual backend port:
   ```javascript
   const API_BASE_URL = 'https://localhost:7001/api'; // Change 7001 to your port
   ```

### Step 3: Start the Frontend

1. Open a **NEW terminal** and navigate to frontend:
   ```bash
   cd C:\Users\akask\OneDrive\Desktop\softlink\frontend
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

### Step 4: Login

Use the default credentials:
- **Username**: `admin`
- **Password**: `Admin@123`

---

## 📝 Database Setup (If Needed)

If you encounter database errors, run these commands in the backend directory:

```bash
# Create/update the database
dotnet ef database update

# If that fails, try removing and recreating migrations
dotnet ef migrations remove --force
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## ✅ What You Can Do Now

### 1. Dashboard
- View KPI cards (shipments, revenue, delays)
- See revenue trend chart
- View shipment distribution by transport mode
- Check top customers
- Monitor delayed shipments

### 2. Customers Page
- View all customers
- Search customers
- Add new customers
- Delete customers

### 3. API Testing (Swagger)
- Go to `https://localhost:7xxx/swagger`
- Click "Authorize" button
- Login via `/api/auth/login` endpoint
- Copy the token from response
- Click "Authorize" again and paste: `Bearer {your-token}`
- Test all endpoints

---

## 🔧 Troubleshooting

### Backend won't start
- Ensure .NET 10 SDK is installed: `dotnet --version`
- Check if port is already in use
- Try running on different port: `dotnet run --urls "https://localhost:7002"`

### Frontend won't start
- Ensure Node.js is installed: `node --version`
- Try reinstalling dependencies: `npm install`
- Clear cache: `npm cache clean --force`

### CORS Errors
- Make sure backend is running
- Verify API_BASE_URL in `frontend/src/services/api.js` matches backend port
- Check browser console for exact error

### Database Errors
- Ensure SQL Server LocalDB is installed (comes with Visual Studio)
- Try using SQL Server Express instead
- Update connection string in `backend/FreightERP.API/appsettings.json`

---

## 📊 Sample Data

To create sample data for testing:

1. Use Swagger UI to create:
   - 5-10 Customers
   - 3-5 Vendors
   - 10-20 Shipments
   - 5-10 Invoices

2. Or use the frontend:
   - Go to Customers page and add customers
   - Use API for other entities (Vendors, Shipments, Invoices pages coming soon)

---

## 🎯 Next Steps

### To Complete the Frontend:
1. Create Vendors page (similar to Customers)
2. Create Shipments page with cost calculator
3. Create Invoices page with generation form
4. Add edit functionality to all pages
5. Add detail views for each entity

### Backend is 100% Complete:
- All 25+ API endpoints working
- Authentication & authorization
- Cost calculation engine
- Invoice generation
- Dashboard analytics
- Database with migrations

---

## 📞 Need Help?

Check these files for reference:
- **README.md** - Complete project documentation
- **walkthrough.md** - Detailed technical walkthrough
- **Swagger UI** - Interactive API documentation

---

**Status**: 
- ✅ Backend: 100% Complete
- ✅ Frontend: 60% Complete (Login, Dashboard, Customers working)
- ⏳ Remaining: Vendors, Shipments, Invoices pages (3-4 hours)
