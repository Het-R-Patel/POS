import axiosInstance from './config';

/**
 * Sends a chat message to the AI bot endpoint.
 * @param {string} message - The message from the user.
 * @returns {Promise<Object>} The AI response.
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await axiosInstance.post('/ai/chat', { message });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to communicate with AI');
  }
};
