import axios from 'axios';

// Base API URL - change this to match your backend server
const API_BASE_URL = 'api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Request interceptor - add auth tokens, logging, etc.
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // You can add auth token here if needed
//     // const token = localStorage.getItem('token');
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - handle errors globally
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle common errors
//     if (error.response) {
//       // Server responded with error status
//       console.error('API Error:', error.response.data);
//     } else if (error.request) {
//       // Request was made but no response
//       console.error('Network Error:', error.message);
//     } else {
//       // Something else happened
//       console.error('Error:', error.message);
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
export { API_BASE_URL };
