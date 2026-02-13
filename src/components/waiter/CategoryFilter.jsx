import React from 'react';

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            activeCategory === category
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
