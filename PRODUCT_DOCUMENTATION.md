# MG Foodcourt - Restaurant Management System
## Complete Product Documentation

### Table of Contents
1. [Product Overview](#product-overview)
2. [System Architecture](#system-architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Core Features](#core-features)
5. [Module Documentation](#module-documentation)
6. [API Documentation](#api-documentation)
7. [Technical Specifications](#technical-specifications)
8. [Installation & Setup](#installation--setup)
9. [User Guide](#user-guide)
10. [Support & Maintenance](#support--maintenance)

---

## Product Overview

**MG Foodcourt Restaurant Management System** is a comprehensive, web-based solution designed to streamline restaurant operations from order management to financial reporting. Built with modern technologies, it provides real-time insights, efficient workflow management, and robust security features.

### Key Benefits
- **Streamlined Operations**: Unified platform for all restaurant activities
- **Real-time Analytics**: Live dashboard with key performance indicators
- **Multi-user Support**: Role-based access control for different staff levels
- **Financial Management**: Complete accounting and reporting system
- **Inventory Control**: Advanced stock management with rack-level tracking
- **Customer Management**: Comprehensive customer relationship tools

### Target Users
- Restaurant Owners & Managers
- Kitchen Staff & Chefs
- Cashiers & Front-of-house Staff
- Accountants & Financial Managers
- Inventory Managers

---

## System Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API with custom hooks
- **Routing**: React Router v6
- **API Integration**: Axios with interceptors
- **Authentication**: JWT-based with refresh tokens
- **Build Tool**: Vite for fast development and building

### Security Features
- JWT-based authentication with automatic token refresh
- Role-based access control (RBAC)
- Protected routes with permission validation
- Secure API communication with error handling
- Session management with automatic logout

---

## User Roles & Permissions

### 1. Admin
**Full System Access**
- User management (create, edit, delete users)
- Role management and permission assignment
- System configuration and settings
- All financial reports and analytics
- Complete inventory and purchase management

### 2. Manager
**Operational Management**
- Staff supervision and scheduling
- Inventory management and stock control
- Purchase order management
- Financial reports (excluding sensitive data)
- Customer and vendor management
- Recipe and menu management

### 3. Cashier
**Sales & Customer Service**
- Process sales transactions
- Generate bills and invoices
- Handle customer payments
- Access customer information
- Basic inventory viewing

### 4. Staff
**Service Operations**
- Table management and order taking
- KOT (Kitchen Order Ticket) management
- Customer service support
- Basic reporting access

### 5. Chef
**Kitchen Operations**
- Recipe management and creation
- Ingredient tracking and usage
- KOT processing and completion
- Kitchen inventory monitoring

---

## Core Features

### 1. Dashboard & Analytics
- **Real-time Metrics**: Live sales, revenue, and performance data
- **Visual Analytics**: Charts and graphs for trend analysis
- **Quick Actions**: Fast access to common operations
- **Customizable Widgets**: Role-based dashboard customization

### 2. Sales Management
- **Point of Sale (POS)**: Complete billing and payment processing
- **Multiple Payment Methods**: Cash, Card, UPI, Credit
- **Invoice Generation**: GST-compliant billing
- **Return Management**: Product returns and refunds
- **Customer Credit**: Credit limit management

### 3. Kitchen Operations (KOT)
- **Order Management**: Digital kitchen order tickets
- **Real-time Updates**: Live order status tracking
- **Priority Management**: Order prioritization system
- **Completion Tracking**: Item-wise completion status

### 4. Inventory Management
- **Multi-level Tracking**: Category, item, and rack-level inventory
- **Stock Alerts**: Low stock and out-of-stock notifications
- **Rack Management**: Physical location tracking
- **Stock Adjustments**: Easy stock level modifications
- **Transfer Management**: Inter-rack stock transfers

### 5. Purchase Management
- **Purchase Orders**: Complete PO lifecycle management
- **Vendor Management**: Supplier information and tracking
- **Invoice Processing**: Digital invoice management
- **Stock Entry**: Automated inventory updates
- **Payment Tracking**: Purchase payment status

### 6. Recipe Management
- **Recipe Creation**: Detailed ingredient specifications
- **Cost Calculation**: Automatic cost computation
- **Yield Management**: Production quantity tracking
- **Ingredient Tracking**: Usage monitoring and optimization

### 7. Financial Management
- **Comprehensive Reporting**: GST, HSN, P&L reports
- **Expense Tracking**: Detailed expense categorization
- **Credit/Debit Management**: Customer and vendor balances
- **Tax Management**: Automated tax calculations
- **Journal Entries**: Manual accounting entries

### 8. Customer & Party Management
- **Customer Database**: Complete customer information
- **Vendor Management**: Supplier relationship management
- **Referrer System**: Referral tracking and rewards
- **Credit Management**: Customer credit limits and terms

### 9. Offers & Promotions
- **Discount Management**: Flexible discount structures
- **Coupon System**: Digital coupon creation and validation
- **Referral Programs**: Customer referral incentives
- **Seasonal Offers**: Time-based promotional campaigns

### 10. User & Access Management
- **Multi-user Support**: Unlimited user accounts
- **Role-based Permissions**: Granular access control
- **Activity Logging**: User action tracking
- **Security Management**: Password policies and session control

---

## Module Documentation

### Sales Module

#### Features
- **Multi-table Management**: Handle multiple dining tables simultaneously
- **Order Processing**: Complete order lifecycle from creation to payment
- **Payment Integration**: Multiple payment method support
- **Bill Generation**: Professional invoice creation with GST compliance
- **Return Processing**: Handle product returns and refunds

#### Key Components
- **Table View**: Visual representation of restaurant layout
- **Order Management**: Add/edit orders with item variants
- **Payment Processing**: Secure payment handling
- **Invoice Generation**: Automated bill creation
- **Customer Details**: Customer information management

#### Workflow
1. Select table/create new order
2. Add items from menu with variants
3. Process payment (cash/card/UPI)
4. Generate and print invoice
5. Update table status

### Kitchen (KOT) Module

#### Features
- **Digital KOT System**: Paperless kitchen order management
- **Real-time Updates**: Live order status synchronization
- **Item Tracking**: Individual item completion status
- **Priority Management**: Order prioritization based on timing
- **Completion Workflow**: Systematic order completion process

#### Key Components
- **KOT Dashboard**: Overview of all active orders
- **Order Cards**: Individual order management cards
- **Item Checklist**: Item-wise completion tracking
- **Status Management**: Order status updates
- **Time Tracking**: Order timing and duration monitoring

#### Workflow
1. Receive orders from sales system
2. Display orders in kitchen dashboard
3. Mark items as completed individually
4. Update order status to completed
5. Notify front-of-house staff

### Inventory Module

#### Features
- **Multi-level Inventory**: Category → Item → Rack structure
- **Stock Monitoring**: Real-time stock level tracking
- **Automated Alerts**: Low stock and out-of-stock notifications
- **Rack Management**: Physical location-based inventory
- **Stock Adjustments**: Easy stock level modifications

#### Key Components
- **Item Management**: Product catalog with detailed specifications
- **Rack System**: Physical storage location tracking
- **Stock Alerts**: Automated notification system
- **Adjustment Tools**: Stock level modification utilities
- **Transfer System**: Inter-rack stock movement

#### Workflow
1. Define product categories and items
2. Set up physical rack locations
3. Assign items to specific racks
4. Monitor stock levels continuously
5. Receive alerts for low stock
6. Perform stock adjustments as needed

### Purchase Module

#### Features
- **Complete Purchase Cycle**: PO → PI → Invoice → Stock Entry
- **Vendor Management**: Supplier database and relationship tracking
- **Document Management**: Digital purchase document storage
- **Payment Tracking**: Purchase payment status monitoring
- **Stock Integration**: Automatic inventory updates

#### Key Components
- **Purchase Orders**: Digital PO creation and management
- **Vendor Database**: Supplier information system
- **Invoice Processing**: Purchase invoice management
- **Payment Tracking**: Financial obligation monitoring
- **Stock Entry**: Inventory update automation

#### Workflow
1. Create purchase order (PO)
2. Receive proforma invoice (PI)
3. Process final invoice
4. Complete stock entry
5. Update payment status
6. Assign stock to racks

### Recipe Module

#### Features
- **Recipe Creation**: Detailed ingredient specifications
- **Cost Calculation**: Automatic recipe costing
- **Yield Management**: Production quantity tracking
- **Ingredient Optimization**: Usage efficiency monitoring
- **Profitability Analysis**: Recipe profit margin calculation

#### Key Components
- **Recipe Builder**: Interactive recipe creation tool
- **Ingredient Database**: Master ingredient catalog
- **Cost Calculator**: Automatic cost computation
- **Production Tracker**: Manufacturing quantity monitoring
- **Profit Analyzer**: Margin calculation tools

#### Workflow
1. Create master ingredient database
2. Build recipes with ingredient specifications
3. Calculate manufacturing costs
4. Set selling prices
5. Track production quantities
6. Monitor profitability

### Financial Module

#### Features
- **Comprehensive Reporting**: 15+ financial reports
- **Tax Management**: GST, HSN, and tax compliance
- **Expense Tracking**: Detailed expense categorization
- **Credit Management**: Customer and vendor credit tracking
- **Journal Entries**: Manual accounting adjustments

#### Key Reports
- **GST Report**: Tax compliance reporting
- **HSN Report**: Harmonized System of Nomenclature tracking
- **P&L Statement**: Profit and loss analysis
- **Balance Sheet**: Financial position statement
- **Cash Flow**: Cash movement tracking
- **Creditors/Debtors**: Outstanding balance reports

#### Workflow
1. Configure chart of accounts
2. Process daily transactions
3. Generate periodic reports
4. Reconcile accounts
5. Prepare tax filings
6. Analyze financial performance

### Party Management Module

#### Features
- **Customer Management**: Complete customer database
- **Vendor Management**: Supplier relationship tracking
- **Referrer System**: Referral program management
- **Labour Management**: Employee information and attendance
- **Credit Management**: Credit limit and terms management

#### Key Components
- **Customer Database**: Detailed customer profiles
- **Vendor Profiles**: Supplier information system
- **Referrer Tracking**: Referral program management
- **Labour Records**: Employee database
- **Attendance System**: Staff attendance tracking

#### Workflow
1. Register customers, vendors, and referrers
2. Set credit limits and payment terms
3. Track transactions and balances
4. Manage employee records
5. Monitor attendance and performance

---

## API Documentation

### Authentication APIs

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "9876543210",
  "role": "cashier"
}
```

### Sales APIs

#### Get Sales
```http
GET /api/sales?page=1&limit=20&startDate=2024-01-01&endDate=2024-12-31
```

#### Create Sale
```http
POST /api/sales
Content-Type: application/json

{
  "customerId": "customer_id",
  "items": [
    {
      "itemId": "item_id",
      "quantity": 2,
      "price": 100.00
    }
  ],
  "paymentMethod": "cash",
  "totalAmount": 200.00
}
```

### Inventory APIs

#### Get Items
```http
GET /api/items?page=1&limit=20&category=electronics&search=phone
```

#### Create Item
```http
POST /api/items
Content-Type: multipart/form-data

{
  "productName": "Smartphone",
  "category": "electronics",
  "stockDetails": {
    "currentQuantity": 100,
    "minimumStock": 10,
    "unit": "piece"
  },
  "priceDetails": {
    "costPrice": 15000,
    "sellingPrice": 20000
  }
}
```

### Purchase APIs

#### Get Purchases
```http
GET /api/purchases?page=1&limit=20&vendor=vendor_id&status=pending
```

#### Create Purchase
```http
POST /api/purchases
Content-Type: application/json

{
  "vendor": "vendor_id",
  "invoiceNo": "INV001",
  "invoiceDate": "2024-01-15",
  "items": [
    {
      "product": "product_id",
      "poQty": 100,
      "purchasePrice": 50.00
    }
  ]
}
```

### Recipe APIs

#### Get Recipes
```http
GET /api/recipes?page=1&limit=20&search=biryani
```

#### Create Recipe
```http
POST /api/recipes
Content-Type: application/json

{
  "productName": "Chicken Biryani",
  "ingredients": [
    {
      "ingredientId": "ingredient_id",
      "quantity": "2kg"
    }
  ],
  "manufacturingPrice": 200.00,
  "sellingPrice": 350.00
}
```

---

## Technical Specifications

### System Requirements

#### Minimum Requirements
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB available space
- **Network**: Stable internet connection (minimum 1 Mbps)

#### Recommended Requirements
- **Browser**: Latest version of Chrome, Firefox, or Edge
- **RAM**: 16GB for optimal performance
- **Storage**: 5GB available space
- **Network**: High-speed internet (10+ Mbps)

### Performance Specifications
- **Page Load Time**: < 2 seconds on standard broadband
- **API Response Time**: < 500ms for standard operations
- **Concurrent Users**: Supports up to 50 simultaneous users
- **Data Processing**: Handles 10,000+ transactions per day
- **Uptime**: 99.9% availability guarantee

### Security Features
- **Authentication**: JWT-based with automatic refresh
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: HTTPS/TLS 1.3 for all communications
- **Session Management**: Automatic timeout and secure logout
- **Input Validation**: Comprehensive client and server-side validation
- **Error Handling**: Graceful error management with user feedback

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Modern web browser
- Stable internet connection
- Valid API endpoint configuration

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd restaurant-management-system
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Create .env file
VITE_API_URL=https://your-api-endpoint.com/api
VITE_APP_NAME=MG Foodcourt
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

### Configuration Options

#### API Configuration
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://api.mgfoodcourt.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}
```

#### Company Information
```typescript
export const COMPANY_INFO = {
  name: "MG Foodcourt",
  phone: "7540022411",
  id: "2345",
}
```

---

## User Guide

### Getting Started

#### First Login
1. Navigate to the application URL
2. Enter your credentials (email and password)
3. Complete initial setup if prompted
4. Familiarize yourself with the dashboard

#### Dashboard Overview
The dashboard provides:
- **Key Metrics**: Sales, revenue, customer count
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: Latest transactions and updates
- **Alerts**: Important notifications and reminders

### Daily Operations

#### Processing Sales
1. **Access Sales Module**: Click "Sale" in the navigation
2. **Create New Invoice**: Click the "+" button
3. **Add Customer Details**: Enter customer information
4. **Add Products**: Select items from catalog
5. **Apply Discounts**: Add any applicable discounts
6. **Process Payment**: Select payment method and complete transaction
7. **Generate Invoice**: Print or email invoice to customer

#### Managing Tables
1. **Access Table View**: Navigate to "Table Management"
2. **View Table Status**: Monitor occupied/available tables
3. **Take Orders**: Click on table to add orders
4. **Process KOT**: Send orders to kitchen
5. **Generate Bills**: Create final bills for completed orders

#### Kitchen Operations
1. **Access KOT Module**: Navigate to "KOT" section
2. **View Active Orders**: Monitor all pending orders
3. **Mark Items Complete**: Check off completed items
4. **Update Status**: Mark orders as completed
5. **Manage Queue**: Prioritize orders based on timing

#### Inventory Management
1. **Monitor Stock Levels**: Check current inventory status
2. **Receive Alerts**: Respond to low stock notifications
3. **Adjust Stock**: Make necessary stock adjustments
4. **Transfer Stock**: Move items between racks
5. **Update Prices**: Modify selling and purchase prices

### Advanced Features

#### Recipe Management
1. **Create Master Ingredients**: Define ingredient database
2. **Build Recipes**: Combine ingredients with quantities
3. **Calculate Costs**: Automatic cost computation
4. **Set Prices**: Define selling prices for profitability
5. **Track Production**: Monitor manufacturing quantities

#### Financial Reporting
1. **Access Reports**: Navigate to "Reports" section
2. **Select Report Type**: Choose from 15+ available reports
3. **Set Date Range**: Define reporting period
4. **Apply Filters**: Narrow down data as needed
5. **Export Data**: Download reports in Excel/PDF format

#### User Management (Admin Only)
1. **Access Management**: Navigate to "Management" section
2. **Create Users**: Add new staff members
3. **Assign Roles**: Set appropriate permissions
4. **Manage Permissions**: Fine-tune access controls
5. **Monitor Activity**: Track user actions and performance

---

## Feature Breakdown by Module

### 1. Sales Management
- ✅ Multi-table order management
- ✅ Product catalog with variants
- ✅ Real-time pricing and discounts
- ✅ Multiple payment methods
- ✅ GST-compliant invoicing
- ✅ Return and refund processing
- ✅ Customer credit management
- ✅ Sales analytics and reporting

### 2. Kitchen Operations (KOT)
- ✅ Digital kitchen order tickets
- ✅ Real-time order synchronization
- ✅ Item-wise completion tracking
- ✅ Order prioritization
- ✅ Kitchen performance metrics
- ✅ Integration with sales system

### 3. Inventory Management
- ✅ Multi-level inventory structure
- ✅ Rack-based storage tracking
- ✅ Automated stock alerts
- ✅ Stock adjustment tools
- ✅ Inter-rack transfers
- ✅ Inventory valuation
- ✅ Stock movement history

### 4. Purchase Management
- ✅ Complete purchase workflow
- ✅ Vendor management system
- ✅ Document management
- ✅ Payment tracking
- ✅ Stock entry automation
- ✅ Purchase analytics

### 5. Recipe Management
- ✅ Master ingredient database
- ✅ Recipe builder with costing
- ✅ Yield management
- ✅ Profitability analysis
- ✅ Production tracking
- ✅ Ingredient optimization

### 6. Financial Management
- ✅ 15+ comprehensive reports
- ✅ GST and tax compliance
- ✅ Expense categorization
- ✅ Credit/debit tracking
- ✅ Journal entry system
- ✅ Financial analytics

### 7. Party Management
- ✅ Customer database
- ✅ Vendor management
- ✅ Referrer system
- ✅ Labour management
- ✅ Attendance tracking
- ✅ Credit management

### 8. Offers & Promotions
- ✅ Discount management
- ✅ Coupon system
- ✅ Referral programs
- ✅ Seasonal campaigns
- ✅ Promotion analytics

### 9. User Management
- ✅ Multi-user support
- ✅ Role-based access
- ✅ Permission management
- ✅ Activity logging
- ✅ Security controls

### 10. Reporting & Analytics
- ✅ Real-time dashboards
- ✅ Comprehensive reports
- ✅ Data export capabilities
- ✅ Visual analytics
- ✅ Performance metrics

---

## Detailed Feature List

### Sales Features
1. **Table Management**
   - Visual table layout
   - Table status tracking (available/occupied/bill-generated)
   - Table splitting and merging
   - Customer assignment

2. **Order Processing**
   - Menu item selection with variants
   - Quantity adjustments
   - Special instructions (KOT notes)
   - Order modifications

3. **Payment Processing**
   - Cash payments
   - Card payments
   - UPI/digital payments
   - Split payments
   - Customer credit

4. **Invoice Generation**
   - GST-compliant bills
   - Professional formatting
   - Email/print options
   - Invoice numbering

5. **Return Management**
   - Product return processing
   - Refund calculations
   - Return reason tracking
   - Inventory adjustments

### Inventory Features
1. **Product Management**
   - Product catalog creation
   - Category organization
   - Brand management
   - Variant handling

2. **Stock Control**
   - Real-time stock tracking
   - Multi-location inventory
   - Stock alerts and notifications
   - Automated reorder points

3. **Rack Management**
   - Physical location mapping
   - Rack-wise stock allocation
   - Stock transfer between racks
   - Capacity management

4. **Valuation**
   - FIFO/LIFO costing methods
   - Inventory valuation reports
   - Stock aging analysis
   - Dead stock identification

### Purchase Features
1. **Vendor Management**
   - Vendor database
   - Contact information
   - Payment terms
   - Performance tracking

2. **Purchase Orders**
   - PO creation and approval
   - Vendor communication
   - Delivery tracking
   - Order modifications

3. **Invoice Processing**
   - Invoice verification
   - Three-way matching
   - Payment scheduling
   - Dispute management

4. **Stock Entry**
   - Goods receipt processing
   - Quality checks
   - Rack assignment
   - Inventory updates

### Financial Features
1. **Accounting**
   - Chart of accounts
   - Journal entries
   - Trial balance
   - Financial statements

2. **Tax Management**
   - GST calculations
   - Tax filing reports
   - HSN code management
   - Compliance tracking

3. **Expense Management**
   - Expense categorization
   - Approval workflows
   - Petty cash management
   - Expense analytics

4. **Credit Management**
   - Customer credit limits
   - Payment terms
   - Aging analysis
   - Collection management

---

## Integration Capabilities

### Third-party Integrations
- **Payment Gateways**: Support for major payment processors
- **Accounting Software**: Integration with popular accounting systems
- **POS Hardware**: Compatible with standard POS devices
- **Printers**: Thermal and laser printer support
- **Email Services**: Automated email notifications

### API Integrations
- **RESTful APIs**: Complete API coverage for all features
- **Webhook Support**: Real-time event notifications
- **Data Export**: Multiple format support (Excel, PDF, CSV)
- **Backup Systems**: Automated data backup capabilities

---

## Support & Maintenance

### Support Channels
- **Email Support**: support@mgfoodcourt.com
- **Phone Support**: +91-7540022411
- **Documentation**: Comprehensive online documentation
- **Video Tutorials**: Step-by-step video guides
- **Community Forum**: User community support

### Maintenance Schedule
- **Regular Updates**: Monthly feature updates
- **Security Patches**: Immediate security updates
- **Performance Optimization**: Quarterly performance reviews
- **Data Backup**: Daily automated backups
- **System Monitoring**: 24/7 system health monitoring

### Training & Onboarding
- **Initial Setup**: Guided system configuration
- **Staff Training**: Role-specific training sessions
- **Documentation**: Comprehensive user manuals
- **Video Tutorials**: Interactive learning materials
- **Ongoing Support**: Continuous assistance and guidance

---

## Compliance & Standards

### Regulatory Compliance
- **GST Compliance**: Full GST tax compliance
- **Data Protection**: GDPR-compliant data handling
- **Financial Standards**: Accounting standards compliance
- **Security Standards**: Industry-standard security practices

### Quality Assurance
- **Testing**: Comprehensive automated testing
- **Code Quality**: High-quality, maintainable codebase
- **Performance**: Optimized for speed and efficiency
- **Reliability**: 99.9% uptime guarantee

---

## Pricing & Licensing

### Licensing Model
- **Per-user Licensing**: Flexible user-based pricing
- **Feature Tiers**: Multiple feature levels available
- **Scalable Pricing**: Grows with your business
- **No Hidden Costs**: Transparent pricing structure

### Support Packages
- **Basic Support**: Email support during business hours
- **Premium Support**: 24/7 phone and email support
- **Enterprise Support**: Dedicated account manager
- **Custom Solutions**: Tailored development services

---

## Future Roadmap

### Planned Features
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: AI-powered insights
- **Multi-location Support**: Chain restaurant management
- **Customer Portal**: Self-service customer interface
- **Supplier Portal**: Vendor collaboration platform

### Technology Upgrades
- **Cloud Migration**: Full cloud-native architecture
- **Microservices**: Scalable microservice architecture
- **Real-time Sync**: Enhanced real-time capabilities
- **Offline Support**: Offline operation capabilities
- **Advanced Security**: Enhanced security features

---

## Conclusion

The MG Foodcourt Restaurant Management System is a comprehensive solution designed to meet all aspects of restaurant operations. With its robust feature set, intuitive interface, and scalable architecture, it provides restaurants with the tools needed to operate efficiently and grow successfully.

For more information, demonstrations, or custom requirements, please contact our sales team at sales@mgfoodcourt.com or call +91-7540022411.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Prepared By**: MG Foodcourt Development Team  
**Contact**: support@mgfoodcourt.com