import { loginApi } from '@/api/common/authApi/AuthApi';
import { LoginRequest } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { tokenStorage } from '@/utils/helpers/cookieStorage';
import { authQueryKeys } from '@/api/common/authApi/AuthQueryKeys';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/hooks/use-toast';

export const useLogin = () => {
  const { setUserFromToken } = useAuthStore();

  return useMutation({
    mutationKey: authQueryKeys.login,
    mutationFn: async (data: LoginRequest) => await loginApi(data),
    onSuccess: data => {
      // Save token to cookie
      tokenStorage.setToken(data.accessToken);
      // Initialize auth store with user data from token
      setUserFromToken();
    },
    onError: error => {
      toast({
        title: 'Error logging in',
        description: `${error.message}, Please try again later`,
        variant: 'destructive',
      });
    },
  });
};
