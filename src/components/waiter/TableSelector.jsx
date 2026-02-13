import React from 'react';
import { Users } from 'lucide-react';
import Card from '../ui/Card';

const TableSelector = ({
  tables,
  selectedTable,
  onSelectTable,
  occupiedTables = [],
}) => {
  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2" />
        Select Table
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {tables.map((table) => {
          const isOccupied = occupiedTables.includes(table);
          const isSelected = selectedTable === table;

          return (
            <button
              key={table}
              onClick={() => onSelectTable(table)}
              disabled={isOccupied}
              className={`aspect-square rounded-lg font-semibold text-lg transition-all ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-lg scale-105'
                  : isOccupied
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {table}
            </button>
          );
        })}
      </div>
      <div className="flex items-center space-x-4 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-500 rounded mr-2"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <span className="text-gray-600">Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded mr-2"></div>
          <span className="text-gray-600">Available</span>
        </div>
      </div>
    </Card>
  );
};

export default TableSelector;
