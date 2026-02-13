import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CreditCard, DollarSign, Smartphone, Receipt } from 'lucide-react';

const CashierOrderCard = ({ order, onPaymentComplete }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null);

  const handlePayment = () => {
    if (selectedPaymentMethod) {
      onPaymentComplete(order.id, selectedPaymentMethod);
      setSelectedPaymentMethod(null);
    }
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'card', label: 'Card', icon: CreditCard },
    { value: 'mobile', label: 'Mobile', icon: Smartphone },
  ];

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <Badge status={order.status} />
          </div>
          <p className="text-gray-600">Table: {order.tableNumber}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="text-right">
          {order.paymentStatus === 'paid' ? (
            <Badge variant="success">Paid</Badge>
          ) : (
            <Badge variant="warning">Unpaid</Badge>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Items:</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span className="text-gray-700">
                {item.quantity}x {item.menuItem.name}
              </span>
              <span className="font-medium text-gray-900">
                ${item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">Total</span>
          <span className="text-3xl font-bold text-primary-600">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Section */}
      {order.paymentStatus === 'unpaid' && (
        <>
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-3">Payment Method:</h4>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.value}
                    onClick={() => setSelectedPaymentMethod(method.value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === method.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod}
            fullWidth
            variant="success"
            size="lg"
          >
            <Receipt className="h-5 w-5" />
            Complete Payment
          </Button>
        </>
      )}

      {order.paymentStatus === 'paid' && (
        <div className="text-center py-3 bg-success-50 rounded-lg">
          <p className="text-success-700 font-semibold">
            Payment Completed ({order.paymentMethod})
          </p>
        </div>
      )}
    </Card>
  );
};

export default CashierOrderCard;
