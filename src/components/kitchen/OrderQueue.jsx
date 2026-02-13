import React from 'react';
import OrderCard from './OrderCard';

const OrderQueue = ({
  orders,
  onUpdateStatus,
  emptyMessage = 'No orders in this queue',
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

export default OrderQueue;
