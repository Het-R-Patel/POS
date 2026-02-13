import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    // Sample notifications for demonstration
    {
      id: '1',
      type: 'info',
      title: 'New Order',
      message: 'Table 5 has placed a new order',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Order Ready',
      message: 'Order #1023 is ready for pickup',
      timestamp: new Date(Date.now() - 600000),
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Payment Received',
      message: 'Payment of $85.50 received for Table 8',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
    },
  ]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
