import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationProvider } from './context/NotificationContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import WaiterPage from './pages/WaiterPage';
import KitchenPage from './pages/KitchenPage';
import CashierPage from './pages/CashierPage';
import AdminPage from './pages/AdminPage';
import TableManagementPage from './pages/features/TableManagementPage';
import InventoryManagementPage from './pages/features/InventoryManagementPage';
import CustomerLoyaltyPage from './pages/features/CustomerLoyaltyPage';
import AIChatBot from './components/ai/AIChatBot';
import { getRoleHomePath, refreshTokenThunk } from './store/features/auth/authSlice';

const LoginOrRoleRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={getRoleHomePath(user?.role)} replace />;
  }

  return <LoginPage />;
};

const RootRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const targetPath = isAuthenticated ? getRoleHomePath(user?.role) : '/login';
  return <Navigate to={targetPath} replace />;
};

const App = () => {
  const { isAuthenticated, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Proactively refresh token if we believe we're authenticated on a fresh load.
    if (isAuthenticated && refreshToken) {
      dispatch(refreshTokenThunk());
    }
  }, [dispatch]); // Only trigger once on mount

  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<LoginOrRoleRedirect />} />

          <Route
            path="/waiter"
            element={
              <ProtectedRoute allowedRoles={['waiter']}>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <WaiterPage />
                  <AIChatBot />

                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute allowedRoles={['kitchen', 'kitech']}>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <KitchenPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier"
            element={
              <ProtectedRoute allowedRoles={['cashier']}>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <CashierPage />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tables"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TableManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InventoryManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loyalty"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomerLoyaltyPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
};

export default App;
