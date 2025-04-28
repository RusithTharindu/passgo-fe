import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '@/api/applicant/application/ApplicationApi';
import { applicantApplicationQueryKeys } from '@/api/applicant/application/QueryKey';

export function useMyApplications() {
  return useQuery({
    queryKey: [applicantApplicationQueryKeys.myApplications],
    queryFn: () => applicationApi.getMyApplications(),
  });
}
