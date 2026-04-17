import axiosInstance from "./config";

/**
 * Fetch all menu items from the backend
 * @returns {Promise} Promise resolving to menu items data
 * @throws {Error} Throws error if API call fails
 */
export const fetchMenuItems = async (params) => {
  try {
    const response = await axiosInstance.get(
      `/menu-items?${params.category ? `category=${params.category}&` : ""}${params.searchQuery ? `search=${params.searchQuery}&` : ""}page=${params.currentPage}&limit=${params.limit}`,
    );
    return {
      data: response.data,
      pagination: response.pagination || response.data?.pagination || {},
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch menu items",
    );
  }
};

/**
 * Fetch a single menu item by ID from the backend
 * @param {string} id - The ID of the menu item
 * @returns {Promise} Promise resolving to the menu item data
 * @throws {Error} Throws error if API call fails
 */
export const fetchMenuItemById = async (id) => {
  try {
    const response = await axiosInstance.get(`/menu-items/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch menu item details",
    );
  }
};
