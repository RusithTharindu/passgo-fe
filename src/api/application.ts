import { Application, DocumentType } from '@/types/application';
import AxiosInstance from '@/utils/helpers/axiosApi';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  getById: async (): Promise<Application> => {
    try {
      const response = await AxiosInstance.get(`${API_URL}application/my-applications`);
      return response.data;
    } catch (error) {
      console.error('API Error - Get application:', error);
      throw new Error('Failed to fetch application');
    }
  },

  // Get all applications for the current user
  getAll: async (): Promise<Application[]> => {
    try {
      const response = await AxiosInstance.get(`${API_URL}/applications`);
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

      const response = await AxiosInstance.post(`${API_URL}/upload`, formData, {
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
      const response = await AxiosInstance.patch(`${API_URL}/applications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error - Update application:', error);
      throw new Error('Failed to update application');
    }
  },

  // Cancel an application
  cancel: async (id: string): Promise<void> => {
    try {
      await AxiosInstance.post(`${API_URL}/applications/${id}/cancel`);
    } catch (error) {
      console.error('API Error - Cancel application:', error);
      throw new Error('Failed to cancel application');
    }
  },
};
