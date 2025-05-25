/* eslint-disable @typescript-eslint/no-explicit-any */

import { renewalApi, UpdateRenewalPayload } from '@/api/applicant/renewal/RenewalApi';
import { RenewPassportResponse } from '@/types/passportRenewalTypes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const RENEWAL_KEYS = {
  all: ['renewals'] as const,
  lists: () => [...RENEWAL_KEYS.all, 'list'] as const,
  list: (filters: any) => [...RENEWAL_KEYS.lists(), filters] as const,
  details: (id: string) => [...RENEWAL_KEYS.all, 'details', id] as const,
};

export const useRenewalRequests = (filters?: any) => {
  return useQuery({
    queryKey: RENEWAL_KEYS.list(filters || {}),
    queryFn: () => renewalApi.getAll(filters),
  });
};

export const useRenewalRequest = (id: string) => {
  return useQuery({
    queryKey: RENEWAL_KEYS.details(id),
    queryFn: () => renewalApi.getOne(id),
  });
};

async function sendStatusUpdateEmail(renewalRequest: RenewPassportResponse) {
  try {
    if (!renewalRequest.email) {
      console.error('No user email found in renewal request');
      return;
    }

    await axios.post('/api/renewal/send', {
      renewal: renewalRequest,
      recipientEmail: renewalRequest.email,
    });

    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
}

export const useUpdateRenewal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRenewalPayload }) =>
      renewalApi.updateAsAdmin(id, data),
    onSuccess: async (renewalRequest, { id }) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: RENEWAL_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RENEWAL_KEYS.details(id) });

      // Send email notification
      await sendStatusUpdateEmail(renewalRequest);
    },
  });
};
