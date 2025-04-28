import { useMutation, useQuery } from '@tanstack/react-query';
import { applicantQueryKeys } from '../api/applicant/QueryKeys';
import { createApplication } from '../api/applicant/ApplicantApi';
import { toast } from './use-toast';
import { adminQueryKeys } from '@/api/admin/AdminQueryKeys';
import {
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication,
} from '@/api/admin/AdminApi';
import { UpdateApplicationPayload } from '@/types/applicationTypes';

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
