import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNotification,
  deleteAllNotificationsForUser,
  deleteNotification,
  loadNotificationStats,
  loadNotifications,
  markNotificationAsRead,
  notificationErrorCleared,
  selectAllNotifications,
  selectNotificationStats,
  selectNotificationsError,
  selectNotificationsLoading,
  selectUnreadNotificationCount,
  notificationsCleared,
} from '../store';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const unreadCount = useSelector(selectUnreadNotificationCount);
  const stats = useSelector(selectNotificationStats);
  const isLoading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);
  const authUser = useSelector((state) => state.auth.user);
  const currentUserId = authUser?._id || authUser?.id || '';

  const addNotification = (notification) =>
    dispatch(
      createNotification({
        ...notification,
        userId: notification?.userId ?? currentUserId ?? null,
      }),
    );

  const removeNotification = (notificationId) => dispatch(deleteNotification(notificationId));

  const markAsRead = (notificationId) => dispatch(markNotificationAsRead(notificationId));

  const clearAll = () => {
    if (currentUserId) {
      dispatch(deleteAllNotificationsForUser(currentUserId));
      return;
    }

    dispatch(notificationsCleared());
  };

  const refreshNotifications = (params = {}) =>
    dispatch(loadNotifications({ ...params, userId: params.userId !== undefined ? params.userId : null }));

  return {
    notifications,
    unreadCount,
    stats,
    isLoading,
    error,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    refreshNotifications,
    clearError: () => dispatch(notificationErrorCleared()),
  };
};

export const NotificationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUserId = authUser?._id || authUser?.id || '';

  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      return;
    }

    const fetchAll = () => {
      // Fetch global notifications so they appear across all interfaces
      dispatch(loadNotifications({ userId: null, page: 1, limit: 50, sortBy: 'createdAt', order: 'desc' }));
      dispatch(loadNotificationStats({ userId: currentUserId }));
    };

    // Initial fetch
    fetchAll();

    // Poll every 5 seconds for new notifications
    const intervalId = setInterval(fetchAll, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, isAuthenticated, currentUserId]);

  return children;
};
