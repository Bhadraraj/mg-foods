import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./contexts/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Overview from "./pages/dashboard/Overview";
import Reports from "./pages/dashboard/Reports";
import Sale from "./pages/dashboard/Sale";
import Purchase from "./pages/dashboard/Purchase";
import Expense from "./pages/dashboard/Expense";
import Kot from "./pages/dashboard/Kot";
import Offers from "./pages/dashboard/Offers";
import Recipe from "./pages/dashboard/Recipe";
import Inventory from "./pages/dashboard/Inventory";
import Item from "./pages/dashboard/Item";
import Party from "./pages/dashboard/Party";
import Management from "./pages/dashboard/Management";
import TableView from "./pages/dashboard/TableView";
import { useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";

// Logout Handler Component
const LogoutHandler: React.FC = () => {
  const { logout } = useAuth();
  
  React.useEffect(() => {
    logout();
  }, [logout]);
  
  return <Navigate to="/login" replace />;
};

// Unauthorized Access Component
const UnauthorizedAccess: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but an unexpected error occurred.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<UnauthorizedAccess />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Routes accessible to all authenticated users */}
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'cashier', 'staff', 'chef']}>
                    <Overview />
                  </ProtectedRoute>
                } 
              />

              {/* Admin and Manager only routes */}
              <Route 
                path="reports" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="purchase" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Purchase />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="expense" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Expense />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="offers" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Offers />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="inventory" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Inventory />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="item" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Item />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="party" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <Party />
                  </ProtectedRoute>
                } 
              />

              {/* Sales accessible to admin, manager, cashier */}
              <Route 
                path="sale" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'cashier']}>
                    <Sale />
                  </ProtectedRoute>
                } 
              />

              {/* KOT accessible to admin, manager, staff */}
              <Route 
                path="kot" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}>
                    <Kot />
                  </ProtectedRoute>
                } 
              />

              {/* Recipe accessible to admin, manager, chef */}
              <Route 
                path="recipe" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'chef']}>
                    <Recipe />
                  </ProtectedRoute>
                } 
              />

              {/* Table management for service staff */}
              <Route 
                path="table-management" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}>
                    <TableView />
                  </ProtectedRoute>
                } 
              />

              {/* Admin only routes */}
              <Route 
                path="management" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Management />
                  </ProtectedRoute>
                } 
              />
              
              {/* Logout accessible to all authenticated users */}
              <Route path="logout" element={<LogoutHandler />} />
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;