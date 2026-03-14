import React, { use, useEffect, useState } from "react";
import { menuItems } from "../../data/menuData";
import PaginatedMenuItems from "./PaginatedMenuItems";
import { fetchMenuItems } from "../../api/menuitemsApi";
import { fetchCategories } from "../../api";
import { useQuery } from "@tanstack/react-query";
import SyncLoader from "react-spinners/SyncLoader";

const MenuGrid = ({ onItemQuantityChange, orderItems = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories using TanStack Query
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch menu items using TanStack Query
  const items = useQuery({
    queryKey: ["menuItems"],
    queryFn: () =>
      fetchMenuItems({
        category: selectedCategory,
        searchQuery,
        currentPage,
        limit: 6,
      }), // Fetch all items for filtering and pagination),
  });

  useEffect(() => {
    // Refetch menu items when currentPage changes
    items.refetch();
  }, [currentPage, searchQuery, selectedCategory]);

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
        <SyncLoader loading={categories.isPending} size={10} />
        {categories.isError && (
          <div className="text-red-500">
            Error loading categories: {categories.error.message}
          </div>
        )}
        {!categories.isPending && (
          <>
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === ""
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {categories.data?.map((category) => (
              <button
                key={category._id || category.id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category._id
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                data-categoryId={category._id || category.id}
              >
                {category.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Loading and Error States for Menu Items */}

      <div className="text-center">
        <SyncLoader loading={items.isPending} />
      </div>

      {items.isError && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">
            Error loading menu items: {items.error.message}
          </p>
        </div>
      )}

      {/* Paginated Menu Items Grid */}
      {!items.isPending && !items.isError && (
        <PaginatedMenuItems
          items={items.data?.data}
          totalPages={items.data?.pagination.totalPages}
          pageNumber={items.data?.pagination.page}
          onAddToOrder={onItemQuantityChange}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={items.data?.pagination.limit} // Use API pagination limit if available
          orderItems={orderItems}
        />
      )}
    </div>
  );
};

export default MenuGrid;
