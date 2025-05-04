{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRenewalRequest,
  uploadRenewalDocument,
  getRenewalDocument,
  getUserRenewalRequests,
  getSingleRenewalRequest,
  sendRenewalCompletionEmail,
} from '@/api/applicant/renewalApi';
import {
  RenewPassportRequest,
  PassportDocumentType,
  RenewPassportResponse,
} from '@/types/passportRenewalTypes';

export const RENEWAL_QUERY_KEYS = {
  all: ['renewals'],
  lists: () => [...RENEWAL_QUERY_KEYS.all, 'list'],
  detail: (id: string) => [...RENEWAL_QUERY_KEYS.all, 'detail', id],
  document: (id: string, type: PassportDocumentType) => [
    ...RENEWAL_QUERY_KEYS.all,
    'document',
    id,
    type,
  ],
};

export function useCreateRenewalRequest() {
  const queryClient = useQueryClient();

  return useMutation<RenewPassportResponse, Error, RenewPassportRequest>({
    mutationFn: (data: RenewPassportRequest) => createRenewalRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENEWAL_QUERY_KEYS.lists() });
    },
  });
}

export function useUploadRenewalDocument(id: string) {
  const queryClient = useQueryClient();
  const { data: renewalRequest } = useRenewalRequest(id);

  return useMutation<{ url: string }, Error, { documentType: PassportDocumentType; file: File }>({
    mutationFn: async ({ documentType, file }) => {
      if (!renewalRequest) {
        throw new Error('Cannot upload document: Renewal request not found');
      }
      return uploadRenewalDocument(id, documentType, file);
    },
    onError: error => {
      // Invalidate the request data to refresh ownership status
      queryClient.invalidateQueries({ queryKey: RENEWAL_QUERY_KEYS.detail(id) });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: RENEWAL_QUERY_KEYS.document(id, variables.documentType),
      });
      queryClient.invalidateQueries({
        queryKey: RENEWAL_QUERY_KEYS.detail(id),
      });
    },
  });
}

export function useRenewalDocument(id: string, documentType: PassportDocumentType) {
  return useQuery({
    queryKey: RENEWAL_QUERY_KEYS.document(id, documentType),
    queryFn: () => getRenewalDocument(id, documentType),
    enabled: !!id && !!documentType,
  });
}

export function useUserRenewalRequests() {
  return useQuery({
    queryKey: RENEWAL_QUERY_KEYS.lists(),
    queryFn: getUserRenewalRequests,
  });
}

export function useRenewalRequest(id?: string) {
  return useQuery({
    queryKey: RENEWAL_QUERY_KEYS.detail(id || ''),
    queryFn: () => getSingleRenewalRequest(id || ''),
    enabled: !!id,
  });
}

export function useSendRenewalCompletionEmail(id: string) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error>({
    mutationFn: () => sendRenewalCompletionEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENEWAL_QUERY_KEYS.detail(id) });
    },
  });
}
