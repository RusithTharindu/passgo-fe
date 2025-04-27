import AxiosInstance from '@/utils/helpers/axiosApi';
import { APPLICATION_ENDPOINTS } from './ApiEndPoints';

export const applicationApi = {
  getMyApplications: () =>
    AxiosInstance.get(APPLICATION_ENDPOINTS.MY_APPLICATIONS).then(res => res.data),
};
