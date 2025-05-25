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
