import React from 'react';
import Card from './Card';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-100',
    green: 'from-green-500 to-green-600 text-green-100',
    purple: 'from-purple-500 to-purple-600 text-purple-100',
    orange: 'from-orange-500 to-orange-600 text-orange-100',
    red: 'from-red-500 to-red-600 text-red-100',
    gray: 'from-gray-500 to-gray-600 text-gray-100',
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} text-white`}
      padding="lg"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm opacity-90">{title}</p>
        {Icon && <Icon className="h-8 w-8 opacity-80" />}
      </div>
      <p className="text-4xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
      {trend && (
        <p
          className={`text-sm mt-2 ${
            trend.isPositive ? 'text-green-200' : 'text-red-200'
          }`}
        >
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </p>
      )}
    </Card>
  );
};

export default StatsCard;
