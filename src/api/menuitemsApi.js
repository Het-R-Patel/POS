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
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch menu items",
    );
  }
};
