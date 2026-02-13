import React, { useState } from 'react';
import { menuItems, categories } from '../../data/menuData';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Plus, Minus } from 'lucide-react';

const MenuItemCard = ({ item, onAddToOrder }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAddToOrder(item, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onAddToOrder(item, newQuantity);
    }
  };

  return (
    <Card className="h-full flex flex-col" padding="md">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          {!item.available && (
            <Badge variant="error">Out of Stock</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags?.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            ~{item.preparationTime} min
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {quantity === 0 ? (
          <Button
            onClick={handleIncrement}
            disabled={!item.available}
            fullWidth
            variant="primary"
          >
            <Plus className="h-4 w-4" />
            Add to Order
          </Button>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <Button
              onClick={handleDecrement}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="flex-1 text-center font-semibold text-lg">
              {quantity}
            </span>
            <Button
              onClick={handleIncrement}
              variant="primary"
              size="sm"
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

const MenuGrid = ({ onItemQuantityChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredItems.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToOrder={onItemQuantityChange}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      )}
    </div>
  );
};

export default MenuGrid;
