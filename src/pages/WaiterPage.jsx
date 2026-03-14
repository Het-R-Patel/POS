import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext";
import {
  fetchOrderById,
  fetchOrders,
  updateOrderStatus,
} from "../api/ordersApi";
import {
  hydrateCurrentOrder,
  resetCurrentOrderAfterSubmit,
  setOrders,
  upsertOrder,
} from "../store/features/order/orderSlice";
import { selectAllOrders } from "../store/features/order/orderSelectors";
import WaiterActiveOrdersSubPage from "./waiter/WaiterActiveOrdersSubPage";
import WaiterTableSelectorSubPage from "./waiter/WaiterTableSelectorSubPage";
import WaiterOrderEditorSubPage from "./waiter/WaiterOrderEditorSubPage";

const normalizeOrderItemsForEditor = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item, index) => {
      const menuItem = item?.menuItem || item?.menuItemId || item?.menu_item_id || {};
      const menuItemId = menuItem?._id || menuItem?.id || item?.menuItemId || item?.menu_item_id;
      const quantity = Number(item?.quantity || 0);
      const price = Number(item?.price ?? menuItem?.price ?? 0);
      const name = menuItem?.name || item?.name || "Item";

      if (!menuItemId || quantity <= 0) {
        return null;
      }

      return {
        id: item?.id || item?._id || `item-${menuItemId}-${index}`,
        menuItem: {
          ...menuItem,
          _id: menuItemId,
          id: menuItemId,
          name,
          price,
        },
        quantity,
        subtotal: price * quantity,
        name,
        price,
      };
    })
    .filter(Boolean);
};

const normalizeOrderForEditor = (order) => {
  const tableSource = order?.tableId || order?.table || order?.table_id;
  const tableId =
    (typeof tableSource === "object" ? tableSource?._id || tableSource?.id : tableSource) || "";
  const tableNumber =
    order?.tableNumber ||
    order?.table_number ||
    (typeof tableSource === "object" ? tableSource?.tableNumber || tableSource?.table_number : "") ||
    "";
  const waiterName =
    order?.waiterName ||
    order?.waiterId ||
    order?.waiter_id ||
    (typeof order?.waiterId === "object" ? order?.waiterId?.name : "") ||
    "";

  return {
    tableId,
    tableNumber: tableNumber ? String(tableNumber) : "",
    waiterName,
    items: normalizeOrderItemsForEditor(order?.items),
  };
};

const getOrderId = (order) => order?.id || order?._id;

const WaiterPage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const orders = useSelector(selectAllOrders);
  const [view, setView] = React.useState("active-orders");
  const [selectedTableNumber, setSelectedTableNumber] = React.useState("");
  const [editorMode, setEditorMode] = React.useState("create");
  const [editingOrderId, setEditingOrderId] = React.useState("");
  const [editingOrderData, setEditingOrderData] = React.useState(null);

  const ordersQuery = useQuery({
    queryKey: ["orders", "waiter"],
    queryFn: () => fetchOrders({ page: 1, limit: 100, sortBy: "createdAt", order: "desc" }),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  React.useEffect(() => {
    if (ordersQuery.data) {
      dispatch(setOrders(ordersQuery.data));
    }
  }, [dispatch, ordersQuery.data]);

  const deleteOrderMutation = useMutation({
    mutationFn: ({ orderId }) =>
      updateOrderStatus({
        orderId,
        status: "cancelled",
        cancellationReason: "Cancelled by waiter",
      }),
    onSuccess: (updatedOrder) => {
      dispatch(upsertOrder(updatedOrder));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addNotification({
        type: "success",
        title: "Order Deleted",
        message: "The order has been removed from active orders.",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Delete Failed",
        message: error?.message || "Unable to delete order",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: fetchOrderById,
    onSuccess: (orderResponse) => {
      const order = orderResponse?.order || orderResponse;
      const orderId = getOrderId(order);
      const normalized = normalizeOrderForEditor(order);

      dispatch(hydrateCurrentOrder(normalized));
      setEditingOrderId(orderId);
      setEditingOrderData(order);
      setEditorMode("update");
      setView("editor");
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Load Failed",
        message: error?.message || "Unable to load order details",
      });
    },
  });

  const activeOrders = orders.filter(
    (order) => order?.status !== "completed" && order?.status !== "cancelled",
  );

  const handleCreateNewOrder = () => {
    dispatch(resetCurrentOrderAfterSubmit());
    setEditingOrderId("");
    setEditingOrderData(null);
    setEditorMode("create");
    setSelectedTableNumber("");
    setView("table-selector");
  };

  const handleDeleteOrder = async (orderId) => {
    if (!orderId) {
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete this order?");
    if (!isConfirmed) {
      return;
    }

    await deleteOrderMutation.mutateAsync({ orderId });
  };

  const handleUpdateOrder = async (orderId) => {
    if (!orderId) {
      return;
    }

    await updateEntryMutation.mutateAsync(orderId);
  };

  const handleContinueFromTableSelector = (tableNumber, tables = []) => {
    const selected = tables.find(
      (table) => String(table?.tableNumber || "") === String(tableNumber || ""),
    );

    if (!selected?._id) {
      return;
    }

    dispatch(
      hydrateCurrentOrder({
        items: [],
        tableId: selected._id,
        tableNumber: String(selected.tableNumber || ""),
        waiterName: "",
      }),
    );

    setEditingOrderId("");
    setEditingOrderData(null);
    setEditorMode("create");
    setView("editor");
  };

  const handleOrderSubmitted = () => {
    setEditingOrderId("");
    setEditingOrderData(null);
    setEditorMode("create");
    setSelectedTableNumber("");
    setView("active-orders");
  };

  const handleBackToOrders = () => {
    setSelectedTableNumber("");
    setView("active-orders");
  };

  if (view === "table-selector") {
    return (
      <WaiterTableSelectorSubPage
        selectedTable={selectedTableNumber}
        onSelectTable={setSelectedTableNumber}
        onBack={handleBackToOrders}
        onContinue={handleContinueFromTableSelector}
      />
    );
  }

  if (view === "editor") {
    return (
      <WaiterOrderEditorSubPage
        mode={editorMode}
        orderId={editingOrderId}
        initialOrderData={editingOrderData}
        onBack={handleBackToOrders}
        onSubmitted={handleOrderSubmitted}
      />
    );
  }

  return (
    <WaiterActiveOrdersSubPage
      orders={activeOrders}
      isLoading={ordersQuery.isPending}
      deletingOrderId={deleteOrderMutation.isPending ? deleteOrderMutation.variables?.orderId : ""}
      onCreate={handleCreateNewOrder}
      onUpdate={handleUpdateOrder}
      onDelete={handleDeleteOrder}
    />
  );
};

export default WaiterPage;
