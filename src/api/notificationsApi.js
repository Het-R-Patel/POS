import axiosInstance from './config';

const extractNotificationList = (payload) => {
  const source = payload?.data ?? payload;

  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.notifications)) return source.notifications;
  if (Array.isArray(source?.data?.notifications)) return source.data.notifications;
  if (Array.isArray(source?.docs)) return source.docs;

  return [];
};

const extractNotificationRecord = (payload) => payload?.data?.data ?? payload?.data ?? payload;

const extractStats = (payload) => {
  const source = payload?.data ?? payload;

  if (source?.stats) return source.stats;
  if (source?.data?.stats) return source.data.stats;
  return source;
};

export const fetchNotifications = async (params = {}) => {
  const { userId, ...query } = params;

  const response = userId
    ? await axiosInstance.get(`/notifications/user/${userId}`, { params: query })
    : await axiosInstance.get('/notifications', { params: query });

  return extractNotificationList(response.data);
};

export const fetchUnreadNotifications = async (params = {}) => {
  const { userId, ...query } = params;

  const response = userId
    ? await axiosInstance.get(`/notifications/user/${userId}/unread`, { params: query })
    : await axiosInstance.get('/notifications', {
        params: { ...query, isRead: false },
      });

  return extractNotificationList(response.data);
};

export const fetchNotificationStats = async ({ userId } = {}) => {
  if (!userId) {
    return { total: 0, unread: 0, read: 0 };
  }

  const response = await axiosInstance.get(`/notifications/user/${userId}/stats`);
  return extractStats(response.data);
};

export const createNotification = async (payload) => {
  const response = await axiosInstance.post('/notifications', payload);
  return extractNotificationRecord(response.data);
};

export const updateNotification = async ({ notificationId, updates }) => {
  const response = await axiosInstance.patch(`/notifications/${notificationId}`, updates);
  return extractNotificationRecord(response.data);
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.patch(`/notifications/${notificationId}/mark-read`);
  return extractNotificationRecord(response.data);
};

export const markAllUserNotificationsAsRead = async (userId) => {
  const response = await axiosInstance.patch(`/notifications/user/${userId}/mark-read-all`);
  return extractNotificationRecord(response.data);
};

export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(`/notifications/${notificationId}`);
  return extractNotificationRecord(response.data);
};

export const deleteAllUserNotifications = async (userId) => {
  const response = await axiosInstance.delete(`/notifications/user/${userId}`);
  return extractNotificationRecord(response.data);
};

export const cleanupOldReadNotifications = async () => {
  const response = await axiosInstance.delete('/notifications/cleanup/old-read');
  return extractNotificationRecord(response.data);
};