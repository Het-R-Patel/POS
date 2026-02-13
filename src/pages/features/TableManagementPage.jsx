import React, { useState } from 'react';
import { Users, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Navigation from '../../components/Navigation';

const TableManagementPage = () => {
  const [tables, setTables] = useState([
    { id: 1, capacity: 2, status: 'occupied', currentOrder: 1001, timeSeated: new Date(Date.now() - 1800000) },
    { id: 2, capacity: 4, status: 'available' },
    { id: 3, capacity: 2, status: 'reserved', customerName: 'John Doe', estimatedTime: 19 },
    { id: 4, capacity: 6, status: 'occupied', currentOrder: 1002, timeSeated: new Date(Date.now() - 3600000) },
    { id: 5, capacity: 4, status: 'available' },
    { id: 6, capacity: 2, status: 'available' },
    { id: 7, capacity: 8, status: 'reserved', customerName: 'Sarah Smith', estimatedTime: 20 },
    { id: 8, capacity: 4, status: 'occupied', currentOrder: 1003, timeSeated: new Date(Date.now() - 900000) },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTimeSeated = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-500 hover:bg-green-200';
      case 'occupied':
        return 'bg-red-100 border-red-500 hover:bg-red-200';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200';
    }
  };

  const stats = {
    total: tables.length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    available: tables.filter((t) => t.status === 'available').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <Card padding="md">
            <p className="text-sm text-gray-600 mb-1">Total Tables</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card padding="md" className="bg-green-50">
            <p className="text-sm text-green-700 mb-1">Available</p>
            <p className="text-3xl font-bold text-green-900">{stats.available}</p>
          </Card>
          <Card padding="md" className="bg-red-50">
            <p className="text-sm text-red-700 mb-1">Occupied</p>
            <p className="text-3xl font-bold text-red-900">{stats.occupied}</p>
          </Card>
          <Card padding="md" className="bg-yellow-50">
            <p className="text-sm text-yellow-700 mb-1">Reserved</p>
            <p className="text-3xl font-bold text-yellow-900">{stats.reserved}</p>
          </Card>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {tables.map((table) => (
            <Card
              key={table.id}
              padding="md"
              className={`${getStatusColor(table.status)} border-2 cursor-pointer transition-all hover:shadow-lg`}
              onClick={() => {
                setSelectedTable(table);
                setIsModalOpen(true);
              }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {table.id}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-700 mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  {table.capacity}
                </div>
                <Badge
                  variant={
                    table.status === 'available'
                      ? 'success'
                      : table.status === 'occupied'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {table.status}
                </Badge>
                {table.status === 'occupied' && table.timeSeated && (
                  <div className="mt-2 text-xs text-gray-600 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeSeated(table.timeSeated)}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Table Details Modal */}
        {selectedTable && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Table ${selectedTable.id} Details`}
            size="md"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Table Number
                  </label>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedTable.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <p className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    {selectedTable.capacity}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Status
                </label>
                <div className="flex space-x-2">
                  {['available', 'occupied', 'reserved'].map((status) => (
                    <Button
                      key={status}
                      variant={
                        selectedTable.status === status ? 'primary' : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedTable({
                          ...selectedTable,
                          status,
                        })
                      }
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedTable.status === 'occupied' && (
                <>
                  <Input
                    label="Order Number"
                    type="number"
                    value={selectedTable.currentOrder || ''}
                    placeholder="Enter order number"
                  />
                  {selectedTable.timeSeated && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Time Seated
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {getTimeSeated(selectedTable.timeSeated)}
                      </p>
                    </div>
                  )}
                </>
              )}

              {selectedTable.status === 'reserved' && (
                <>
                  <Input
                    label="Customer Name"
                    value={selectedTable.customerName || ''}
                    placeholder="Enter customer name"
                  />
                  <Input
                    label="Estimated Arrival Time"
                    type="time"
                    placeholder="19:00"
                  />
                </>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" fullWidth onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" fullWidth>
                Save Changes
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TableManagementPage;
