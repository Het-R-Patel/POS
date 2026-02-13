import React from 'react';
import { CreditCard, DollarSign, Smartphone, Banknote } from 'lucide-react';
import Card from '../ui/Card';

const PaymentMethodSelector = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const methods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'mobile', label: 'Mobile Pay', icon: Smartphone },
    { id: 'other', label: 'Other', icon: DollarSign },
  ];

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Payment Method
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon
                className={`h-8 w-8 mx-auto mb-2 ${
                  isSelected ? 'text-primary-600' : 'text-gray-600'
                }`}
              />
              <p
                className={`font-medium ${
                  isSelected ? 'text-primary-900' : 'text-gray-900'
                }`}
              >
                {method.label}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default PaymentMethodSelector;
