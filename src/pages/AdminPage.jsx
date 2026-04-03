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
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import NotificationBell from '../components/notifications/NotificationBell';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/features/auth/authSlice';
import { fetchDashboardStats, fetchAdminOrders, fetchAdminUsers, fetchAdminMenuItems, createAdminUser } from '../store/features/admin/adminSlice';

const AdminPage = () => {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState('dashboard');
  const { notifications, removeNotification, markAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAdminOrders({ page: 1, limit: 10 }));
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminMenuItems({ page: 1, limit: 50 }));
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
      <aside className="hidden lg:block w-64 bg-white shadow-lg flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Orderly</p>
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
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-semibold">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@restaurant.com</p>
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
      <div className="mb-6 md:mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'waiter',
    phone: '',
    username: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAdminUser({
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      confirmPassword: formData.password
    }));
    setIsDrawerOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'waiter',
      phone: '',
      username: ''
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setIsDrawerOpen(true)}>
          <Plus className="h-5 w-5" />
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-4 md:mb-6" padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search users..."
              className="w-full"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
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
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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

      {/* Add User Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
              required
            />
          </div>
          
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john.doe@restaurant.com"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
            helperText="Minimum 8 characters"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input"
              required
            >
              <option value="waiter">Waiter</option>
              <option value="kitchen">Kitchen Staff</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Permissions</h3>
            <div className="space-y-2">
              {['Take orders', 'Manage menu', 'Process payments', 'View reports'].map((permission) => (
                <label key={permission} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-500 rounded"
                  />
                  <span className="text-gray-700">{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              Create User
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

// Menu Management View
const MenuManagementView = () => {
  const { menuItems } = useSelector((state) => state.admin);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    preparationTime: '',
    tags: '',
    available: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Menu item data:', formData);
    // API logic to create menu item would be dispatched here
    setIsDrawerOpen(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'appetizers',
      preparationTime: '',
      tags: '',
      available: true,
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h2>
          <p className="text-gray-600">Add, edit, or remove menu items</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setIsDrawerOpen(true)}>
          <Plus className="h-5 w-5" />
          Add New Dish
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-4 md:mb-6 overflow-x-auto">
        {['All Items', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages'].map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              cat === 'All Items'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
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
            <p className="text-sm text-gray-500 mb-3">{item.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary-600">
                ${item.price}
              </span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
        onClose={() => setIsDrawerOpen(false)}
        title="Add New Dish"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Dish Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Grilled Salmon"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the dish..."
              rows={4}
              className="input resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="24.99"
              required
            />
            <Input
              label="Prep Time (min)"
              type="number"
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
              placeholder="20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              required
            >
              <option value="appetizers">Appetizers</option>
              <option value="main-courses">Main Courses</option>
              <option value="desserts">Desserts</option>
              <option value="beverages">Beverages</option>
              <option value="sides">Sides</option>
            </select>
          </div>

          <Input
            label="Tags"
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="vegetarian, spicy, popular (comma-separated)"
            helperText="Separate tags with commas"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or WEBP (max. 2MB)
              </p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="h-4 w-4 text-primary-500 rounded"
            />
            <label htmlFor="available" className="text-gray-700 cursor-pointer">
              Available for order
            </label>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutritional Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Calories" type="number" placeholder="450" />
              <Input label="Protein (g)" type="number" placeholder="25" />
              <Input label="Carbs (g)" type="number" placeholder="30" />
              <Input label="Fat (g)" type="number" placeholder="15" />
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              Add Dish
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

// Orders View
const OrdersView = () => {
  const { orders, dashboard } = useSelector((state) => state.admin);
  const orderStats = dashboard?.stats?.orderStats || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Orders Overview</h2>
        <p className="text-gray-600">Monitor all orders across the restaurant</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {[
          { label: 'Pending', count: orderStats?.statusCounts?.pending || 0, color: 'yellow' },
          { label: 'Preparing', count: orderStats?.statusCounts?.preparing || 0, color: 'blue' },
          { label: 'Ready', count: orderStats?.statusCounts?.ready || 0, color: 'green' },
          { label: 'Completed', count: orderStats?.statusCounts?.completed || 0, color: 'gray' },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <Card padding="lg">
        <div className="space-y-4">
          {orders?.list?.map((order, i) => (
            <div key={order.id || i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-bold text-gray-900">Order #{order.orderNumber || order.id || i}</p>
                    <p className="text-sm text-gray-500">Table {order.table?.tableNumber || order.tableId || 'N/A'}</p>
                  </div>
                  <Badge status={order.status?.toLowerCase()} />
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${(order.totalAmount || order.subtotal || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'Just now'}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-4">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!orders?.list || orders?.list?.length === 0) && (
            <p className="text-center text-gray-500 py-4">No orders currently</p>
          )}
        </div>
      </Card>
    </div>
  );
};

// Analytics View
const AnalyticsView = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Track performance and insights</p>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="mb-4 md:mb-6" padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
          <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Items</h3>
          <div className="space-y-3">
            {['Grilled Salmon', 'Beef Steak', 'Caesar Salad', 'Chocolate Cake'].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-700">{item}</span>
                <span className="font-semibold text-gray-900">{45 - i * 5} orders</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Peak Hours</h3>
          <div className="space-y-3">
            {['12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'].map((time, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-700">{time}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: `${100 - i * 15}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{100 - i * 15}%</span>
                </div>
              </div>
            ))}
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
      <div className="mb-6 md:mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your restaurant settings</p>
      </div>

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
