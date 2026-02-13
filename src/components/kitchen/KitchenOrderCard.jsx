import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const KitchenOrderCard = ({ order, onStatusUpdate }) => {
  const getTimeElapsed = () => {
    const now = new Date();
    const created = new Date(order.createdAt);
    const minutes = Math.floor((now.getTime() - created.getTime()) / 60000);
    return minutes;
  };

  const timeElapsed = getTimeElapsed();
  const isUrgent = timeElapsed > 15;

  return (
    <Card className={`${isUrgent ? 'border-2 border-accent-400' : ''}`} padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <Badge status={order.status} />
          </div>
          <p className="text-gray-600">Table: {order.tableNumber}</p>
          <p className="text-sm text-gray-500">Waiter: {order.waiterName}</p>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 ${isUrgent ? 'text-accent-600' : 'text-gray-600'}`}>
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{timeElapsed} min ago</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 h-48 overflow-y-auto">
        <h4 className="font-semibold text-gray-900 mb-3">Items:</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {item.quantity}x {item.menuItem.name}
                </p>
                {item.specialInstructions && (
                  <p className="text-sm text-accent-600 mt-1">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ~{item.menuItem.preparationTime} min
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {order.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            onClick={() => onStatusUpdate(order.id, 'preparing')}
            fullWidth
            variant="primary"
          >
            Start Preparing
          </Button>
          <Button
            onClick={() => onStatusUpdate(order.id, 'cancelled')}
            variant="danger"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}

      {order.status === 'preparing' && (
        <div className="flex gap-2">
          <Button
            onClick={() => onStatusUpdate(order.id, 'ready')}
            fullWidth
            variant="success"
          >
            <CheckCircle className="h-5 w-5" />
            Mark as Ready
          </Button>
          <Button
            onClick={() => onStatusUpdate(order.id, 'cancelled')}
            variant="danger"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}

      {order.status === 'ready' && (
        <div className="text-center py-2 bg-success-50 rounded-lg">
          <p className="text-success-700 font-semibold">Ready for Pickup</p>
        </div>
      )}
    </Card>
  );
};

export default KitchenOrderCard;
