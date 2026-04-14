import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Upload,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import Modal from '../components/ui/Modal';
import NotificationBell from '../components/notifications/NotificationBell';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/features/auth/authSlice';
import { 
  fetchDashboardStats, 
  fetchAdminOrders, 
  fetchOrderStatistics,
  fetchAdminUsers, 
  fetchAdminMenuItems, 
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  fetchAdminUserById,
  createAdminMenuItem,
  updateAdminMenuItem,
  deleteAdminMenuItem,
  fetchAdminCategories,
  fetchAdminAnalytics
} from '../store/features/admin/adminSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminPage = () => {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState('dashboard');
  const { notifications, removeNotification, markAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAdminOrders({ page: 1, limit: 5 }));
    dispatch(fetchOrderStatistics());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminMenuItems({ page: 1, limit: 50 }));
    dispatch(fetchAdminCategories());
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-white shadow-lg flex-shrink-0 relative">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-display font-bold text-gray-900 tracking-tight">
            Orderly
          </h1>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white hidden lg:block">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-primary-700 font-semibold text-lg uppercase">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate" title={user?.fullName || 'Admin User'}>
                {user?.fullName || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate" title={user?.email || 'admin@restaurant.com'}>
                {user?.email || 'admin@restaurant.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header with Notifications */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeView}</h2>
              <p className="text-sm text-gray-500">Manage your restaurant operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell
                notifications={notifications}
                onRemove={removeNotification}
                onMarkAsRead={markAsRead}
                onClearAll={clearAll}
              />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div>
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'users' && <UserManagementView />}
          {activeView === 'menu' && <MenuManagementView />}
          {activeView === 'orders' && <OrdersView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

// Dashboard View
const DashboardView = () => {
  const { dashboard, users, menuItems, orders } = useSelector((state) => state.admin);
  const orderStats = dashboard?.stats?.orderStats || {};
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Total Users</p>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
          <p className="text-4xl font-bold">{users?.list?.length || 0}</p>
          <p className="text-sm text-blue-100 mt-2">Active Staff</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100">Menu Items</p>
            <UtensilsCrossed className="h-8 w-8 text-green-200" />
          </div>
          <p className="text-4xl font-bold">{menuItems?.list?.length || 0}</p>
          <p className="text-sm text-green-100 mt-2">Available dishes</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100">Total Orders</p>
            <ShoppingBag className="h-8 w-8 text-purple-200" />
          </div>
          <p className="text-4xl font-bold">{orderStats?.totalOrders || orders?.total || 0}</p>
          <p className="text-sm text-purple-100 mt-2">Overall processed</p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100">Revenue</p>
            <BarChart3 className="h-8 w-8 text-orange-200" />
          </div>
          <p className="text-4xl font-bold">${orderStats?.totalRevenue || 0}</p>
          <p className="text-sm text-orange-100 mt-2">Lifetime total</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card padding="lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders?.list?.slice(0, 5).map((order, i) => (
              <div key={order.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.orderNumber || order.id || i}</p>
                  <p className="text-sm text-gray-500">Table {order.table?.tableNumber || order.tableId?.tableNumber || (typeof order.tableId === 'string' ? order.tableId : i)}</p>
                </div>
                <Badge variant="success">{order.status || 'Completed'}</Badge>
              </div>
            ))}
            {(!orders?.list || orders?.list?.length === 0) && (
              <p className="text-sm text-gray-500 text-center">No recent orders</p>
            )}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Active Staff</h3>
          <div className="space-y-3">
            {users?.list?.slice(0, 5).map((user, i) => (
              <div key={user.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">{(user.fullName || user.username || 'A')[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.fullName || user.username}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role || 'Staff'}</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            ))}
            {(!users?.list || users?.list?.length === 0) && (
              <p className="text-sm text-gray-500 text-center">No staff found</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// User Management View
const UserManagementView = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'waiter',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: 'waiter',
      phone: ''
    });
    setSelectedUser(null);
    setError(null);
    setSuccess(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (user) => {
    resetForm();
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
      fullName: user.fullName || '',
      role: user.role || 'waiter',
      phone: user.phone || ''
    });
    setIsDrawerOpen(true);
  };

  const handleOpenView = async (user) => {
    try {
      const response = await dispatch(fetchAdminUserById(user.id || user._id)).unwrap();
      setSelectedUser(response);
    } catch (err) {
      setSelectedUser(user); // fallback to list data
    }
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await dispatch(deleteAdminUser(selectedUser.id || selectedUser._id)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedUser && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (selectedUser) {
        const { password, confirmPassword, ...updateData } = formData;
        const submitData = password ? { ...updateData, password } : updateData;
        await dispatch(updateAdminUser({ id: selectedUser.id || selectedUser._id, userData: submitData })).unwrap();
        setSuccess(true);
        setTimeout(() => {
          setIsDrawerOpen(false);
          resetForm();
        }, 1500);
      } else {
        await dispatch(createAdminUser(formData)).unwrap();
        setSuccess(true);
        setTimeout(() => {
          setIsDrawerOpen(false);
          resetForm();
        }, 1500);
      }
    } catch (err) {
      setError(err || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Search and Filters */}
      <Card className="mb-4 md:mb-6" padding="md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Input
              type="text"
              placeholder="Search users..."
              className="w-full"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="primary" onClick={handleOpenCreate} className="flex-1 md:flex-none">
              <Plus className="h-4 w-4 mr-1" />
              Add User
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">User</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">Role</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 hidden sm:table-cell">Joined</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users?.list?.map((user, i) => (
                <tr key={user.id || i} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{user.fullName || user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <Badge variant="info">{user.role}</Badge>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <Badge variant={user.isActive !== false ? 'success' : 'default'}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : `Jan ${i + 1}, 2026`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => handleOpenView(user)}>
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => handleOpenEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleOpenDelete(user)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!users?.list || users?.list?.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drawer for Add/Edit User */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          resetForm();
        }}
        title={selectedUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
              {selectedUser ? "User updated successfully!" : "User created successfully!"}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
            required
            disabled={loading}
          />
          
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe"
            required
            disabled={loading}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john.doe@restaurant.com"
            required
            disabled={loading}
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            disabled={loading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={selectedUser ? "New Password (Optional)" : "Password"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required={!selectedUser}
              helperText="Minimum 8 characters"
              disabled={loading}
            />
            <Input
              label={selectedUser ? "Confirm New Password" : "Confirm Password"}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required={!selectedUser && !!formData.password}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              required
              disabled={loading}
            >
              <option value="waiter">Waiter</option>
              <option value="kitchen">Kitchen Staff</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsDrawerOpen(false);
                  resetForm();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? (selectedUser ? 'Updating...' : 'Creating...') : (selectedUser ? 'Save Updates' : 'Create User')}
              </Button>
            </div>
          </div>
        </form>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="md"
      >
        <div className="p-4 md:p-6 space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the user <strong>{selectedUser?.fullName || selectedUser?.username}</strong>? This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteUser} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
        size="md"
      >
        <div className="p-4 md:p-6">
          {selectedUser ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-xl font-bold text-primary-700">
                  {selectedUser.fullName?.charAt(0) || selectedUser.username?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.fullName}</h3>
                  <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <Badge variant="info">{selectedUser.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Badge variant={selectedUser.isActive !== false ? 'success' : 'default'}>
                    {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {selectedUser.lastLogin && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Last Login</p>
                    <p className="font-medium text-gray-900">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedUser(null);
                }}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">Loading user details...</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

// Menu Management View
const MenuManagementView = () => {
  const dispatch = useDispatch();
  const { menuItems, categories } = useSelector((state) => state.admin);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    // Re-fetch menu items when category filter changes
    dispatch(fetchAdminMenuItems({ page: 1, limit: 50, category: activeCategory }));
  }, [dispatch, activeCategory]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    itemCode: '',
    name: '',
    category: '', 
    price: '',
    description: '',
    imageUrl: '',
    isAvailable: true,
    preparationTime: '',
    calories: '',
    tags: '',
  });

  const resetForm = () => {
    setFormData({
      itemCode: '',
      name: '',
      category: '',
      price: '',
      description: '',
      imageUrl: '',
      isAvailable: true,
      preparationTime: '',
      calories: '',
      tags: '',
    });
    setSelectedMenuItem(null);
    setError(null);
    setSuccess(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item) => {
    resetForm();
    setSelectedMenuItem(item);
    
    // Convert tags array to comma-separated string for editing
    const tagsString = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
    
    setFormData({
      itemCode: item.itemCode || '',
      name: item.name || '',
      category: typeof item.category === 'object' ? (item.category?._id || '') : (item.category || ''),
      price: item.price || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable !== false,
      preparationTime: item.preparationTime || '',
      calories: item.calories || '',
      tags: tagsString,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedMenuItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    try {
      await dispatch(deleteAdminMenuItem(selectedMenuItem.id || selectedMenuItem._id)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedMenuItem(null);
    } catch (err) {
      console.error('Failed to delete menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Process payload according to schema
      const payload = {
        itemCode: formData.itemCode.trim(),
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        isAvailable: formData.isAvailable
      };

      if (formData.description) payload.description = formData.description;
      if (formData.imageUrl) payload.imageUrl = formData.imageUrl;
      if (formData.preparationTime !== '') payload.preparationTime = Number(formData.preparationTime);
      if (formData.calories !== '') payload.calories = Number(formData.calories);
      
      if (formData.tags) {
        payload.tags = formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean);
      } else {
        payload.tags = [];
      }

      if (selectedMenuItem) {
        await dispatch(updateAdminMenuItem({ id: selectedMenuItem.id || selectedMenuItem._id, menuData: payload })).unwrap();
        setSuccess(true);
        setTimeout(() => {
          setIsDrawerOpen(false);
          resetForm();
        }, 1500);
      } else {
        await dispatch(createAdminMenuItem(payload)).unwrap();
        setSuccess(true);
        setTimeout(() => {
          setIsDrawerOpen(false);
          resetForm();
        }, 1500);
      }
    } catch (err) {
      setError(err || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Search and Category Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeCategory === ''
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Items
          </button>
          {categories?.list?.map((cat) => (
            <button
              key={cat.id || cat._id}
              onClick={() => setActiveCategory(cat.id || cat._id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeCategory === (cat.id || cat._id)
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        <Button variant="primary" onClick={handleOpenCreate} className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Dish
        </Button>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {menuItems?.list?.map((item, i) => (
          <Card key={item.id || item._id || i} padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="h-8 w-8 text-gray-400" />
              </div>
              <Badge variant={item.isAvailable !== false ? 'success' : 'error'}>
                {item.isAvailable !== false ? 'Available' : 'Out of Stock'}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{item.category?.name || item.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary-600">
                ${item.price}
              </span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => handleOpenEdit(item)}>
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleOpenDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {(!menuItems?.list || menuItems?.list?.length === 0) && (
           <p className="col-span-full text-center text-gray-500 py-8">No menu items found</p>
        )}
      </div>

      {/* Add Dish Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          resetForm();
        }}
        title={selectedMenuItem ? "Edit Dish" : "Add New Dish"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
              {selectedMenuItem ? "Menu item updated successfully!" : "Menu item created successfully!"}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Item Code"
              type="text"
              value={formData.itemCode}
              onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
              placeholder="e.g., BUR-01"
              maxLength={20}
              required
              disabled={loading}
            />
            <Input
              label="Dish Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Classic Burger"
              maxLength={100}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              required
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories?.list?.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="12.99"
              required
              disabled={loading}
            />
            <div className="flex flex-col justify-center">
              <label className="flex items-center space-x-3 cursor-pointer mt-6">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 text-primary-500 rounded"
                  disabled={loading}
                />
                <span className="text-gray-700">Currently Available</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the dish..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prep Time (min) (Optional)"
              type="number"
              min="0"
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
              placeholder="15"
              disabled={loading}
            />
            <Input
              label="Calories (Optional)"
              type="number"
              min="0"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              placeholder="850"
              disabled={loading}
            />
          </div>

          <Input
            label="Tags (Optional)"
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="popular, recommended"
            helperText="Separate tags with commas"
            disabled={loading}
          />

          <Input
            label="Image URL (Optional)"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/images/burger.jpg"
            disabled={loading}
          />

          <div className="border-t border-gray-200 pt-3">
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsDrawerOpen(false);
                  resetForm();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? (selectedMenuItem ? 'Updating...' : 'Saving...') : (selectedMenuItem ? 'Save Updates' : 'Add Dish')}
              </Button>
            </div>
          </div>
        </form>
      </Drawer>

      {/* Delete Confirmation Modal for Menu Item */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="md"
      >
        <div className="p-4 md:p-6 space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the menu item <strong>{selectedMenuItem?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteItem} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Item'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Orders View
const OrdersView = () => {
  const dispatch = useDispatch();
  const { orders, orderStats } = useSelector((state) => state.admin);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const statsData = orderStats?.data?.byStatus || orderStats?.data || {};

  const currentPage = orders?.pagination?.page || 1;
  const limit = orders?.pagination?.limit || 5;
  const totalOrders = orders?.pagination?.total || 0;
  const totalPages = Math.ceil(totalOrders / limit) || 1;

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchAdminOrders({ page: newPage, limit, sortBy: 'createdAt', order: 'desc' }));
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {(orders.error || orderStats.error) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">
            Error loading orders data: {orders.error || orderStats.error}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
        {[
          { label: 'Pending', data: statsData.pending || { count: 0, totalAmount: 0 }, color: 'yellow' },
          { label: 'Preparing', data: statsData.preparing || { count: 0, totalAmount: 0 }, color: 'blue' },
          { label: 'Ready', data: statsData.ready || { count: 0, totalAmount: 0 }, color: 'green' },
          { label: 'Completed', data: statsData.completed || { count: 0, totalAmount: 0 }, color: 'gray' },
          { label: 'Cancelled', data: statsData.cancelled || { count: 0, totalAmount: 0 }, color: 'red' },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{stat.data.count}</p>
              <p className="text-sm font-medium text-gray-500 pb-1">${stat.data.totalAmount.toFixed(2)}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <Card padding="lg">
        <div className="space-y-4">
          {orders?.list?.map((order, i) => (
            <div key={order._id || i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-1">
                  <div>
                    <p className="font-bold text-gray-900">Order #{order.orderNumber || i}</p>
                    <p className="text-sm text-gray-500">
                      Table {order.tableId?.tableNumber || (typeof order.tableId === 'string' ? order.tableId : 'N/A')}
                    </p>
                  </div>
                  <Badge status={order.status?.toLowerCase()} />
                  <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {order.paymentStatus?.toUpperCase() || 'UNPAID'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span className="capitalize bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                    {order.orderType?.replace('-', ' ') || 'dine-in'}
                  </span>
                  {order.waiterId?.fullName && (
                    <span>Waiter: {order.waiterId.fullName}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${(order.totalAmount || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4 flex-shrink-0"
                onClick={() => handleViewOrder(order)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!orders?.list || orders?.list?.length === 0) && (
            <p className="text-center text-gray-500 py-4">No orders currently</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalOrders > 0 && (
          <div className="flex items-center justify-between border-t pt-4 mt-4">
            <span className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * limit + 1, totalOrders)} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || orders.loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-700 font-medium px-4 py-2 bg-gray-50 rounded-md">
                  {currentPage} / {totalPages}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || orders.loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={`Order #${selectedOrder?.orderNumber || 'Details'}`}>
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center space-x-2">
                  <Badge status={selectedOrder.status?.toLowerCase()} />
                  <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {selectedOrder.paymentStatus?.toUpperCase() || 'UNPAID'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">${(selectedOrder.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Table</span>
                <span className="font-medium text-gray-900">
                  {selectedOrder.tableId?.tableNumber || (typeof selectedOrder.tableId === 'string' ? selectedOrder.tableId : 'N/A')}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Order Type</span>
                <span className="font-medium text-gray-900 capitalize">
                  {selectedOrder.orderType?.replace('-', ' ') || 'Dine In'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Time</span>
                <span className="font-medium text-gray-900">
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Waiter</span>
                <span className="font-medium text-gray-900">
                  {selectedOrder.waiterId?.fullName || 'N/A'}
                </span>
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{item.quantity}x</span>
                        <span className="text-gray-700">{item.menuItemId?.name || item.name || 'Unknown Item'}</span>
                      </div>
                      <span className="text-gray-900 font-medium">
                        ${((item.price || item.menuItemId?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Analytics View
const AnalyticsView = () => {
  const dispatch = useDispatch();
  const { analytics } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  if (analytics.loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (analytics.error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {analytics.error}
        </div>
      </div>
    );
  }

  const data = analytics.data || {};
  const revenueOverview = data.revenueOverview || [];
  const topSellingItems = data.topSellingItems || [];
  const peakHours = data.peakHours || [];

  const lineChartData = {
    labels: revenueOverview.map((item) => item.date),
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenueOverview.map((item) => item.revenue),
        borderColor: '#0284c7', // primary-600
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6', // gray-100
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const maxPeakOrder = Math.max(...peakHours.map((ph) => ph.orders), 1);

  return (
    <div className="p-8">
      {/* Revenue Chart */}
      <Card className="mb-4 md:mb-6" padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
          <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="h-80 w-full relative">
          {revenueOverview.length > 0 ? (
            <Line data={lineChartData} options={lineChartOptions} />
          ) : (
            <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No data available</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Items</h3>
          <div className="space-y-4">
            {topSellingItems.length > 0 ? (
              topSellingItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 w-4 font-medium">{i + 1}.</span>
                    <span className="text-gray-800 font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {item.totalOrders} orders
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No top selling items yet.</p>
            )}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Peak Hours</h3>
          <div className="space-y-4">
            {peakHours.length > 0 ? (
              peakHours.map((time, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700 w-1/3 text-sm">{time.timeRange}</span>
                  <div className="flex-1 mx-4 flex items-center space-x-2">
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${(time.orders / maxPeakOrder) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                    {time.orders}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No peak hour data available.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Settings View
const SettingsView = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl space-y-4 md:space-y-6">
        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Restaurant Information</h3>
          <div className="space-y-4">
            <Input label="Restaurant Name" placeholder="Your Restaurant Name" />
            <Input label="Address" placeholder="123 Main St, City, State" />
            <Input label="Phone" placeholder="+1 (555) 123-4567" />
            <Input label="Email" type="email" placeholder="contact@restaurant.com" />
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Business Hours</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-gray-700">Monday - Friday</span>
              <div className="flex items-center space-x-2">
                <Input type="time" className="w-28 md:w-32" placeholder="9:00 AM" />
                <span className="text-sm">to</span>
                <Input type="time" className="w-28 md:w-32" placeholder="10:00 PM" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Saturday - Sunday</span>
              <div className="flex items-center space-x-2">
                <Input type="time" className="w-28 md:w-32" placeholder="10:00 AM" />
                <span className="text-sm">to</span>
                <Input type="time" className="w-28 md:w-32" placeholder="11:00 PM" />
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {['New order alerts', 'Low inventory warnings', 'Daily reports', 'Staff clock-in/out'].map((item) => (
              <label key={item} className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-primary-500 rounded" defaultChecked />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
