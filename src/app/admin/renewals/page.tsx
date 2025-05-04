'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { useRenewalRequests } from '@/hooks/useRenewal';
import { Loader2, Search } from 'lucide-react';
import { columns } from './columns';
import { RenewPassportResponse } from '@/types/passportRenewalTypes';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RenewPassportStatus } from '@/types/passportRenewalTypes';

export default function RenewalRequestsPage() {
  const router = useRouter();
  const { data: renewals, isLoading } = useRenewalRequests();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Handle both array and paginated response types
  const renewalItems: RenewPassportResponse[] = Array.isArray(renewals)
    ? renewals
    : (renewals?.items ?? []);

  // Filter renewals based on search query and status
  const filteredRenewals = renewalItems.filter(renewal => {
    const matchesSearch =
      searchQuery === '' ||
      renewal.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      renewal.nicNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      renewal.currentPassportNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || renewal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Passport Renewal Management</h1>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      ) : (
        <>
          <DashboardStats renewals={renewalItems} />

          <div className='rounded-lg border bg-card'>
            <div className='p-4 border-b'>
              <h2 className='text-lg font-medium'>Renewal Requests</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                Manage and review passport renewal requests
              </p>
            </div>

            <div className='p-4 space-y-4'>
              <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                <div className='flex-1 w-full sm:max-w-sm'>
                  <div className='relative'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search by name, NIC, or passport number...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className='pl-8'
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Filter by status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    {Object.values(RenewPassportStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DataTable
                data={filteredRenewals}
                columns={columns}
                onRowClick={(renewal: RenewPassportResponse) =>
                  router.push(`/admin/renewals/${renewal._id}`)
                }
                searchKey='fullName'
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
