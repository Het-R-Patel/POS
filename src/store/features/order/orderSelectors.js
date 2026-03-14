import { createSelector } from '@reduxjs/toolkit';

const selectOrderState = (state) => state.order;
const selectCurrentOrder = createSelector([selectOrderState], (order) => order.currentOrder);

export const selectCurrentOrderItems = createSelector(
  [selectCurrentOrder],
  (currentOrder) => currentOrder.items
);

export const selectCurrentOrderTableNumber = createSelector(
  [selectCurrentOrder],
  (currentOrder) => currentOrder.tableNumber
);

export const selectCurrentOrderTableId = createSelector(
  [selectCurrentOrder],
  (currentOrder) => currentOrder.tableId
);

export const selectCurrentOrderWaiterName = createSelector(
  [selectCurrentOrder],
  (currentOrder) => currentOrder.waiterName
);

export const selectCurrentOrderTotal = createSelector([selectCurrentOrderItems], (items) =>
  items.reduce((sum, item) => sum + item.subtotal, 0)
);

export const selectCurrentOrderItemCount = createSelector([selectCurrentOrderItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectAllOrders = createSelector([selectOrderState], (order) => order.orders);

export const selectOrdersByStatus = (status) =>
  createSelector([selectAllOrders], (orders) =>
    orders.filter((order) => order.status === status)
  );

export const selectPendingOrders = createSelector([selectAllOrders], (orders) =>
  orders.filter((order) => order.paymentStatus === 'unpaid')
);

export const selectOrderById = (orderId) =>
  createSelector([selectAllOrders], (orders) =>
    orders.find((order) => order.id === orderId)
  );

export const selectMenuItemQuantity = (menuItemId) =>
  createSelector([selectCurrentOrderItems], (items) => {
    const item = items.find((orderItem) => orderItem.menuItem._id === menuItemId);
    return item ? item.quantity : 0;
  });