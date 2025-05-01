{
  /* eslint-disable @typescript-eslint/no-explicit-any */
}

import { renewalEndpoints } from '../common/ApiEndPoints';
import {
  RenewPassportRequest,
  RenewPassportResponse,
  PassportDocumentType,
  RenewPassportList,
} from '@/types/passportRenewalTypes';
import AxiosInstance from '@/utils/helpers/axiosApi';

export const createRenewalRequest = async (
  data: RenewPassportRequest,
): Promise<RenewPassportResponse> => {
  try {
    const response = await AxiosInstance.post(renewalEndpoints.createRenewal, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.error ||
        error?.message ||
        'Failed to create renewal request',
    );
  }
};

export const uploadRenewalDocument = async (
  id: string,
  documentType: PassportDocumentType,
  file: File,
): Promise<{ url: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await AxiosInstance.post(
      renewalEndpoints.uploadDocument(id, documentType),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Failed to upload document';

    if (errorMessage.includes('own requests')) {
      throw new Error('You can only upload documents to your own passport renewal requests');
    }

    throw new Error(errorMessage);
  }
};

export const getRenewalDocument = async (
  id: string,
  documentType: PassportDocumentType,
): Promise<{ url: string }> => {
  const response = await AxiosInstance.get(renewalEndpoints.getDocument(id, documentType));
  return response.data;
};

export const getUserRenewalRequests = async (): Promise<RenewPassportList> => {
  const response = await AxiosInstance.get(renewalEndpoints.getUserRequests);
  return response.data;
};

export const getSingleRenewalRequest = async (id: string): Promise<RenewPassportResponse> => {
  const response = await AxiosInstance.get(renewalEndpoints.getSingleRequest(id));
  return response.data;
};

export const sendRenewalCompletionEmail = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await AxiosInstance.post(renewalEndpoints.sendCompletionEmail(id));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || 'Failed to send completion email',
    );
  }
};
