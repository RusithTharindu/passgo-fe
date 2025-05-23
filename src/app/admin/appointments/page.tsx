'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useRouter } from 'next/navigation';
import { DataTable } from './data-table';
import { useAppointments } from '@/hooks/useAppointments';
import { Loader2, Calendar } from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/types/appointmentTypes';
import { AppointmentStats } from '@/components/admin/appointment-stats';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function AppointmentsPage() {
  const router = useRouter();
  const { data: appointments, isLoading } = useAppointments();
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date>();

  const appointmentItems: Appointment[] = Array.isArray(appointments)
    ? appointments
    : (appointments?.items ?? []);

  const filteredAppointments = appointmentItems.filter(appointment => {
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      format(new Date(appointment.preferredDate), 'yyyy-MM-dd') ===
        format(dateFilter, 'yyyy-MM-dd');

    return matchesStatus && matchesDate;
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Appointment Management</h1>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      ) : (
        <>
          <AppointmentStats appointments={appointmentItems} />

          <div className='rounded-lg border bg-card'>
            <div className='p-4 border-b'>
              <h2 className='text-lg font-medium'>Appointment List</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                Manage and process appointment requests
              </p>
            </div>

            <div className='p-4 space-y-4'>
              <DataTable
                data={filteredAppointments}
                onRowClick={appointment => router.push(`/admin/appointments/${appointment.id}`)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
