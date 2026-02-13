import React from 'react';
import { Clock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const MenuItemCard = ({ item, onAddToOrder }) => {
  return (
    <Card padding="md" className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
        </div>
        <Badge variant="default" className="ml-2">
          {item.category}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {item.preparationTime}m
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAddToOrder(item)}
        >
          Add
        </Button>
      </div>
    </Card>
  );
};

export default MenuItemCard;
