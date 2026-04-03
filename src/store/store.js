import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './features/order/orderSlice';
import authReducer from './features/auth/authSlice';
import notificationsReducer from './features/notifications/notificationSlice';
import adminReducer from './features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
    auth: authReducer,
    notifications: notificationsReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['order/submitOrder'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['order.orders'],
      },
    }),
});

export default store;
