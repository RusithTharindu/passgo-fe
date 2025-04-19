'use client';

import { DataTable } from './data-table';
import { useGetApplications } from '@/hooks/useApplication';

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useGetApplications();

  console.log(applications);

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-gray-900'>Passport Applications</h1>
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
        {isLoading ? (
          <p className='text-center text-gray-500'>Loading...</p>
        ) : (
          <DataTable data={applications || []} />
        )}
      </div>
    </div>
  );
}
