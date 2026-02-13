import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useNotifications } from '../context/NotificationContext';
import MenuGrid from '../components/waiter/MenuGrid';
import OrderSummary from '../components/waiter/OrderSummary';

const WaiterPage = () => {
  const { addOrder } = useOrders();
  const { addNotification } = useNotifications();
  const [orderItems, setOrderItems] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [waiterName, setWaiterName] = useState('');

  const handleItemQuantityChange = (menuItem, quantity) => {
    setOrderItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.menuItem.id === menuItem.id
      );

      if (quantity === 0) {
        // Remove item if quantity is 0
        return prevItems.filter(item => item.menuItem.id !== menuItem.id);
      }

      const newItem = {
        id: `item-${menuItem.id}`,
        menuItem,
        quantity,
        subtotal: menuItem.price * quantity,
        name: menuItem.name,
        price: menuItem.price,
      };

      if (existingItemIndex >= 0) {
        // Update existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex] = newItem;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });
  };

  const handleRemoveItem = (itemId) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleSubmitOrder = () => {
    if (orderItems.length === 0 || !tableNumber || !waiterName) return;

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    addOrder({
      tableNumber,
      items: orderItems,
      status: 'pending',
      totalAmount,
      paymentStatus: 'unpaid',
      waiterName,
      timestamp: new Date(),
    });

    // Add success notification
    addNotification({
      type: 'success',
      title: 'Order Submitted',
      message: `Order for Table ${tableNumber} has been sent to the kitchen successfully!`,
    });

    // Reset form
    setOrderItems([]);
    setTableNumber('');
  };

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <MenuGrid onItemQuantityChange={handleItemQuantityChange} />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary
            items={orderItems}
            tableNumber={tableNumber}
            waiterName={waiterName}
            onTableNumberChange={setTableNumber}
            onWaiterNameChange={setWaiterName}
            onRemoveItem={handleRemoveItem}
            onSubmitOrder={handleSubmitOrder}
            onClearOrder={handleClearOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default WaiterPage;
