import React, { useState } from "react";
import MenuItemCard from "./MenuItemCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginatedMenuItems = ({
  items = [],
  onAddToOrder,
  totalPages,
  pageNumber,
  currentPage,
  setCurrentPage,
  orderItems = [],
}) => {

  // Calculate pagination
  //   const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getItemQuantity = (itemId) => {
    const orderItem = orderItems.find(item => item.menuItem._id === itemId);
    return orderItem ? orderItem.quantity : 0;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 gap-4 ">
        {items.map((item) => (
          <MenuItemCard
            key={item._id || item.id}
            item={item}
            onAddToOrder={onAddToOrder}
            currentQuantity={getItemQuantity(item._id || item.id)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* Previous Button */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border transition-all ${
              currentPage === 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Page Numbers */}
          {/* <div className="flex items-center gap-1">
            {totalPages.map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === "..." ? (
                  <span className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => handlePageClick(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-primary-500 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div> */}

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border transition-all ${
              currentPage === totalPages
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-600">
          {`Page ${pageNumber} of ${totalPages}`}
        </div>
      )}
    </div>
  );
};

export default PaginatedMenuItems;
