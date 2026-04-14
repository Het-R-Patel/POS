import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const OrderDetails = ({ order }) => {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-500">Table {order?.table?.tableNumber || order?.tableId?.tableNumber || (typeof order.tableNumber === 'object' ? order.tableNumber?.tableNumber : order.tableNumber)}</p>
        </div>
        <Badge status={order.status} />
      </div>

      <div className="space-y-3 mb-6">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-primary-600">
                  {item.quantity}x
                </span>
                <span className="font-medium text-gray-900">{item.name}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ${item.price.toFixed(2)} each
              </p>
            </div>
            <span className="font-semibold text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default OrderDetails;
