import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { ArrowLeft, Save, ShoppingCart, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTables } from "../../api/tablesApi";
import { createOrder, updateOrderItems } from "../../api/ordersApi";
import { useNotifications } from "../../context/NotificationContext";
import {
  selectCurrentOrderItems,
  selectCurrentOrderTableId,
  selectCurrentOrderTableNumber,
  selectCurrentOrderWaiterId,
  selectCurrentOrderWaiterName,
  selectCurrentOrderTotal,
  selectCurrentOrderItemCount,
} from "../../store/features/order/orderSelectors";
import {
  removeItemFromCurrentOrder,
  resetCurrentOrderAfterSubmit,
  upsertOrder,
  clearCurrentOrder,
  setWaiterIdentity,
} from "../../store/features/order/orderSlice";

const OrderSummary = ({
  mode = "create",
  orderId,
  initialOrderData,
  onSubmitted,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const [customerName, setCustomerName] = React.useState("");
  const [paymentStatus, setPaymentStatus] = React.useState("unpaid");
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [orderType, setOrderType] = React.useState("dine-in");
  const [tip, setTip] = React.useState(0);
  const [specialInstructions, setSpecialInstructions] = React.useState("");
  const [estimatedTime, setEstimatedTime] = React.useState(20);

  const items = useSelector(selectCurrentOrderItems);
  const tableId = useSelector(selectCurrentOrderTableId);
  const tableNumber = useSelector(selectCurrentOrderTableNumber);
  const currentOrderWaiterId = useSelector(selectCurrentOrderWaiterId);
  const waiterName = useSelector(selectCurrentOrderWaiterName);
  const authUser = useSelector((state) => state.auth.user);
  const total = useSelector(selectCurrentOrderTotal);
  const itemCount = useSelector(selectCurrentOrderItemCount);

  const loggedInWaiterId = String(authUser?._id || authUser?.id || "");
  const loggedInWaiterName = String(
    authUser?.fullName || authUser?.name || authUser?.username || authUser?.email || "",
  );

  const tables = useQuery({
    queryKey: ["tables"],
    queryFn: fetchTables,
  });

  const tableOptions =
    tables.data?.data?.tables ||
    tables.data?.data ||
    tables.data?.tables ||
    [];

  React.useEffect(() => {
    dispatch(
      setWaiterIdentity({
        waiterId: loggedInWaiterId,
        waiterName: loggedInWaiterName,
      }),
    );

    if (!initialOrderData) {
      setCustomerName("");
      setPaymentStatus("unpaid");
      setPaymentMethod("cash");
      setOrderType("dine-in");
      setTip(0);
      setSpecialInstructions("");
      setEstimatedTime(20);
      return;
    }

    setCustomerName(initialOrderData.customerName || "");
    setPaymentStatus(initialOrderData.paymentStatus || "unpaid");
    setPaymentMethod(initialOrderData.paymentMethod || "cash");
    setOrderType(initialOrderData.orderType || "dine-in");
    setTip(Number(initialOrderData.tip || 0));
    setSpecialInstructions(initialOrderData.specialInstructions || "");
    setEstimatedTime(Number(initialOrderData.estimatedTime || 20));
  }, [dispatch, initialOrderData, loggedInWaiterId, loggedInWaiterName]);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (createdOrder) => {
      dispatch(upsertOrder(createdOrder));
      dispatch(resetCurrentOrderAfterSubmit());
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      const tableLabel =
        createdOrder?.tableNumber ??
        createdOrder?.table?.tableNumber ??
        createdOrder?.table_id ??
        createdOrder?.tableId ??
        "Selected table";

      addNotification({
        type: "success",
        title: "Order Submitted",
        message: `Order for Table ${tableLabel} has been sent to the kitchen successfully!`,
      });

      onSubmitted?.(createdOrder);
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Order Submission Failed",
        message: error?.message || "Unable to submit order",
      });
    },
  });

  const updateOrderItemsMutation = useMutation({
    mutationFn: updateOrderItems,
    onSuccess: (updatedOrder) => {
      dispatch(upsertOrder(updatedOrder));
      dispatch(resetCurrentOrderAfterSubmit());
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      addNotification({
        type: "success",
        title: "Order Updated",
        message: "Order was updated successfully.",
      });

      onSubmitted?.(updatedOrder);
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Order Update Failed",
        message: error?.message || "Unable to update order",
      });
    },
  });

  const handleRemoveItem = (itemId) => {
    dispatch(removeItemFromCurrentOrder(itemId));
  };

  const effectiveWaiterId = loggedInWaiterId || currentOrderWaiterId;
  const effectiveWaiterName = loggedInWaiterName || waiterName;
  const isUpdateMode = mode === "update";
  const isSubmitting = createOrderMutation.isPending || updateOrderItemsMutation.isPending;

  const handleSubmitOrder = () => {
    if (items.length === 0 || !tableId || !effectiveWaiterId) {
      return;
    }

    const mappedItems = items.map((item) => ({
      menuItemId: item.menuItem._id,
      quantity: item.quantity,
      specialRequests: item.specialInstructions ?? "",
      status: "pending",
    }));

    if (isUpdateMode) {
      if (!orderId) {
        return;
      }

      updateOrderItemsMutation.mutate({
        orderId,
        items: mappedItems,
      });
      return;
    }

    createOrderMutation.mutate({
      tableId,
      waiterId: effectiveWaiterId,
      customerName,
      paymentStatus,
      paymentMethod,
      orderType,
      tip: Number(tip),
      specialInstructions,
      estimatedTime: Number(estimatedTime),
      items: mappedItems,
    });
  };

  const handleClearOrder = () => {
    dispatch(clearCurrentOrder());
  };

  return (
    <Card className="sticky top-4" padding="md">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <ShoppingCart className="h-6 w-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        {tables.isPending && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClipLoader size={16} color="#6B7280" loading={tables.isPending} />
            <span>Loading tables...</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Table Number
          </label>
          {/* <input
            type="text"
            value={tableNumber}
            onChange={(e) => onTableNumberChange(e.target.value)}
            placeholder="Enter table number"
            className="input"
          /> */}

          <select
            name="tableNumber"
            value={tableId}
            className="input w-full rounded-lg border border-gray-300 bg-white px-3 py-2   shadow-sm transition"
            disabled
          >
            {tables.isPending && <option value="">Loading tables...</option>}
            {tables.isError && <option value="">Error loading tables</option>}

            <option value="">{tableNumber ? `Table ${tableNumber}` : "Select Table"}</option>

            {tableOptions.map((table) => (
              <option key={table._id} value={table._id}>
                Table {table.tableNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Waiter Name
          </label>
          <input
            type="text"
            value={effectiveWaiterName}
            placeholder="Waiter Name"
            className="input"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="input"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="input"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Type
          </label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="input"
          >
            <option value="dine-in">Dine-in</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip
            </label>
            <input
              type="number"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Time (minutes)
          </label>
          <input
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Less spicy"
            className="input min-h-20"
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
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.menuItem.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${item.menuItem.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
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
          onClick={handleSubmitOrder}
          disabled={
            items.length === 0 ||
            !tableId ||
            !effectiveWaiterId ||
            isSubmitting ||
            (isUpdateMode && !orderId)
          }
          fullWidth
          variant={isUpdateMode ? "primary" : "success"}
          size="lg"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <ClipLoader size={16} color="#FFFFFF" loading={isSubmitting} />
              <span>{isUpdateMode ? "Updating..." : "Submitting..."}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              {isUpdateMode ? <Save className="h-4 w-4" /> : null}
              {isUpdateMode ? "Update Order" : "Submit Order"}
            </span>
          )}
        </Button>
        <Button
          onClick={handleClearOrder}
          disabled={items.length === 0}
          fullWidth
          variant="outline"
        >
          Clear Order
        </Button>
        {isUpdateMode ? (
          <Button onClick={onCancel} fullWidth variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back to Active Orders
          </Button>
        ) : null}
      </div>
    </Card>
  );
};

export default OrderSummary;
