import AxiosInstance from '@/utils/helpers/axiosApi';
import { applicationEndpoints } from '../common/ApiEndPoints';
import { CreateApplicationPayload } from '@/types/applicationTypes';

export const createApplication = async (payload: CreateApplicationPayload) => {
  const res = await AxiosInstance.post(applicationEndpoints.application, payload);
  if (res.data.error == 'Unauthorized') {
    throw new Error('Invalid email or password');
  }
  return res.data;
};

// const getApplication = async (id: string): Promise<Application> => {
//     const response = await axios.get(`/api/applications/${id}`);
//     return response.data;
//   };

//   const createApplication = async (payload: CreateApplicationPayload): Promise<Application> => {
//     const response = await axios.post('/api/applications', payload);
//     return response.data;
//   };

//   const updateApplication = async (id: string, payload: UpdateApplicationPayload): Promise<Application> => {
//     const response = await axios.patch(`/api/applications/${id}`, payload);
//     return response.data;
//   };
