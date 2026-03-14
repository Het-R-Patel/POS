import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './features/order/orderSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
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
