/* eslint-disable @typescript-eslint/no-explicit-any */

import { RenewPassportResponse, RenewPassportStatus } from '@/types/passportRenewalTypes';
import AxiosInstance from '@/utils/helpers/axiosApi';

const RENEWAL_ENDPOINTS = {
  GET_ALL: '/renew-passport',
  GET_ONE: (id: string) => `/renew-passport/${id}`,
  UPDATE: (id: string) => `/renew-passport/${id}`,
} as const;

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateRenewalPayload {
  status: RenewPassportStatus;
  rejectionReason?: string;
  adminNotes?: string;
}

export const renewalApi = {
  getAll: (filters?: any) =>
    AxiosInstance.get<PaginatedResponse<RenewPassportResponse>>(RENEWAL_ENDPOINTS.GET_ALL, {
      params: filters,
    }).then(res => res.data),

  getOne: (id: string) =>
    AxiosInstance.get<RenewPassportResponse>(RENEWAL_ENDPOINTS.GET_ONE(id)).then(res => res.data),

  updateAsAdmin: (id: string, data: UpdateRenewalPayload) =>
    AxiosInstance.patch<RenewPassportResponse>(RENEWAL_ENDPOINTS.UPDATE(id), data).then(
      res => res.data,
    ),
};
