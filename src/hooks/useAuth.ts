import { loginApi } from '@/api/common/authApi/AuthApi';
import { LoginRequest } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { tokenStorage } from '@/utils/helpers/cookieStorage';
import { authQueryKeys } from '@/api/common/authApi/AuthQueryKeys';

export const useLogin = () =>
  useMutation({
    mutationKey: authQueryKeys.login,
    mutationFn: async (data: LoginRequest) => await loginApi(data),
    onSuccess: data => {
      // Save token to cookie, with rememberMe flag if present in data
      tokenStorage.setToken(data.accessToken);
    },
    onError: error => {
      console.error(error);
    },
  });
