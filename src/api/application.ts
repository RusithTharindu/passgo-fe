import { Application, DocumentType } from '@/types/application';
import AxiosInstance from '@/utils/helpers/axiosApi';
import { AxiosError, AxiosResponse } from 'axios';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for implementing exponential backoff
const fetchWithRetry = async (url: string, options = {}, maxRetries = 3) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await AxiosInstance.get(url, options);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      // If it's not a rate limit error, or we've used all retries, throw
      if (axiosError.response?.status !== 429 || retries === maxRetries - 1) {
        throw error;
      }

      // Calculate backoff time (exponential with jitter)
      const backoffTime = Math.min(Math.pow(2, retries) * 1000 + Math.random() * 1000, 10000);
      console.log(`Rate limited, retrying in ${backoffTime}ms...`);

      // Wait for the backoff period
      await new Promise(resolve => setTimeout(resolve, backoffTime));

      // Increment retry count
      retries++;
    }
  }

  // This shouldn't happen, but just in case
  throw new Error('Max retries exceeded');
};

// Define a custom error type for API errors
interface ApiError extends Error {
  statusCode?: number;
  response?: AxiosResponse;
}

export const applicationApi = {
  // Create a new application
  create: async (formData: Record<string, unknown>): Promise<Application> => {
    try {
      const response = await AxiosInstance.post(`${API_URL}application`, formData);
      return response.data;
    } catch (error) {
      console.error('API Error - Create application:', error);
      throw new Error('Failed to create application');
    }
  },

  // Get application by ID
  getById: async (id?: string): Promise<Application> => {
    try {
      let response;

      if (id) {
        // If ID is provided, fetch specific application with retry logic
        response = await fetchWithRetry(`${API_URL}application/${id}`);
      } else {
        // Fallback to fetching user's applications (likely the most recent one)
        response = await fetchWithRetry(`${API_URL}application/my-applications`);
      }

      return response.data;
    } catch (error: unknown) {
      // Properly extract error details to propagate to the UI
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = axiosError.response?.data
        ? ((axiosError.response.data as Record<string, unknown>).message as string)
        : axiosError.message || 'Failed to fetch application';

      // Log the detailed error for debugging
      console.error('API Error - Get application:', { statusCode, message: errorMessage, error });

      // Create an error object with additional properties
      const enhancedError: ApiError = new Error(errorMessage);
      enhancedError.statusCode = statusCode;
      enhancedError.response = axiosError.response as AxiosResponse;

      throw enhancedError;
    }
  },

  // Get all applications for the current user
  getAll: async (): Promise<Application[]> => {
    try {
      const response = await AxiosInstance.get(`${API_URL}applications`);
      return response.data;
    } catch (error) {
      console.error('API Error - Get all applications:', error);
      throw new Error('Failed to fetch applications');
    }
  },

  getMyAll: async (): Promise<Application[]> => {
    try {
      const response = await AxiosInstance.get(`${API_URL}application/my-applications`);
      return response.data;
    } catch (error) {
      console.error('API Error - Get all applications:', error);
      throw new Error('Failed to fetch applications');
    }
  },

  // Upload document for an application
  uploadDocument: async (documentType: DocumentType, file: File): Promise<{ url: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await AxiosInstance.post(`${API_URL}upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          // Handle progress event if needed
          if (progressEvent.total) {
            console.log('Upload progress:', progressEvent.loaded / progressEvent.total);
          }
        },
      });

      return response.data;
    } catch (error) {
      console.error('API Error - Upload document:', error);
      throw new Error('Failed to upload document');
    }
  },

  // Update an existing application
  update: async (id: string, data: Partial<Application>): Promise<Application> => {
    try {
      const response = await AxiosInstance.patch(`${API_URL}application/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error - Update application:', error);
      throw new Error('Failed to update application');
    }
  },

  // Cancel an application
  cancel: async (id: string): Promise<void> => {
    try {
      await AxiosInstance.post(`${API_URL}application/${id}/cancel`);
    } catch (error) {
      console.error('API Error - Cancel application:', error);
      throw new Error('Failed to cancel application');
    }
  },
};
