'use client';

import { DataTable } from './data-table';
import { useGetApplications } from '@/hooks/useApplication';

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useGetApplications();

  console.log(applications);

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-gray-100'>Applications</h1>
      <div className='rounded-lg border border-gray-800 bg-gray-900/50 p-4'>
        {isLoading ? (
          <p className='text-center text-gray-400'>Loading...</p>
        ) : (
          <DataTable data={applications || []} />
        )}
      </div>
    </div>
  );
}
