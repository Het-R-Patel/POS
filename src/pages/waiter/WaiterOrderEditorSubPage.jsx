import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import MenuGrid from '../../components/waiter/MenuGrid';
import OrderSummary from '../../components/waiter/OrderSummary';
import Button from '../../components/ui/Button';
import { addItemToCurrentOrder } from '../../store/features/order/orderSlice';
import { selectCurrentOrderItems } from '../../store/features/order/orderSelectors';

const WaiterOrderEditorSubPage = ({
  mode = 'create',
  orderId,
  initialOrderData,
  onBack,
  onSubmitted,
}) => {
  const dispatch = useDispatch();
  const orderItems = useSelector(selectCurrentOrderItems);

  const handleItemQuantityChange = (menuItem, quantity) => {
    dispatch(addItemToCurrentOrder({ menuItem, quantity }));
  };

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Active Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <MenuGrid
            onItemQuantityChange={handleItemQuantityChange}
            orderItems={orderItems}
          />
        </div>

        <div className="lg:col-span-2">
          <OrderSummary
            mode={mode}
            orderId={orderId}
            initialOrderData={initialOrderData}
            onSubmitted={onSubmitted}
            onCancel={onBack}
          />
        </div>
      </div>
    </div>
  );
};

export default WaiterOrderEditorSubPage;
