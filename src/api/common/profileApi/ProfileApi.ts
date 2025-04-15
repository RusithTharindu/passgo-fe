import AxiosInstance from '@/utils/helpers/axiosApi';
import { profileEndpoints } from '../ApiEndPoints';

export const getProfileData = async (userId: string) => {
  const res = await AxiosInstance.get(`${profileEndpoints.getProfile}/${userId}`);

  if (res.data.error == 'Unauthorized') {
    throw new Error('Invalid email or password');
  }

  return res.data;
};
