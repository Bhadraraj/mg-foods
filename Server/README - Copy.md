# Restaurant POS System Backend

A comprehensive Node.js backend for Restaurant Point of Sale (POS) system with MongoDB database, JWT authentication, and role-based access control.

## 🚀 Features

### Core Modules
- **Authentication & Authorization** - JWT with refresh tokens, role-based access control
- **Dashboard** - Real-time analytics and overview
- **Sales Management** - Invoice generation, KOT management, payment processing
- **Purchase Management** - Vendor management, purchase orders, stock updates
- **Inventory Management** - Stock tracking, alerts, transfers
- **Recipe Management** - Recipe creation, cost calculation, ingredient tracking
- **Party Management** - Customer, vendor, and referrer management
- **Expense Management** - Expense tracking, approval workflow
- **Offers & Discounts** - Promotional offers, coupon management
- **Item Management** - Product catalog, categories, pricing
- **Reports** - GST, P&L, inventory, sales analytics
- **KOT System** - Kitchen order tickets, status tracking

### Security Features
- JWT Authentication with refresh tokens
- Role-based access control (Admin, Manager, Cashier)
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- XSS protection
- MongoDB injection prevention

### Technical Features
- RESTful API design
- Pagination and filtering
- File upload with Cloudinary
- Error handling middleware
- Request logging
- Database indexing for performance
- Comprehensive validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account (for file uploads)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd restaurant-pos-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/restaurant_pos

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

5. **Start MongoDB**
Make sure MongoDB is running on your system.

6. **Seed the database (optional)**
```bash
npm run seed
```

7. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔐 Default Login Credentials

After seeding the database:

- **Admin**: admin@restaurant.com / admin123
- **Manager**: manager@restaurant.com / manager123
- **Cashier**: cashier@restaurant.com / cashier123

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     - Register new user
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/refresh-token - Refresh access token
GET  /api/auth/me           - Get current user
PUT  /api/auth/profile      - Update profile
PUT  /api/auth/change-password - Change password
```

### Sales Endpoints

```
GET    /api/sales           - Get all sales
POST   /api/sales           - Create new sale
GET    /api/sales/:id       - Get single sale
PUT    /api/sales/:id       - Update sale
DELETE /api/sales/:id       - Delete sale
GET    /api/sales/stats     - Get sales statistics
POST   /api/sales/:id/payment - Process payment
```

### Items Endpoints

```
GET    /api/items           - Get all items
POST   /api/items           - Create new item
GET    /api/items/:id       - Get single item
PUT    /api/items/:id       - Update item
DELETE /api/items/:id       - Delete item
PUT    /api/items/:id/stock - Update stock
GET    /api/items/low-stock - Get low stock items
```

### Dashboard Endpoints

```
GET /api/dashboard/overview      - Get dashboard overview
GET /api/dashboard/sales-analytics - Get sales analytics
```

### Reports Endpoints

```
GET /api/reports/sales       - Sales report
GET /api/reports/gst         - GST report
GET /api/reports/profit-loss - Profit & Loss report
GET /api/reports/inventory   - Inventory report
GET /api/reports/tax         - Tax report
```

## 🏗️ Project Structure

```
├── controllers/          # Route controllers
├── middleware/          # Custom middleware
├── models/             # Mongoose models
├── routes/             # Express routes
├── scripts/            # Utility scripts
├── server.js           # Main server file
├── package.json        # Dependencies
└── README.md          # Documentation
```

## 🔒 Role-Based Permissions

### Admin
- Full access to all modules
- User management
- System configuration
- All reports

### Manager
- Sales and purchase management
- Inventory management
- Recipe management
- Limited user management
- Most reports

### Cashier
- Sales creation
- Basic inventory view
- KOT management
- Limited dashboard access

## 🧪 Testing

```bash
npm test
```

## 📊 Database Models

### Core Models
- **User** - System users with roles and permissions
- **Item** - Product catalog with pricing and stock
- **Category** - Item categorization
- **Sale** - Sales transactions with items and payments
- **Purchase** - Purchase orders and vendor management
- **Party** - Customers, vendors, and referrers
- **Recipe** - Recipe management with ingredients
- **Expense** - Expense tracking and approval
- **KOT** - Kitchen order tickets
- **Offer** - Promotional offers and discounts

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | JWT secret key | - |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| CLOUDINARY_* | Cloudinary configuration | - |

### Rate Limiting
- Default: 100 requests per 15 minutes
- Configurable via environment variables

### File Upload
- Maximum file size: 5MB
- Supported formats: JPG, JPEG, PNG, GIF, WEBP
- Storage: Cloudinary

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB URI
- [ ] Set strong JWT secrets
- [ ] Configure Cloudinary
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Version History

- **v1.0.0** - Initial release with core POS functionality
- Complete authentication and authorization
- Full CRUD operations for all modules
- Comprehensive reporting system
- File upload capabilities
- Production-ready security features