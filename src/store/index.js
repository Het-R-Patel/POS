// Export store
export { store } from './store';

export { loginUser, logoutUser, clearAuthError, getRoleHomePath, normalizeRole } from './features/auth/authSlice';

// Export actions
export {
  addItemToCurrentOrder,
  removeItemFromCurrentOrder,
  setTableNumber,
  setWaiterName,
  setWaiterIdentity,
  setOrders,
  upsertOrder,
  resetCurrentOrderAfterSubmit,
  submitOrder,
  clearCurrentOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from './features/order/orderSlice';

// Export selectors
export {
  selectCurrentOrderItems,
  selectCurrentOrderTableId,
  selectCurrentOrderTableNumber,
  selectCurrentOrderWaiterId,
  selectCurrentOrderWaiterName,
  selectCurrentOrderTotal,
  selectCurrentOrderItemCount,
  selectAllOrders,
  selectOrdersByStatus,
  selectPendingOrders,
  selectOrderById,
  selectMenuItemQuantity,
} from './features/order/orderSelectors';
