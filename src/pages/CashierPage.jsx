import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../context/NotificationContext';
import CashierOrderCard from '../components/cashier/CashierOrderCard';
import { CreditCard, DollarSign } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { fetchOrders, updateOrderStatus, updatePaymentStatus } from '../api/ordersApi';
import { selectAllOrders } from '../store/features/order/orderSelectors';
import { 
  setOrders,
  upsertOrder,
} from '../store/features/order/orderSlice';

const CashierPage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const orders = useSelector(selectAllOrders);
  const { addNotification } = useNotifications();
  const [filterStatus, setFilterStatus] = useState('unpaid');

  const ordersQuery = useQuery({
    queryKey: ['orders', 'cashier'],
    queryFn: () => fetchOrders({ page: 1, limit: 100, sortBy: 'createdAt', order: 'desc' }),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  React.useEffect(() => {
    if (ordersQuery.data) {
      dispatch(setOrders(ordersQuery.data));
    }
  }, [ordersQuery.data, dispatch]);

  const updatePaymentStatusMutation = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: (updatedOrder) => {
      dispatch(upsertOrder(updatedOrder));
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (updatedOrder) => {
      dispatch(upsertOrder(updatedOrder));
    },
  });

  const readyOrders = orders.filter(
    order => order.status === 'ready' || order.status === 'completed'
  );

  const filteredOrders = readyOrders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.paymentStatus === filterStatus;
  });

  const handlePaymentComplete = async (orderId, paymentMethod) => {
    const order = orders.find(o => o.id === orderId);
    try {
      await updatePaymentStatusMutation.mutateAsync({
        orderId,
        paymentStatus: 'paid',
        paymentMethod,
      });

      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: 'completed',
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    
      addNotification({
        type: 'success',
        title: 'Payment Received',
        message: `Payment of $${order?.totalAmount.toFixed(2)} received for Table ${order?.tableNumber} via ${paymentMethod}`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Payment Failed',
        message: error?.message || 'Unable to complete payment',
      });
    }
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const filters = [
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Paid', value: 'paid' },
    { label: 'All', value: 'all' },
  ];

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-primary-100 font-medium">Total Revenue</p>
            <DollarSign className="h-8 w-8 text-primary-200" />
          </div>
          <p className="text-4xl font-bold">${getTotalRevenue().toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <p className="text-gray-600 font-medium mb-2">Unpaid Orders</p>
          <p className="text-4xl font-bold text-yellow-600">
            {readyOrders.filter(o => o.paymentStatus === 'unpaid').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <p className="text-gray-600 font-medium mb-2">Paid Orders</p>
          <p className="text-4xl font-bold text-success-600">
            {orders.filter(o => o.paymentStatus === 'paid').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === filter.value
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {ordersQuery.isPending ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <ClipLoader size={42} color="#0EA5E9" loading={ordersQuery.isPending} />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No orders to display</p>
          <p className="text-gray-400 mt-2">
            {filterStatus === 'unpaid' 
              ? 'Pending orders will appear here when ready'
              : 'Completed payments will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredOrders.map(order => (
            <CashierOrderCard
              key={order.id}
              order={order}
              onPaymentComplete={handlePaymentComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CashierPage;
