'use client';

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

  // Handle both array and paginated response types
  const appointmentItems: Appointment[] = Array.isArray(appointments)
    ? appointments
    : (appointments?.items ?? []);

  // Filter appointments based on status and date
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
              <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                <div className='flex-1 w-full sm:max-w-sm'>
                  {/* Search input was here but it's currently commented out */}
                </div>
                <div className='flex gap-4'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-[200px] justify-start text-left font-normal',
                          !dateFilter && 'text-muted-foreground',
                        )}
                      >
                        <Calendar className='mr-2 h-4 w-4' />
                        {dateFilter ? format(dateFilter, 'PPP') : 'Filter by date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <CalendarComponent
                        mode='single'
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      {Object.values(AppointmentStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
