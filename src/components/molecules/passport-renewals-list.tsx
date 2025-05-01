'use client';

{
   
}

import { useState } from 'react';
import { useUserRenewalRequests } from '@/hooks/usePassportRenewal';
import { PassportRenewalCard } from '@/components/cards/passport-renewal-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RenewPassportStatus } from '@/types/passportRenewalTypes';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function PassportRenewalsList() {
  const [filter, setFilter] = useState<RenewPassportStatus | 'ALL'>('ALL');
  const { data: renewals, isLoading, isError } = useUserRenewalRequests();

  const filteredRenewals = renewals?.filter(
    renewal => filter === 'ALL' || renewal.status === filter,
  );

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-2xl font-bold'>Passport Renewals</h1>
        <Button asChild>
          <Link href='/applicant/passport-renewal/new'>
            <Plus className='mr-2 h-4 w-4' />
            New Renewal Request
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue='ALL'
        value={filter}
        onValueChange={value => setFilter(value as RenewPassportStatus | 'ALL')}
        className='w-full'
      >
        <TabsList className='mb-4'>
          <TabsTrigger value='ALL'>All</TabsTrigger>
          <TabsTrigger value={RenewPassportStatus.PENDING}>Pending</TabsTrigger>
          <TabsTrigger value={RenewPassportStatus.VERIFIED}>Verified</TabsTrigger>
          <TabsTrigger value={RenewPassportStatus.REJECTED}>Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className='flex justify-center items-center h-60'>
          <div className='flex flex-col items-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <p className='mt-2 text-sm text-muted-foreground'>Loading your renewals...</p>
          </div>
        </div>
      ) : isError ? (
        <div className='flex justify-center items-center h-60'>
          <div className='text-center'>
            <p className='text-destructive font-medium'>Failed to load renewal requests</p>
            <p className='text-muted-foreground mt-1'>Please try again later</p>
          </div>
        </div>
      ) : filteredRenewals?.length === 0 ? (
        <div className='flex justify-center items-center h-60 border rounded-lg'>
          <div className='text-center p-6'>
            <h3 className='font-medium text-lg'>No renewal requests found</h3>
            {filter === 'ALL' ? (
              <p className='text-muted-foreground mt-1'>
                You haven&apos;t submitted any passport renewal requests yet.
              </p>
            ) : (
              <p className='text-muted-foreground mt-1'>
                You don&apos;t have any {filter.toLowerCase()} renewal requests.
              </p>
            )}
            <Button className='mt-4' asChild>
              <Link href='/applicant/passport-renewal/new'>Create New Request</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {filteredRenewals?.map(renewal => (
            <PassportRenewalCard key={renewal._id} renewal={renewal} />
          ))}
        </div>
      )}
    </div>
  );
}
