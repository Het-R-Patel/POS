import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChefHat,
  Users,
  CreditCard,
  LogOut,
} from "lucide-react";
import NotificationBell from "./notifications/NotificationBell";
import { useNotifications } from "../context/NotificationContext";
import { logoutUser, normalizeRole } from "../store/features/auth/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, removeNotification, markAsRead, clearAll } =
    useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = normalizeRole(user?.role);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Core navigation items (always visible)
  const roleNavItemsMap = {
    waiter: [{ path: "/waiter", label: "Waiter", icon: Users }],
    kitchen: [{ path: "/kitchen", label: "Kitchen", icon: ChefHat }],
    cashier: [{ path: "/cashier", label: "Cashier", icon: CreditCard }],
    admin: [
      { path: "/waiter", label: "Waiter", icon: Users },
      { path: "/kitchen", label: "Kitchen", icon: ChefHat },
      { path: "/cashier", label: "Cashier", icon: CreditCard },
    ],
  };

  const coreNavItems = roleNavItemsMap[currentRole] || [
    { path: "/waiter", label: "Waiter", icon: Users },
    { path: "/kitchen", label: "Kitchen", icon: ChefHat },
    { path: "/cashier", label: "Cashier", icon: CreditCard },
  ];

  const allNavItems = [...coreNavItems];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
            <span className="text-lg md:text-xl font-display font-bold text-secondary-800">
              Orderly
            </span>
          </div>

          {/* Desktop navigation - all items */}
          <div className="hidden xl:flex items-center space-x-1">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}

            {/* Notification Bell */}
            <NotificationBell
              notifications={notifications}
              onRemove={removeNotification}
              onMarkAsRead={markAsRead}
              onClearAll={clearAll}
            />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-gray-600 hover:bg-red-50 hover:text-red-600 ml-2"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>

          {/* Tablet navigation - core items only */}
          <div className="hidden lg:flex xl:hidden items-center space-x-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}

            {/* Notification Bell */}
            <NotificationBell
              notifications={notifications}
              onRemove={removeNotification}
              onMarkAsRead={markAsRead}
              onClearAll={clearAll}
            />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-gray-600 hover:bg-red-50 hover:text-red-600 ml-2"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile menu - icons only */}
          <div className="flex lg:hidden items-center space-x-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}

            {/* Mobile Notification Bell */}
            <NotificationBell
              notifications={notifications}
              onRemove={removeNotification}
              onMarkAsRead={markAsRead}
              onClearAll={clearAll}
            />

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-all text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
