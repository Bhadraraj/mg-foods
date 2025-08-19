# MG Foodcourt Dashboard

A comprehensive restaurant management system built with React, TypeScript, and Tailwind CSS.

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
├── contexts/            # React contexts (Auth, Toast, etc.)
├── hooks/               # Global custom hooks
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
├── services/            # API services
│   └── api/            # API service modules
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
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

### Styling
1. Use Tailwind CSS for styling
2. Create reusable UI components for consistency
3. Follow responsive design principles

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Contributing

1. Follow the established project structure
2. Write TypeScript interfaces for all new data structures
3. Create reusable components when possible
4. Test your changes thoroughly
5. Follow the existing code style and conventions