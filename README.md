# MG Foodcourt Dashboard

A comprehensive restaurant management system built with React, TypeScript, and Tailwind CSS.

## API Integration

This application is fully integrated with a REST API backend. The API integration includes:

- **Authentication**: JWT-based authentication with automatic token refresh
- **User Management**: Complete CRUD operations for users and roles
- **Inventory Management**: Items, categories, vendors, and rack management
- **Purchase Management**: Purchase orders, invoices, and stock entries
- **Customer Management**: Customer data and relationship management
- **Labour Management**: Employee records and attendance tracking

### API Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the API URL in `.env`:
   ```
   VITE_API_URL=https://your-api-domain.com/api
   ```

### API Features

- **Automatic Token Refresh**: Seamless token renewal without user intervention
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Proper loading indicators for all API operations
- **Retry Logic**: Automatic retry for failed network requests
- **File Uploads**: Support for image uploads with proper form data handling
- **Type Safety**: Full TypeScript support for all API operations

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Modal, etc.)
│   ├── layout/          # Layout components (Sidebar, Topbar)
│   ├── cards/           # Card components (DashboardCard, TableCard, etc.)
│   ├── tables/          # Table components
│   ├── grids/           # Grid layout components
│   ├── forms/           # Form components
│   ├── modals/          # Modal components
│   └── hooks/           # Component-specific hooks
├── config/              # Configuration files
│   └── api.ts          # API configuration and endpoints
├── contexts/            # React contexts (Auth, Toast, etc.)
├── hooks/               # Global custom hooks
│   ├── useApi.ts       # Generic API hook
│   ├── useUsers.ts     # User management hook
│   ├── useCategories.ts # Category management hook
│   └── ...             # Other entity-specific hooks
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
├── services/            # API services
│   └── api/            # Modular API services
│       ├── base.ts     # Base API client with interceptors
│       ├── auth.ts     # Authentication service
│       ├── user.ts     # User management service
│       ├── category.ts # Category management service
│       ├── vendor.ts   # Vendor management service
│       ├── item.ts     # Item management service
│       ├── customer.ts # Customer management service
│       ├── labour.ts   # Labour management service
│       ├── rack.ts     # Rack management service
│       └── purchase.ts # Purchase management service
├── types/               # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── management.ts   # User and role management types
│   ├── inventory.ts    # Inventory-related types
│   └── ...             # Other domain-specific types
├── utils/               # Utility functions
│   ├── apiHelpers.ts   # API utility functions
│   ├── validation.ts   # Form validation utilities
│   └── formatters.ts   # Data formatting utilities
├── constants/           # Application constants
└── styles/             # Global styles
```

## Architecture Principles

### 1. Component Organization
- **UI Components**: Basic, reusable components in `src/components/ui/`
- **Layout Components**: Page layout components in `src/components/layout/`
- **Feature Components**: Feature-specific components organized by type
- **Page Components**: Top-level page components in `src/pages/`

### 2. Type Safety
- All types are centralized in `src/types/` and organized by domain
- Strict TypeScript configuration for better code quality
- Proper interface definitions for all data structures

### 3. Service Layer
- API services are organized in `src/services/api/`
- Each domain has its own service module
- Centralized error handling and request/response transformation

### 4. State Management
- React Context for global state (Auth, Toast)
- Custom hooks for component state logic
- Proper separation of concerns between UI and business logic

### 5. Utility Functions
- Common utilities in `src/utils/`
- Validation functions for form inputs
- Formatting functions for display data
- Helper functions for common operations

### 6. API Integration
- **Base API Client**: Centralized HTTP client with interceptors
- **Service Modules**: Domain-specific API services
- **Custom Hooks**: React hooks for API operations with loading states
- **Error Handling**: Comprehensive error handling with user feedback
- **Type Safety**: Full TypeScript support for all API operations
## Key Features

- **Authentication & Authorization**: Role-based access control
- **Restaurant Management**: Table management, order processing
- **Inventory Management**: Stock tracking, rack management
- **Recipe Management**: Ingredient tracking, cost calculation
- **Sales & Billing**: Invoice generation, payment processing
- **Reporting**: Comprehensive business reports
- **User Management**: Staff and role management

## Development Guidelines

### Component Creation
1. Create components in appropriate directories based on their purpose
2. Use TypeScript interfaces for all props
3. Implement proper error handling
4. Follow consistent naming conventions

### State Management
1. Use React Context for global state
2. Create custom hooks for complex state logic
3. Keep component state minimal and focused

### API Integration
1. Use the centralized API service layer
2. Implement proper error handling
3. Transform data at the service layer, not in components
4. Use custom hooks for API operations
5. Handle loading states consistently
6. Provide user feedback for all operations

### Styling
1. Use Tailwind CSS for styling
2. Create reusable UI components for consistency
3. Follow responsive design principles

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Update VITE_API_URL with your API endpoint
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Contributing

1. Follow the established project structure
2. Write TypeScript interfaces for all new data structures
3. Create reusable components when possible
4. Test your changes thoroughly
5. Follow the existing code style and conventions
6. Use the API integration patterns for all backend communication
7. Implement proper error handling and loading states