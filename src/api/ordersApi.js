import axiosInstance from './config';

const extractOrders = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders;
  return [];
};

export const fetchOrders = async (params = {}) => {
  const response = await axiosInstance.get('/orders', { params });
  return extractOrders(response.data);
};

export const fetchOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data?.data ?? response.data?.order ?? response.data;
};

export const createOrder = async (payload) => {
  const response = await axiosInstance.post('/orders', payload);
  return response.data?.data ?? response.data?.order ?? response.data;
};

export const updateOrderStatus = async ({ orderId, status, cancellationReason }) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
    status,
    ...(cancellationReason ? { cancellationReason } : {}),
  });
  return response.data?.data ?? response.data?.order ?? response.data;
};

export const updatePaymentStatus = async ({ orderId, paymentStatus, paymentMethod }) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/payment-status`, {
    paymentStatus,
    paymentMethod,
  });
  return response.data?.data ?? response.data?.order ?? response.data;
};

export const updateOrderItemStatus = async ({ orderId, orderItemId, status }) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/items/${orderItemId}/status`, {
    status,
  });
  return response.data?.data ?? response.data;
};

export const updateOrderItems = async ({ orderId, items }) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}`, {
      items,
    });
    return response.data?.data ?? response.data?.order ?? response.data;
  } catch (error) {
    if (![404, 405].includes(error?.response?.status)) {
      throw error;
    }

    const response = await axiosInstance.patch(`/orders/${orderId}`, {
      items,
    });
    return response.data?.data ?? response.data?.order ?? response.data;
  }
};
