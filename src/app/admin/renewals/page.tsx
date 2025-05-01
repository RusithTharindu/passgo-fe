'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { useRenewalRequests } from '@/hooks/useRenewal';
import { Loader2 } from 'lucide-react';
import { columns } from './columns';
import { RenewPassportResponse } from '@/types/passportRenewalTypes';

export default function RenewalRequestsPage() {
  const router = useRouter();
  const { data: renewals, isLoading } = useRenewalRequests();

  // Handle both array and paginated response types
  const renewalItems: RenewPassportResponse[] = Array.isArray(renewals)
    ? renewals
    : (renewals?.items ?? []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold dark:text-gray-100'>Passport Renewal Requests</h1>
      </div>

      <div className='rounded-lg border dark:border-gray-800 dark:bg-gray-900/50 p-4'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <DataTable
            data={renewalItems}
            columns={columns}
            onRowClick={(renewal: RenewPassportResponse) =>
              router.push(`/admin/renewals/${renewal._id}`)
            }
            searchKey='fullName'
          />
        )}
      </div>
    </div>
  );
}
