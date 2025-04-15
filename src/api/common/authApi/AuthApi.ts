import AxiosInstance from '@/utils/helpers/axiosApi';
import { authEndpoints } from '../ApiEndPoints';
import { LoginRequest, SignUpRequest } from '@/types/api';

export const loginApi = async ({ email, password }: LoginRequest) => {
  const res = await AxiosInstance.post(authEndpoints.login, { email, password });

  if (res.data.error == 'Unauthorized') {
    throw new Error('Invalid email or password');
  }

  return { ...res.data };
};

export const signUpApi = async (data: SignUpRequest) => {
  const res = await AxiosInstance.post(authEndpoints.signup, data);

  if (res.data.error) {
    throw new Error(res.data.error);
  }

  return { ...res.data };
};
