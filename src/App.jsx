import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { NotificationProvider } from './context/NotificationContext';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import WaiterPage from './pages/WaiterPage';
import KitchenPage from './pages/KitchenPage';
import CashierPage from './pages/CashierPage';
import AdminPage from './pages/AdminPage';
import TableManagementPage from './pages/features/TableManagementPage';
import InventoryManagementPage from './pages/features/InventoryManagementPage';
import CustomerLoyaltyPage from './pages/features/CustomerLoyaltyPage';

const App = () => {
  return (
    <Router>
      <NotificationProvider>
        <OrderProvider>
        <Routes>
          {/* Login route without navigation */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with navigation */}
          <Route path="/waiter" element={
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <WaiterPage />
            </div>
          } />
          <Route path="/kitchen" element={
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <KitchenPage />
            </div>
          } />
          <Route path="/cashier" element={
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <CashierPage />
            </div>
          } />
          
          {/* Admin route without navigation (has its own sidebar) */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Feature routes */}
          <Route path="/tables" element={<TableManagementPage />} />
          <Route path="/inventory" element={<InventoryManagementPage />} />
          <Route path="/loyalty" element={<CustomerLoyaltyPage />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </OrderProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App;
