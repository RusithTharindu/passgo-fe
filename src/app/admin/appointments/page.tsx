'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from './data-table';
import { useAppointments } from '@/hooks/useAppointments';
import { Loader2 } from 'lucide-react';
import { Appointment } from '@/types/appointmentTypes';

export default function AppointmentsPage() {
  const router = useRouter();
  const { data: appointments, isLoading } = useAppointments();

  console.log('Appointments data:', appointments);

  // Handle both array and paginated response types
  const appointmentItems: Appointment[] = Array.isArray(appointments)
    ? appointments
    : (appointments?.items ?? []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold dark:text-gray-100'>Appointments</h1>
      </div>

      <div className='rounded-lg border dark:border-gray-800 dark:bg-gray-900/50 p-4'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <DataTable
            data={appointmentItems}
            onRowClick={appointment => router.push(`/admin/appointments/${appointment.id}`)}
          />
        )}
      </div>
    </div>
  );
}
