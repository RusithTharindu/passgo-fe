import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Appointment, AppointmentStatus } from '@/types/appointmentTypes';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface AppointmentStatsProps {
  appointments: Appointment[];
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === AppointmentStatus.PENDING).length,
    approved: appointments.filter(a => a.status === AppointmentStatus.APPROVED).length,
    rejected: appointments.filter(a => a.status === AppointmentStatus.REJECTED).length,
  };

  const today = new Date();
  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.preferredDate);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Appointments</CardTitle>
          <Calendar className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.total}</div>
          <p className='text-xs text-muted-foreground'>All scheduled appointments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Today&apos;s Appointments</CardTitle>
          <Calendar className='h-4 w-4 text-blue-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-blue-500'>{todayAppointments}</div>
          <p className='text-xs text-muted-foreground'>Scheduled for today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Pending</CardTitle>
          <Clock className='h-4 w-4 text-amber-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-amber-500'>{stats.pending}</div>
          <p className='text-xs text-muted-foreground'>Awaiting confirmation</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Approved</CardTitle>
          <CheckCircle className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-500'>{stats.approved}</div>
          <p className='text-xs text-muted-foreground'>Confirmed appointments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Rejected</CardTitle>
          <XCircle className='h-4 w-4 text-red-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-500'>{stats.rejected}</div>
          <p className='text-xs text-muted-foreground'>Declined appointments</p>
        </CardContent>
      </Card>
    </div>
  );
}
