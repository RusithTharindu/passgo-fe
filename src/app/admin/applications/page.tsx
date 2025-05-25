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

  const applicationsWithDate = applications?.map((app: Application) => ({
    ...app,
    createdAt: app.createdAt || new Date().toISOString(), // Fallback to current date if not provided
  }));

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
              <DataTable data={filteredApplications || []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
