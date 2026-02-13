import React from 'react';

const Badge = ({ status, children, variant, className = '' }) => {
  const statusClasses = {
    pending: 'badge-pending',
    preparing: 'badge-preparing',
    ready: 'badge-ready',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  };

  const variantClasses = {
    success: 'bg-success-100 text-success-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-accent-100 text-accent-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const badgeClass = status 
    ? statusClasses[status] 
    : variant 
    ? variantClasses[variant]
    : variantClasses.default;

  const displayText = status 
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : children;

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {displayText}
    </span>
  );
};

export default Badge;
