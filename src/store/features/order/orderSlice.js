import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentOrder: {
    items: [],
    tableId: '',
    tableNumber: '',
    waiterId: '',
    waiterName: '',
  },
  orders: [],
  orderCounter: 1,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addItemToCurrentOrder: (state, action) => {
      const { menuItem, quantity } = action.payload;
      const existingItemIndex = state.currentOrder.items.findIndex(
        (item) => item.menuItem._id === menuItem._id
      );

      if (quantity === 0) {
        state.currentOrder.items = state.currentOrder.items.filter(
          (item) => item.menuItem._id !== menuItem._id
        );
      } else {
        const newItem = {
          id: `item-${menuItem._id}`,
          menuItem,
          quantity,
          subtotal: menuItem.price * quantity,
          name: menuItem.name,
          price: menuItem.price,
        };

        if (existingItemIndex >= 0) {
          state.currentOrder.items[existingItemIndex] = newItem;
        } else {
          state.currentOrder.items.push(newItem);
        }
      }
    },

    removeItemFromCurrentOrder: (state, action) => {
      const itemId = action.payload;
      state.currentOrder.items = state.currentOrder.items.filter(
        (item) => item.id !== itemId
      );
    },

    setTableNumber: (state, action) => {
      const payload = action.payload;

      if (typeof payload === 'object' && payload !== null) {
        state.currentOrder.tableId = payload.tableId ?? '';
        state.currentOrder.tableNumber = payload.tableNumber ?? '';
        return;
      }

      state.currentOrder.tableId = '';
      state.currentOrder.tableNumber = payload;
    },

    setWaiterName: (state, action) => {
      state.currentOrder.waiterName = action.payload;
    },

    setWaiterIdentity: (state, action) => {
      const payload = action.payload || {};
      state.currentOrder.waiterId = payload.waiterId ?? '';
      state.currentOrder.waiterName = payload.waiterName ?? '';
    },

    hydrateCurrentOrder: (state, action) => {
      const payload = action.payload || {};
      state.currentOrder = {
        items: Array.isArray(payload.items) ? payload.items : [],
        tableId: payload.tableId ?? '',
        tableNumber: payload.tableNumber ?? '',
        waiterId: payload.waiterId ?? state.currentOrder.waiterId ?? '',
        waiterName: payload.waiterName ?? '',
      };
    },

    setOrders: (state, action) => {
      const incomingOrders = Array.isArray(action.payload) ? action.payload : [];
      state.orders = incomingOrders;
    },

    upsertOrder: (state, action) => {
      const nextOrder = action.payload;
      const orderId = nextOrder?.id;

      if (!orderId) {
        return;
      }

      const existingIndex = state.orders.findIndex((order) => order.id === orderId);

      if (existingIndex >= 0) {
        state.orders[existingIndex] = nextOrder;
      } else {
        state.orders.unshift(nextOrder);
      }
    },

    resetCurrentOrderAfterSubmit: (state) => {
      state.currentOrder = {
        items: [],
        tableId: '',
        tableNumber: '',
        waiterId: state.currentOrder.waiterId,
        waiterName: state.currentOrder.waiterName,
      };
    },

    submitOrder: (state) => {
      const totalAmount = state.currentOrder.items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      const newOrder = {
        id: `order-${Date.now()}`,
        orderNumber: state.orderCounter,
        tableNumber: state.currentOrder.tableNumber,
        items: state.currentOrder.items,
        status: 'pending',
        totalAmount,
        paymentStatus: 'unpaid',
        waiterName: state.currentOrder.waiterName,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.orders.unshift(newOrder);
      state.orderCounter += 1;

      state.currentOrder = {
        items: [],
        tableId: '',
        tableNumber: '',
        waiterId: state.currentOrder.waiterId,
        waiterName: state.currentOrder.waiterName,
      };
    },

    clearCurrentOrder: (state) => {
      state.currentOrder.items = [];
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((order) => order.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        if (status === 'completed') {
          order.completedAt = new Date().toISOString();
        }
      }
    },

    updatePaymentStatus: (state, action) => {
      const { orderId, paymentStatus, paymentMethod } = action.payload;
      const order = state.orders.find((order) => order.id === orderId);
      if (order) {
        order.paymentStatus = paymentStatus;
        order.paymentMethod = paymentMethod;
        order.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addItemToCurrentOrder,
  removeItemFromCurrentOrder,
  setTableNumber,
  setWaiterName,
  setWaiterIdentity,
  hydrateCurrentOrder,
  setOrders,
  upsertOrder,
  resetCurrentOrderAfterSubmit,
  submitOrder,
  clearCurrentOrder,
  updateOrderStatus,
  updatePaymentStatus,
} = orderSlice.actions;

export default orderSlice.reducer;