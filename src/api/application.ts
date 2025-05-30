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

interface DocumentUrls {
  current_passport?: string;
  nic_front?: string;
  nic_back?: string;
  birth_certificate?: string;
  passport_photo?: string;
  additional_documents?: string;
}

export const applicationApi = {
  create: async (formData: Record<string, unknown>): Promise<Application> => {
    try {
      const response = await AxiosInstance.post(`${API_URL}application`, formData);
      return response.data;
    } catch (error) {
      console.error('API Error - Create application:', error);
      throw new Error('Failed to create application');
    }
  },

  getById: async (id?: string): Promise<Application> => {
    try {
      console.log('API - Fetching application:', id);
      const response = await fetchWithRetry(`${API_URL}application/${id}`);
      console.log('API - Application response:', response.data);
      return response.data;
    } catch (error: unknown) {
      // Properly extract error details to propagate to the UI
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = axiosError.response?.data
        ? ((axiosError.response.data as Record<string, unknown>).message as string)
        : axiosError.message || 'Failed to fetch application';

      console.error('API Error - Get application:', {
        statusCode,
        message: errorMessage,
        error,
        response: axiosError.response?.data,
      });

      const enhancedError: ApiError = new Error(errorMessage);
      enhancedError.statusCode = statusCode;
      enhancedError.response = axiosError.response as AxiosResponse;

      throw enhancedError;
    }
  },

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

  getDocumentUrls: async (applicationId: string): Promise<DocumentUrls> => {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    try {
      console.log('Fetching document URLs for application:', applicationId);

      const response = await AxiosInstance.get(`${API_URL}application/${applicationId}`);

      console.log('Document URLs response:', response.data);

      if (!response.data) {
        throw new Error('No document URLs returned from server');
      }

      const { documents } = response.data;

      console.log('Documents:', documents);

      return {
        current_passport: documents?.current_passport || '',
        nic_front: documents?.nic_front || '',
        nic_back: documents?.nic_back || '',
        birth_certificate: documents?.birth_certificate || '',
        passport_photo: documents?.passport_photo || '',
        additional_documents: documents?.additional_documents || '',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = axiosError.response?.data
        ? ((axiosError.response.data as Record<string, unknown>).message as string)
        : axiosError.message || 'Failed to get document URLs';

      console.error('API Error - Get document URLs:', {
        statusCode,
        message: errorMessage,
        error,
        applicationId,
        response: axiosError.response?.data,
      });

      throw new Error(errorMessage);
    }
  },

  uploadDocument: async (documentType: DocumentType, file: File): Promise<{ url: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await AxiosInstance.post(`${API_URL}upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data?.url) {
        throw new Error('No URL returned from server');
      }

      return response.data;
    } catch (error) {
      console.error('API Error - Upload document:', error);
      throw new Error('Failed to upload document');
    }
  },

  update: async (id: string, data: Partial<Application>): Promise<Application> => {
    try {
      const response = await AxiosInstance.patch(`${API_URL}application/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error - Update application:', error);
      throw new Error('Failed to update application');
    }
  },

  cancel: async (id: string): Promise<void> => {
    try {
      await AxiosInstance.post(`${API_URL}application/${id}/cancel`);
    } catch (error) {
      console.error('API Error - Cancel application:', error);
      throw new Error('Failed to cancel application');
    }
  },
};
