import axiosInstance from './config';

/**
 * Fetch all categories from the backend
 * @returns {Promise} Promise resolving to categories data
 */
export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

