import React from 'react';

const StatusFilter = ({
  statuses,
  activeStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      <button
        onClick={() => onStatusChange('all')}
        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
          activeStatus === 'all'
            ? 'bg-primary-500 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        All Orders
      </button>
      {statuses.map((status) => (
        <button
          key={status.id}
          onClick={() => onStatusChange(status.id)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            activeStatus === status.id
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {status.label}
          {status.count > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
              {status.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
