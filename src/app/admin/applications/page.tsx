'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { DataTable } from './data-table';
import { useGetApplications } from '@/hooks/useApplication';
import { Application } from '@/types/applicationTypes';
import { ApplicationStats } from '@/components/admin/application-stats';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ApplicationStatus } from '@/types/application';

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useGetApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add createdAt field to the mock data
  const applicationsWithDate = applications?.map((app: Application) => ({
    ...app,
    createdAt: app.createdAt || new Date().toISOString(), // Fallback to current date if not provided
  }));

  // Filter applications based on search query and status
  const filteredApplications = applicationsWithDate?.filter((app: Application) => {
    const matchesSearch =
      searchQuery === '' ||
      app.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.otherNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nationalIdentityCardNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Passport Applications</h1>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      ) : (
        <>
          <ApplicationStats applications={applicationsWithDate || []} />

          <div className='rounded-lg border bg-card'>
            <div className='p-4 border-b'>
              <h2 className='text-lg font-medium'>Application List</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                Manage and process passport applications
              </p>
            </div>

            <div className='p-4 space-y-4'>
              {/* <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                <div className='flex-1 w-full sm:max-w-sm'>
                  <div className='relative'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search by name or NIC number...'
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
                    <SelectItem value={ApplicationStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={ApplicationStatus.DOCUMENT_VERIFICATION}>
                      Document Verification
                    </SelectItem>
                    <SelectItem value={ApplicationStatus.BIOMETRIC_PENDING}>
                      Biometric Pending
                    </SelectItem>
                    <SelectItem value={ApplicationStatus.BIOMETRIC_COMPLETED}>
                      Biometric Completed
                    </SelectItem>
                    <SelectItem value={ApplicationStatus.PAYMENT_PENDING}>
                      Payment Pending
                    </SelectItem>
                    <SelectItem value={ApplicationStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={ApplicationStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={ApplicationStatus.REJECTED}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <DataTable data={filteredApplications || []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
