'use client';

import { DataTable } from './data-table';
import { useGetApplications } from '@/hooks/useApplication';
import { Application } from '@/types/applicationTypes';

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useGetApplications();

  // Add createdAt field to the mock data
  const applicationsWithDate = applications?.map((app: Application) => ({
    ...app,
    createdAt: app.createdAt || new Date().toISOString(), // Fallback to current date if not provided
  }));

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Passport Applications</h1>
      <div className='rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm'>
        {isLoading ? (
          <p className='text-center text-gray-500'>Loading...</p>
        ) : (
          <DataTable data={applicationsWithDate || []} />
        )}
      </div>
    </div>
  );
}
