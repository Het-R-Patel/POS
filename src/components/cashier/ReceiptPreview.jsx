import React from 'react';
import { Printer, Download, Mail } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ReceiptPreview = ({
  order,
  paymentMethod,
}) => {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const currentDate = new Date().toLocaleString();

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Receipt Preview
      </h3>

      {/* Receipt Content */}
      <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg font-mono text-sm mb-4">
        <div className="text-center mb-4">
          <h4 className="font-bold text-lg">RESTAURANT POS</h4>
          <p className="text-xs text-gray-600">123 Main Street</p>
          <p className="text-xs text-gray-600">Phone: (555) 123-4567</p>
        </div>

        <div className="border-t border-b border-gray-300 py-3 my-3 text-xs">
          <div className="flex justify-between mb-1">
            <span>Order #:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Table:</span>
            <span>{order.tableNumber}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Date:</span>
            <span>{currentDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment:</span>
            <span className="uppercase">{paymentMethod}</span>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-300">
            <span>TOTAL:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center mt-4 pt-3 border-t border-gray-300 text-xs">
          <p>Thank you for your visit!</p>
          <p className="text-gray-600">Please come again</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ReceiptPreview;
