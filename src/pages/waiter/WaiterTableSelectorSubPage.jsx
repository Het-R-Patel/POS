import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import SyncLoader from 'react-spinners/SyncLoader';
import { fetchTables } from '../../api/tablesApi';
import TableSelector from '../../components/waiter/TableSelector';
import Button from '../../components/ui/Button';

const WaiterTableSelectorSubPage = ({
  selectedTable = '',
  onBack,
  onSelectTable,
  onContinue,
}) => {
  const tablesQuery = useQuery({
    queryKey: ['tables', 'waiter-selector'],
    queryFn: fetchTables,
  });

  const tables = tablesQuery.data?.data || [];
  const tableNumbers = tables.map((table) => String(table?.tableNumber || ''));
  const occupiedTables = tables
    .filter((table) => table?.status === 'occupied')
    .map((table) => String(table?.tableNumber || ''));

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Active Orders
        </Button>

        <Button
          variant="primary"
          onClick={() => onContinue?.(selectedTable, tables)}
          disabled={!selectedTable}
        >
          Continue to Order Form
        </Button>
      </div>

      {tablesQuery.isPending ? (
        <div className="flex justify-center py-10">
          <SyncLoader size={12} color="#0EA5E9" loading={tablesQuery.isPending} />
        </div>
      ) : tablesQuery.isError ? (
        <div className="text-center py-10 text-red-600">
          Failed to load tables. Please try again.
        </div>
      ) : (
        <TableSelector
          tables={tableNumbers}
          selectedTable={selectedTable}
          onSelectTable={onSelectTable}
          occupiedTables={occupiedTables}
        />
      )}
    </div>
  );
};

export default WaiterTableSelectorSubPage;
