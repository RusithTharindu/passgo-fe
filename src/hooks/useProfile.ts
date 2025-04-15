import { commonQueryKeys } from '@/api/common/CommonQueryKeys';
import { getProfileData } from '@/api/common/profileApi/ProfileApi';
import { useQuery } from '@tanstack/react-query';
import { useUserId } from '@/store/useAuthStore';

export const useProfileData = () => {
  const userId = useUserId();

  return useQuery({
    queryKey: [...commonQueryKeys.getProfileData, userId],
    queryFn: () => getProfileData(userId || ''),
    enabled: !!userId, // Only run query if userId exists
  });
};
