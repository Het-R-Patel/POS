import axios from 'axios';

const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://orderly-backend-hy15.onrender.com/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
const AUTH_STORAGE_KEY = 'pos_auth';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const accessToken = state.auth.accessToken;
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      // If the response contains a 'data' field, and 'success' or 'status' is true/success, return the unwrapped data
      const isSuccess = response.data && (response.data.success === true || response.data.status === 'success');
      
      if (isSuccess && response.data.data !== undefined) {
        const originalData = response.data;
        response.data = originalData.data;
        // Preserve crucial pagination metadata onto the response object explicitly
        if (originalData.pagination) {
          response.pagination = originalData.pagination;
        }
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const { refreshTokenThunk } = await import('../store/features/auth/authSlice');
          const result = await store.dispatch(refreshTokenThunk());
          
          if (refreshTokenThunk.fulfilled.match(result)) {
             // Access token was refreshed successfully, configure original request and retry
             originalRequest.headers.Authorization = `Bearer ${result.payload.accessToken}`;
             return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, reject with the previous error to bubble down
          return Promise.reject(error);
        }
      }

      // Handle common errors
      if (error.response) {
        console.error('API Error:', error.response.data);
      } else if (error.request) {
        console.error('Network Error:', error.message);
      } else {
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
export { API_BASE_URL };
