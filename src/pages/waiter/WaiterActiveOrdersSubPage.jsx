import React from "react";
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";

const getOrderId = (order) => order?.id || order?._id;

const getTableLabel = (order) => {
  if (order?.tableNumber) return order.tableNumber;
  if (order?.tableId?.tableNumber) return order.tableId.tableNumber;
  if (order?.table?.tableNumber) return order.table.tableNumber;
  return "-";
};

const getOrderNumber = (order) =>
  order?.orderNumber ?? order?.order_number ?? "-";

const getItemCount = (order) =>
  Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
    : 0;

const getTotalAmount = (order) =>
  Number(order?.totalAmount ?? order?.total_amount ?? 0);

const formatDateTime = (order) => {
  const value =
    order?.updatedAt ||
    order?.updated_at ||
    order?.createdAt ||
    order?.created_at;
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleString();
};

const WaiterActiveOrdersSubPage = ({
  orders = [],
  isLoading = false,
  deletingOrderId = "",
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const rows = orders.map((order) => {
    const orderId = getOrderId(order);
    return {
      ...order,
      __orderId: orderId,
      __orderNumber: getOrderNumber(order),
      __tableNumber: getTableLabel(order),
      __itemCount: getItemCount(order),
      __totalAmount: getTotalAmount(order),
      __updatedAt: formatDateTime(order),
    };
  });

  const columns = [
    {
      key: "__orderNumber",
      header: "Order #",
      render: (row) => (
        <span className="font-semibold text-gray-900">{row.__orderNumber}</span>
      ),
    },
    {
      key: "__tableNumber",
      header: "Table",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className="capitalize font-medium text-gray-700">
          {row.status || "-"}
        </span>
      ),
    },
    {
      key: "__itemCount",
      header: "Items",
      align: "right",
      render: (row) => (
        <span className="block text-right">{row.__itemCount}</span>
      ),
    },
    {
      key: "__totalAmount",
      header: "Total",
      align: "right",
      render: (row) => (
        <span className="block text-right font-medium">
          ${row.__totalAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "__updatedAt",
      header: "Updated At",
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          {row.status !== "preparing" && row.status !== "ready" && (
            <Button
              size="sm"
              variant="primary"
              onClick={(event) => {
                event.stopPropagation();
                onUpdate?.(row.__orderId);
              }}
              disabled={!row.__orderId}
            >
              <Pencil className="h-4 w-4" />
              Update
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.(row.__orderId);
            }}
            disabled={!row.__orderId || deletingOrderId === row.__orderId}
          >
            <Trash2 className="h-4 w-4" />
            {deletingOrderId === row.__orderId ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900">Active Orders</h1>
        </div>
        <Button variant="success" onClick={onCreate}>
          <Plus className="h-4 w-4" />
          Create New Order
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        emptyMessage={
          isLoading ? "Loading active orders..." : "No active orders found"
        }
      />
    </div>
  );
};

export default WaiterActiveOrdersSubPage;
