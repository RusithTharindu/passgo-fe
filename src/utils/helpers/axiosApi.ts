// import axios from 'axios';

// // Create axios instance
// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/', // Default to local API if env not set
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   config => {
//     // Get token from localStorage if it exists
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   response => response,
//   async error => {
//     // Handle 401 (Unauthorized) errors
//     if (error.response?.status === 401) {
//       // Clear localStorage and redirect to login
//       localStorage.clear();
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;

import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance with default settings
const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Attach Token)
AxiosInstance.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token'); // Get token from cookies
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor (Handle Errors)
AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      return Promise.reject({
        error: error.response?.data?.message || 'Something went wrong',
      });
    }
    return Promise.reject({ error: 'Something went wrong' });
  },
);

export default AxiosInstance;
