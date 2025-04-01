import AxiosInstance from '@/utils/helpers/axiosApi';
import { authEndpoints } from '../ApiEndPoints';
import { LoginRequest } from '@/types/api';

export const loginApi = async ({ email, password }: LoginRequest) => {
  const res = await AxiosInstance.post(authEndpoints.login, { email, password });

  if (res.data.error == 'Unauthorized') {
    throw new Error('Invalid email or password');
  }

  return { ...res.data };
};
