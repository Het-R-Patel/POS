import React, { createContext, useContext, useState, useCallback } from 'react';

const OrderContext = createContext(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1);

  const addOrder = useCallback((orderData) => {
    const newOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber: orderCounter,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setOrderCounter(prev => prev + 1);
  }, [orderCounter]);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          updatedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : order.completedAt,
        };
      }
      return order;
    }));
  }, []);

  const updatePaymentStatus = useCallback((orderId, paymentStatus, paymentMethod) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          paymentStatus,
          paymentMethod,
          updatedAt: new Date(),
        };
      }
      return order;
    }));
  }, []);

  const getOrdersByStatus = useCallback((status) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const getPendingOrders = useCallback(() => {
    return orders.filter(order => order.paymentStatus === 'unpaid');
  }, [orders]);

  const getOrderById = useCallback((orderId) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        getOrdersByStatus,
        getPendingOrders,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
