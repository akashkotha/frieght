# Smart Freight & Logistics Management System (Mini ERP)

A full-stack web application for freight forwarding and logistics companies to manage shipments, billing, and operations efficiently.

## 🚀 Features

### Core Modules
- **Shipment Management**: Track shipments end-to-end across multiple transport modes (Air/Sea/Road)
- **Customer & Vendor Management**: Maintain structured records of clients and logistics vendors
- **Freight Cost Calculation**: Automatically estimate costs based on distance, weight, and transport mode
- **Billing & Invoicing**: Generate invoices with automatic tax calculation and payment tracking
- **Dashboard & Analytics**: Visual dashboards with KPIs, revenue trends, and operational insights

### Key Capabilities
- ✅ Role-based access control (Admin, Operations, Finance)
- ✅ Real-time shipment status tracking with history
- ✅ Automated invoice generation with 18% GST
- ✅ Cost comparison (estimated vs actual)
- ✅ Delayed shipment detection
- ✅ Top customer analytics
- ✅ Revenue trend analysis

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 10 (C#)
- **Database**: MS SQL Server (LocalDB for development)
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **API**: RESTful API with Swagger documentation

### Frontend
- **Framework**: React 18+ with Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Modern CSS with custom design system

## 📁 Project Structure

```
softlink/
├── backend/
│   └── FreightERP.API/
│       ├── Controllers/          # API controllers
│       ├── Models/               # Entity models
│       ├── DTOs/                 # Data transfer objects
│       ├── Services/             # Business logic
│       ├── Data/                 # Database context
│       └── Migrations/           # EF Core migrations
│
├── frontend/
│   └── src/
│       ├── components/           # Reusable UI components
│       ├── pages/                # Page components
│       ├── services/             # API client
│       ├── context/              # React context
│       └── utils/                # Helper functions
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+ and npm
- SQL Server LocalDB (comes with Visual Studio) or SQL Server Express
- Visual Studio 2022 or VS Code

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend/FreightERP.API
   ```

2. **Restore NuGet packages**:
   ```bash
   dotnet restore
   ```

3. **Update database connection string** (if needed):
   Edit `appsettings.json` and update the `ConnectionStrings:DefaultConnection`

4. **Create database**:
   ```bash
   dotnet ef database update
   ```

5. **Run the API**:
   ```bash
   dotnet run
   ```

   The API will be available at `https://localhost:7xxx` (check console output)
   Swagger documentation: `https://localhost:7xxx/swagger`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Update API URL** (if needed):
   Edit `src/services/api.js` and update the `baseURL`

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🔑 Default Credentials

- **Username**: `admin`
- **Password**: `Admin@123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Deactivate customer

### Vendors
- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Create vendor
- Similar CRUD operations...

### Shipments
- `GET /api/shipments` - List shipments (with filters)
- `POST /api/shipments` - Create shipment
- `PUT /api/shipments/{id}/status` - Update status
- `POST /api/shipments/calculate-cost` - Calculate freight cost
- `GET /api/shipments/{id}/history` - Get status history

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Generate invoice
- `PUT /api/invoices/{id}/payment` - Update payment status

### Dashboard
- `GET /api/dashboard/summary` - Get KPIs
- `GET /api/dashboard/revenue-trend` - Revenue by month
- `GET /api/dashboard/shipments-by-mode` - Distribution by transport mode
- `GET /api/dashboard/top-customers` - Top 5 customers
- `GET /api/dashboard/delayed-shipments` - List delayed shipments

## 🎨 Features Showcase

### Freight Cost Calculation
The system uses a configurable pricing engine:
```
EstimatedCost = (Weight × BaseRate) + (Distance × DistanceMultiplier)
```

**Pricing Rules** (seeded in database):
- **Air**: ₹15/kg base rate, 0.05 distance multiplier, ₹500 minimum
- **Sea**: ₹8/kg base rate, 0.02 distance multiplier, ₹300 minimum
- **Road**: ₹10/kg base rate, 0.03 distance multiplier, ₹200 minimum

### Invoice Generation
- Automatic subtotal from shipment actual cost
- 18% GST calculation
- 30-day payment terms
- Auto-generated invoice numbers (INV-YYYYMMDD-XXX)

### Shipment Tracking
- Status workflow: Booked → In Transit → Delivered
- Complete audit trail with timestamps
- Delay detection based on expected delivery date
- User attribution for all status changes

## 🔒 Security Features

- JWT-based authentication
- Role-based authorization
- Password hashing (production-ready with BCrypt)
- CORS configuration for frontend
- SQL injection protection via Entity Framework

## 📈 Dashboard Metrics

- Total shipments (current month)
- Active shipments count
- Delayed shipments alert
- Total revenue (current month)
- Pending invoices count and amount
- Revenue trend (last 6 months)
- Shipment distribution by transport mode
- Top 5 customers by revenue

## 🧪 Testing

### Test the API
1. Open Swagger UI at `https://localhost:7xxx/swagger`
2. Login to get JWT token
3. Click "Authorize" and enter: `Bearer {your-token}`
4. Test all endpoints

### Test the Frontend
1. Login with default credentials
2. Navigate through all modules
3. Create test data (customers, vendors, shipments)
4. Generate invoices
5. View dashboard analytics

## 🚀 Deployment

### Backend Deployment
1. Publish the API:
   ```bash
   dotnet publish -c Release
   ```
2. Update connection string for production database
3. Deploy to IIS, Azure App Service, or Docker

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to any static hosting (Netlify, Vercel, Azure Static Web Apps)
3. Update API base URL in production build

## 📝 Database Schema

### Core Tables
- **Users**: System users with roles
- **Customers**: Client companies
- **Vendors**: Logistics service providers
- **Shipments**: Freight shipments with tracking
- **ShipmentStatusHistory**: Audit trail for shipments
- **Invoices**: Billing and payment tracking
- **PricingRules**: Configurable freight pricing

## 🎯 Future Enhancements

- [ ] Email notifications for status changes
- [ ] Document upload (shipping docs, invoice PDFs)
- [ ] Advanced reporting with Excel export
- [ ] Multi-currency support
- [ ] GPS tracking integration
- [ ] Mobile app (React Native)
- [ ] Multi-tenant architecture
- [ ] Real-time notifications (SignalR)

## 👥 User Roles

### Admin
- Full system access
- User management
- System configuration

### Operations
- Shipment management
- Customer/vendor management
- Status updates

### Finance
- Invoice generation
- Payment tracking
- Financial reports
- Dashboard access

## 📞 Support

For questions or issues, please contact the development team.

## 📄 License

This project is developed for demonstration purposes for Softlink application.

---

**Built with ❤️ for efficient logistics management**
