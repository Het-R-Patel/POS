const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, 'src', 'pages', 'AdminPage.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Import new components
const newImports = `
import AdminLogin from '../admin/components/AdminLogin';
import OrdersAdminView from '../admin/components/OrdersAdminView';
import TablesAdminView from '../admin/components/TablesAdminView';
import NotificationsAdminView from '../admin/components/NotificationsAdminView';
import { Grid, Bell } from 'lucide-react';
`;
content = content.replace("import { LogOut", `, Grid, Bell, LogOut`);
content = content.replace("import { fetchDashboardStats", newImports + "import { fetchDashboardStats");

// 2. Add auth state
const stateHook = `
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem('adminAccessToken'));
`;
content = content.replace(`  const dispatch = useDispatch();\n  const [activeView, setActiveView] = useState('dashboard');`, stateHook);

// 3. Add admin login block at top of render
const renderHook = `
  if (!isAdminAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />;
  }

  return (
`;
content = content.replace(`  return (\n    <div className="flex h-screen bg-gray-100">`, renderHook + `    <div className="flex h-screen bg-gray-100">`);

// 4. Update sidebar
const newSidebar = `
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
    { id: 'tables', label: 'Table Management', icon: Grid },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
`;
// Replace first occurrence exactly
content = content.replace(/const sidebarItems = \[[\s\S]*?\];/, newSidebar.trim());

// 5. Update logout to also remove admin token
const newLogout = `
  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    dispatch(logoutUser());
    navigate('/login');
  };
`;
content = content.replace(/const handleLogout = \(\) => {[\s\S]*?navigate\('\/login'\);\n  };\n/g, newLogout);

// 6. Replace views router in Content Area
/*
        {/* Content Area *\/}
        <div>
          {activeView === 'dashboard' && <DashboardView />}
          ...
*/
const contentAreaStr = `{/* Content Area */}
        <div>
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'users' && <UserManagementView />}
          {activeView === 'menu' && <MenuManagementView />}
          {activeView === 'tables' && <TablesAdminView />}
          {activeView === 'orders' && <OrdersAdminView />}
          {activeView === 'notifications' && <NotificationsAdminView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'settings' && <SettingsView />}
        </div>`;
content = content.replace(/{\/\* Content Area \*\/}\n        <div>[\s\S]*?<\/div>/, contentAreaStr);

// 7. Delete old OrdersView since we use OrdersAdminView now.
content = content.replace(/const OrdersView = \(\) => {[\s\S]*?\/\/ Analytics View/g, "// Analytics View");

fs.writeFileSync(targetFile, content);
console.log('AdminPage.jsx updated successfully.');
