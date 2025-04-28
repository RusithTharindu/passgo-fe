 

import AxiosInstance from '@/utils/helpers/axiosApi';
import { applicationEndpoints } from '../common/ApiEndPoints';
import { UpdateApplicationPayload } from '@/types/applicationTypes';

export const getApplications = async () => {
  const res = await AxiosInstance.get(applicationEndpoints.application);
  return res.data;
};

export const getApplicationById = async (id: string) => {
  const res = await AxiosInstance.get(`${applicationEndpoints.application}/${id}`);
  return res.data;
};

export const updateApplication = async (id: string, payload: UpdateApplicationPayload) => {
  const res = await AxiosInstance.put(`${applicationEndpoints.application}/${id}`, payload);
  return res.data;
};

export const deleteApplication = async (id: string) => {
  const res = await AxiosInstance.delete(`${applicationEndpoints.application}/${id}`);
  return res.data;
};
