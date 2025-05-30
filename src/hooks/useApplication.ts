import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applicantQueryKeys } from '../api/applicant/QueryKeys';
import { createApplication } from '../api/applicant/ApplicantApi';
import { toast } from './use-toast';
import { adminQueryKeys } from '@/api/admin/AdminQueryKeys';
import {
  deleteApplication,
  getApplicationById,
  getApplications,
  getDailyDistribution,
  getDistrictDistribution,
  getPassportTypesData,
  updateApplication,
} from '@/api/admin/AdminApi';
import { UpdateApplicationPayload } from '@/types/applicationTypes';
import { applicationApi } from '@/api/application';
import { Application, DocumentType } from '@/types/application';
import axios from 'axios';
import AxiosInstance from '@/utils/helpers/axiosApi';
import { applicationEndpoints } from '@/api/common/ApiEndPoints';

export const useCreateApplication = () => {
  return useMutation({
    mutationKey: applicantQueryKeys.createApplication,
    mutationFn: createApplication,
    onSuccess: () => {
      toast({
        title: 'Application created successfully',
        description: 'Your application has been created successfully',
        variant: 'default',
      });
    },
    onError: error => {
      toast({
        title: 'Error creating application',
        description: `Please try again later, ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useGetApplications = () => {
  return useQuery({
    queryKey: adminQueryKeys.getApplications,
    queryFn: getApplications,
  });
};

export const useGetApplicationById = (id: string) => {
  return useQuery({
    queryKey: adminQueryKeys.getApplicationById,
    queryFn: () => getApplicationById(id),
  });
};

export const useUpdateApplication = (id: string) => {
  return useMutation({
    mutationKey: adminQueryKeys.updateApplication,
    mutationFn: (payload: UpdateApplicationPayload) => updateApplication(id, payload),
  });
};

export const useDeleteApplication = (id: string) => {
  return useMutation({
    mutationKey: adminQueryKeys.deleteApplication,
    mutationFn: () => deleteApplication(id),
  });
};

export function useApplicationSubmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applicationApi.create,
    onSuccess: async application => {
      try {
        // Send email notification
        await axios.post('/api/application/send', {
          application,
          recipientEmail: application.emailAddress,
        });

        // Invalidate the applications list query when a new application is submitted
        queryClient.invalidateQueries({ queryKey: ['applications'] });
      } catch (error) {
        console.error('Failed to send application email:', error);
        // Don't throw error - we don't want to break the flow if email fails
      }
    },
  });
}

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: applicationApi.getAll,
  });
}

export function useApplicationById(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUserApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      applicationApi.update(id, data),
    onSuccess: data => {
      // Update both the applications list and the specific application
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', data.id] });
    },
  });
}

export function useCancelApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applicationApi.cancel,
    onSuccess: (_, id) => {
      // Invalidate the applications list and the specific application
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    },
  });
}

export function useDocumentUpload() {
  return useMutation({
    mutationFn: ({ documentType, file }: { documentType: DocumentType; file: File }) =>
      applicationApi.uploadDocument(documentType, file),
  });
}

export function useUploadApplicationDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentType,
      file,
      applicationId,
    }: {
      documentType: DocumentType;
      file: File;
      applicationId: string;
    }) => {
      if (!applicationId) {
        throw new Error('Cannot upload document: Application ID is required');
      }

      const formData = new FormData();
      formData.append('file', file);

      // Use the defined endpoint from ApiEndPoints
      const response = await AxiosInstance.post(
        applicationEndpoints.uploadDocument(applicationId, documentType),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refresh the application data
      queryClient.invalidateQueries({
        queryKey: ['application', variables.applicationId],
      });
    },
  });
}

export const useGetDistrictDistribution = () => {
  return useQuery({
    queryKey: adminQueryKeys.getDistrictDistribution,
    queryFn: getDistrictDistribution,
    enabled: true,
  });
};

export const useGetDailyDistribution = () => {
  return useQuery({
    queryKey: adminQueryKeys.getDailyDistribution,
    queryFn: getDailyDistribution,
    enabled: true,
  });
};

export const useGetPassportTypesData = () => {
  return useQuery({
    queryKey: adminQueryKeys.getPassportTypesData,
    queryFn: getPassportTypesData,
    enabled: true,
  });
};
