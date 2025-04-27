import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Appointment, AppointmentStatus } from '@/types/appointmentTypes';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
}

function getStatusColor(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.APPROVED:
      return 'bg-green-500/10 text-green-500';
    case AppointmentStatus.REJECTED:
      return 'bg-red-500/10 text-red-500';
    case AppointmentStatus.PENDING:
      return 'bg-yellow-500/10 text-yellow-500';
    case AppointmentStatus.CANCELLED:
      return 'bg-gray-500/10 text-gray-500';
    case AppointmentStatus.COMPLETED:
      return 'bg-blue-500/10 text-blue-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='font-semibold'>#{appointment.appointmentId}</div>
        <Badge className={getStatusColor(appointment.status)}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center space-x-2 text-sm'>
          <MapPin className='h-4 w-4 opacity-70' />
          <span>{appointment.preferredLocation}</span>
        </div>
        <div className='flex items-center space-x-2 text-sm'>
          <Calendar className='h-4 w-4 opacity-70' />
          <span>{format(new Date(appointment.preferredDate), 'PPP')}</span>
        </div>
        <div className='flex items-center space-x-2 text-sm'>
          <Clock className='h-4 w-4 opacity-70' />
          <span>{appointment.preferredTime}</span>
        </div>
        {appointment.adminNotes && (
          <div className='mt-2 text-sm text-muted-foreground'>
            <p className='font-medium'>Admin Notes:</p>
            <p>{appointment.adminNotes}</p>
          </div>
        )}
        {appointment.status === AppointmentStatus.REJECTED && appointment.rejectionReason && (
          <div className='mt-2 text-sm text-red-500'>
            <p className='font-medium'>Rejection Reason:</p>
            <p>{appointment.rejectionReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
