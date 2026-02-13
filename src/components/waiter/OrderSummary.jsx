import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Trash2, ShoppingCart } from 'lucide-react';

const OrderSummary = ({
  items,
  tableNumber,
  waiterName,
  onTableNumberChange,
  onWaiterNameChange,
  onRemoveItem,
  onSubmitOrder,
  onClearOrder,
}) => {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="sticky top-4" padding="md">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <ShoppingCart className="h-6 w-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Table Number
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => onTableNumberChange(e.target.value)}
            placeholder="Enter table number"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Waiter Name
          </label>
          <input
            type="text"
            value={waiterName}
            onChange={(e) => onWaiterNameChange(e.target.value)}
            placeholder="Enter your name"
            className="input"
          />
        </div>
      </div>

      {/* Order Items */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Items ({itemCount})
        </h3>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No items added yet</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.menuItem.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-accent-500 hover:text-accent-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-primary-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={onSubmitOrder}
          disabled={items.length === 0 || !tableNumber || !waiterName}
          fullWidth
          variant="success"
          size="lg"
        >
          Submit Order
        </Button>
        <Button
          onClick={onClearOrder}
          disabled={items.length === 0}
          fullWidth
          variant="outline"
        >
          Clear Order
        </Button>
      </div>
    </Card>
  );
};

export default OrderSummary;
