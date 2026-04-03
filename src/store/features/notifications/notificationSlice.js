import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { logoutUser } from '../auth/authSlice';
import {
  cleanupOldReadNotifications,
  createNotification as createNotificationApi,
  deleteAllUserNotifications,
  deleteNotification as deleteNotificationApi,
  fetchNotificationStats,
  fetchNotifications,
  fetchUnreadNotifications,
  markAllUserNotificationsAsRead,
  markNotificationAsRead as markNotificationAsReadApi,
  updateNotification as updateNotificationApi,
} from '../../../api/notificationsApi';

const normalizeNotification = (notification) => {
  const source = notification || {};
  const id = source._id ?? source.id ?? source.notificationId ?? '';

  return {
    id: String(id),
    userId: source.userId?._id ?? source.userId ?? source.user_id ?? null,
    type: source.type ?? 'info',
    title: source.title ?? '',
    message: source.message ?? '',
    priority: source.priority ?? 'medium',
    read: Boolean(source.isRead ?? source.read ?? false),
    timestamp:
      source.createdAt ?? source.timestamp ?? source.sentAt ?? source.updatedAt ?? new Date().toISOString(),
    metadata: source.metadata ?? source.meta ?? {},
  };
};

const normalizeNotificationList = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map(normalizeNotification)
    .filter((notification) => Boolean(notification.id));

const normalizeStats = (stats = {}) => {
  if (!stats || typeof stats !== 'object') {
    return { total: 0, unread: 0, read: 0 };
  }

  return {
    total: Number(stats.total ?? stats.count ?? 0),
    unread: Number(stats.unread ?? stats.unreadCount ?? 0),
    read: Number(stats.read ?? stats.readCount ?? 0),
    byType: stats.byType ?? {},
  };
};

const upsertNotification = (state, notification) => {
  const nextNotification = normalizeNotification(notification);

  if (!nextNotification.id) {
    return;
  }

  const existingIndex = state.items.findIndex((item) => item.id === nextNotification.id);

  if (existingIndex >= 0) {
    state.items[existingIndex] = nextNotification;
    return;
  }

  state.items.unshift(nextNotification);
};

const initialState = {
  items: [],
  stats: {
    total: 0,
    unread: 0,
    read: 0,
    byType: {},
  },
  isLoading: false,
  isStatsLoading: false,
  error: '',
};

const getCurrentUserId = (state) => state?.auth?.user?._id ?? state?.auth?.user?.id ?? '';

export const loadNotifications = createAsyncThunk(
  'notifications/loadNotifications',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      // Allow overriding with null to fetch global notifications
      const userId = params.userId !== undefined ? params.userId : getCurrentUserId(state);
      const notifications = params.includeUnreadOnly
        ? await fetchUnreadNotifications({ ...params, userId })
        : await fetchNotifications({ ...params, userId });

      return normalizeNotificationList(notifications);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to load notifications',
      );
    }
  },
);

export const loadUnreadNotifications = createAsyncThunk(
  'notifications/loadUnreadNotifications',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = params.userId !== undefined ? params.userId : getCurrentUserId(state);
      const notifications = await fetchUnreadNotifications({ ...params, userId });
      return normalizeNotificationList(notifications);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to load unread notifications',
      );
    }
  },
);

export const loadNotificationStats = createAsyncThunk(
  'notifications/loadNotificationStats',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = params.userId ?? getCurrentUserId(state);
      return normalizeStats(await fetchNotificationStats({ userId }));
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to load notification stats',
      );
    }
  },
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (payload, { rejectWithValue }) => {
    try {
      return normalizeNotification(await createNotificationApi(payload));
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to create notification',
      );
    }
  },
);

export const updateNotification = createAsyncThunk(
  'notifications/updateNotification',
  async ({ notificationId, updates }, { rejectWithValue }) => {
    try {
      return normalizeNotification(
        await updateNotificationApi({ notificationId, updates }),
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to update notification',
      );
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      return normalizeNotification(await markNotificationAsReadApi(notificationId));
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to mark notification as read',
      );
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const resolvedUserId = userId ?? getCurrentUserId(state);

      if (!resolvedUserId) {
        return [];
      }

      const response = await markAllUserNotificationsAsRead(resolvedUserId);
      return normalizeNotificationList(response?.notifications ?? response);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to mark all notifications as read',
      );
    }
  },
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await deleteNotificationApi(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to delete notification',
      );
    }
  },
);

export const deleteAllNotificationsForUser = createAsyncThunk(
  'notifications/deleteAllNotificationsForUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const resolvedUserId = userId ?? getCurrentUserId(state);

      if (!resolvedUserId) {
        return [];
      }

      await deleteAllUserNotifications(resolvedUserId);
      return resolvedUserId;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to delete notifications',
      );
    }
  },
);

export const cleanupReadNotifications = createAsyncThunk(
  'notifications/cleanupReadNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await cleanupOldReadNotifications();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Unable to clean up notifications',
      );
    }
  },
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notificationReceived: (state, action) => {
      upsertNotification(state, action.payload);
    },
    notificationsReceived: (state, action) => {
      state.items = normalizeNotificationList(action.payload);
    },
    notificationRemoved: (state, action) => {
      const notificationId = String(action.payload || '');
      state.items = state.items.filter((notification) => notification.id !== notificationId);
    },
    notificationMarkedReadLocal: (state, action) => {
      const notificationId = String(action.payload || '');
      state.items = state.items.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      );
    },
    allNotificationsMarkedReadLocal: (state) => {
      state.items = state.items.map((notification) => ({ ...notification, read: true }));
    },
    notificationsCleared: (state) => {
      state.items = [];
    },
    notificationStatsReceived: (state, action) => {
      state.stats = normalizeStats(action.payload);
    },
    notificationErrorCleared: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loadNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(loadNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load notifications';
      })
      .addCase(loadUnreadNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loadUnreadNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(loadUnreadNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load unread notifications';
      })
      .addCase(loadNotificationStats.pending, (state) => {
        state.isStatsLoading = true;
        state.error = '';
      })
      .addCase(loadNotificationStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.isStatsLoading = false;
      })
      .addCase(loadNotificationStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.error = action.payload || 'Unable to load notification stats';
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        upsertNotification(state, action.payload);
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        upsertNotification(state, action.payload);
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        upsertNotification(state, { ...action.payload, read: true });
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.items = normalizeNotificationList(action.payload);
          return;
        }

        state.items = state.items.map((notification) => ({ ...notification, read: true }));
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((notification) => notification.id !== String(action.payload));
      })
      .addCase(deleteAllNotificationsForUser.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(cleanupReadNotifications.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = normalizeNotificationList(action.payload);
        }
      })
      .addCase(logoutUser, () => initialState);
  },
});

export const {
  notificationReceived,
  notificationsReceived,
  notificationRemoved,
  notificationMarkedReadLocal,
  allNotificationsMarkedReadLocal,
  notificationsCleared,
  notificationStatsReceived,
  notificationErrorCleared,
} = notificationSlice.actions;

export const selectNotificationsState = (state) => state.notifications;

export const selectAllNotifications = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.items,
);

export const selectUnreadNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter((notification) => !notification.read),
);

export const selectUnreadNotificationCount = createSelector(
  [selectUnreadNotifications],
  (notifications) => notifications.length,
);

export const selectNotificationStats = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.stats,
);

export const selectNotificationsLoading = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.isLoading,
);

export const selectNotificationStatsLoading = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.isStatsLoading,
);

export const selectNotificationsError = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.error,
);

export default notificationSlice.reducer;