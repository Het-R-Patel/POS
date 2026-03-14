import axiosInstance from "./config";

/**
 * Fetch all tables from the backend
 * @returns {Promise} Promise resolving to tables data
 * @throws {Error} Throws error if API call fails
 */
export const fetchTables = async (params) => {
  try {
    const response = await axiosInstance.get(`/tables`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch Tables ");
  }
};
