import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './contexts/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Overview from './pages/dashboard/Overview';
import Reports from './pages/dashboard/Reports';
import Sale from './pages/dashboard/Sale';
import Purchase from './pages/dashboard/Purchase';
import Expense from './pages/dashboard/Expense';
import Kot from './pages/dashboard/Kot';
import Offers from './pages/dashboard/Offers';
import Recipe from './pages/dashboard/Recipe';
import Inventory from './pages/dashboard/Inventory';
import Item from './pages/dashboard/Item';
import Party from './pages/dashboard/Party';
import Management from './pages/dashboard/Management';
import TableView from './pages/dashboard/TableView';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="reports" element={<Reports />} />
        <Route path="sale" element={<Sale />} />
        <Route path="purchase" element={<Purchase />} />
        <Route path="expense" element={<Expense />} />
        <Route path="kot" element={<Kot />} />
        <Route path="offers" element={<Offers />} />
        <Route path="recipe" element={<Recipe />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="table-management" element={<TableView />} />
        <Route path="item" element={<Item />} />
        <Route path="party" element={<Party />} />
        <Route path="management" element={<Management />} />
        <Route path="logout" element={<LogoutHandler />} />
      </Route>
      
      <Route path="/" element={<Navigate to="/dashboard\" replace />} />
      <Route path="*" element={<Navigate to="/dashboard\" replace />} />
    </Routes>
  );
  
  function LogoutHandler() {
    React.useEffect(() => {
      logout();
    }, []);
    return <Navigate to="/login" replace />;
  }
}

export default App;