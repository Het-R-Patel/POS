// Export store
export { store } from './store';

// Export actions
export {
  addItemToCurrentOrder,
  removeItemFromCurrentOrder,
  setTableNumber,
  setWaiterName,
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
  selectCurrentOrderWaiterName,
  selectCurrentOrderTotal,
  selectCurrentOrderItemCount,
  selectAllOrders,
  selectOrdersByStatus,
  selectPendingOrders,
  selectOrderById,
  selectMenuItemQuantity,
} from './features/order/orderSelectors';
