import React from 'react';
import { Clock, Users } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const OrderCard = ({
  order,
  onUpdateStatus,
  showActions = true,
}) => {
  const getElapsedTime = () => {
    const now = new Date();
    const orderTime = new Date(order.timestamp);
    const diff = Math.floor((now.getTime() - orderTime.getTime()) / 1000 / 60);
    return diff;
  };

  const elapsedTime = getElapsedTime();
  const isUrgent = elapsedTime > 15;

  return (
    <Card
      padding="lg"
      className={`${
        isUrgent ? 'border-2 border-red-500 shadow-lg' : ''
      } hover:shadow-xl transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Order #{order.id}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Table {order.tableNumber}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge status={order.status} />
          <div
            className={`flex items-center text-sm ${
              isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'
            }`}
          >
            <Clock className="h-4 w-4 mr-1" />
            {elapsedTime}m ago
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-primary-600">
                {item.quantity}x
              </span>
              <span className="text-gray-900">{item.name}</span>
            </div>
            {item.preparationTime && (
              <span className="text-sm text-gray-500">
                ~{item.preparationTime}m
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          {order.status === 'pending' && (
            <Button
              variant="primary"
              fullWidth
              onClick={() => onUpdateStatus(order.id, 'preparing')}
            >
              Start Cooking
            </Button>
          )}
          {order.status === 'preparing' && (
            <Button
              variant="success"
              fullWidth
              onClick={() => onUpdateStatus(order.id, 'ready')}
            >
              Mark as Ready
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              variant="outline"
              fullWidth
              onClick={() => onUpdateStatus(order.id, 'served')}
            >
              Served
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default OrderCard;
