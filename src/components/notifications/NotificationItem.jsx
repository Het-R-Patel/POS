import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationItem = ({
  notification,
  onRemove,
  onMarkAsRead,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 hover:bg-green-100';
      case 'error':
        return 'bg-red-50 hover:bg-red-100';
      case 'warning':
        return 'bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'bg-blue-50 hover:bg-blue-100';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div
      className={`p-4 ${getBgColor()} border-b border-gray-200 transition-colors cursor-pointer ${
        !notification.read ? 'border-l-4 border-l-primary-500' : ''
      }`}
      onClick={() => onMarkAsRead?.(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {notification.title}
          </p>
          <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
          <p className="text-xs text-gray-500">
            {getTimeAgo(notification.timestamp)}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          className="flex-shrink-0 p-1 hover:bg-white rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
