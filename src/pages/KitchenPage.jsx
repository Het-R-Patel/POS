import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext";
import KitchenOrderCard from "../components/kitchen/KitchenOrderCard";
import { ChefHat } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { fetchOrders, updateOrderStatus } from "../api/ordersApi";
import { selectAllOrders } from "../store/features/order/orderSelectors";
import { setOrders, upsertOrder } from "../store/features/order/orderSlice";

const KitchenPage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const orders = useSelector(selectAllOrders);
  const { addNotification } = useNotifications();
  const [filterStatus, setFilterStatus] = useState("all");

  const ordersQuery = useQuery({
    queryKey: ["orders", "kitchen"],
    queryFn: () =>
      fetchOrders({ page: 1, limit: 100, sortBy: "createdAt", order: "desc" }),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  React.useEffect(() => {
    if (ordersQuery.data) {
      dispatch(setOrders(ordersQuery.data));
    }
  }, [ordersQuery.data, dispatch]);

  const updateOrderStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (updatedOrder, variables) => {
      dispatch(upsertOrder(updatedOrder));
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (variables.status === "preparing") {
        addNotification({
          type: "info",
          title: "Order Started",
          message: `Order for Table ${updatedOrder.tableNumber} is now being prepared`,
        });
      } else if (variables.status === "ready") {
        addNotification({
          type: "success",
          title: "Order Ready",
          message: `Order for Table ${updatedOrder.tableNumber} is ready for pickup!`,
        });
      } else if (variables.status === "cancelled") {
        addNotification({
          type: "warning",
          title: "Order Cancelled",
          message: `Order for Table ${updatedOrder.tableNumber} has been cancelled`,
        });
      }
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Status Update Failed",
        message: error?.message || "Unable to update order status",
      });
    },
  });

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled",
  );

  const filteredOrders =
    filterStatus === "all"
      ? activeOrders
      : activeOrders.filter((order) => order.status === filterStatus);

  const getOrderCount = (status) => {
    return activeOrders.filter((order) => order.status === status).length;
  };

  const handleStatusUpdate = (orderId, status) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready" },
  ];

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-yellow-800 font-medium mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-900">
            {getOrderCount("pending")}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-1">Preparing</p>
          <p className="text-3xl font-bold text-blue-900">
            {getOrderCount("preparing")}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-800 font-medium mb-1">Ready</p>
          <p className="text-3xl font-bold text-green-900">
            {getOrderCount("ready")}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-800 font-medium mb-1">Total Active</p>
          <p className="text-3xl font-bold text-gray-900">
            {activeOrders.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters?.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === filter.value
                ? "bg-primary-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
      ) : filteredOrders?.length === 0 ? (
        <div className="text-center py-16">
          <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No orders to display</p>
          <p className="text-gray-400 mt-2">
            Orders will appear here when waiters submit them
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredOrders?.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenPage;
