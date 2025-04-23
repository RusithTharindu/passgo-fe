'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppointment, useUpdateAppointment } from '@/hooks/useAppointments';
import { AppointmentStatus, UpdateAppointmentAdminPayload } from '@/types/appointmentTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<AppointmentStatus | ''>('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const { data: appointment, isLoading } = useAppointment(params.id as string);
  const { mutate: updateAppointment, isPending: isUpdating } = useUpdateAppointment(true);

  const handleUpdateStatus = () => {
    if (!status) return;

    const data: UpdateAppointmentAdminPayload = {
      status,
      ...(status === AppointmentStatus.REJECTED ? { rejectionReason } : {}),
      ...(adminNotes ? { adminNotes } : {}),
    };

    updateAppointment(
      { id: params.id as string, data },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Appointment status updated successfully',
          });
          router.refresh();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to update appointment status',
            variant: 'destructive',
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold dark:text-gray-100'>
          Appointment Details - {appointment.appointmentId}
        </h1>
        <Button variant='outline' onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Full Name</p>
              <p className='font-medium'>{appointment.fullName}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>NIC Number</p>
              <p className='font-medium'>{appointment.nicNumber}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Contact Number</p>
              <p className='font-medium'>{appointment.contactNumber}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Permanent Address</p>
              <p className='font-medium'>{appointment.permanentAddress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Location</p>
              <p className='font-medium'>{appointment.preferredLocation}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Date & Time</p>
              <p className='font-medium'>
                {format(new Date(appointment.preferredDate), 'PPP')} at {appointment.preferredTime}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Current Status</p>
              <Badge
                className={
                  appointment.status === AppointmentStatus.APPROVED
                    ? 'bg-green-500/10 text-green-500'
                    : appointment.status === AppointmentStatus.REJECTED
                      ? 'bg-red-500/10 text-red-500'
                      : appointment.status === AppointmentStatus.PENDING
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-gray-500/10 text-gray-500'
                }
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Reason for Appointment</p>
              <p className='font-medium'>{appointment.reason}</p>
            </div>
            {appointment.adminNotes && (
              <div>
                <p className='text-sm text-muted-foreground'>Admin Notes</p>
                <p className='font-medium'>{appointment.adminNotes}</p>
              </div>
            )}
            {appointment.status === AppointmentStatus.REJECTED && appointment.rejectionReason && (
              <div>
                <p className='text-sm text-muted-foreground'>Rejection Reason</p>
                <p className='font-medium text-red-500'>{appointment.rejectionReason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Review Appointment</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Update Status</p>
              <Select value={status} onValueChange={value => setStatus(value as AppointmentStatus)}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AppointmentStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {status === AppointmentStatus.REJECTED && (
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Rejection Reason</p>
                <Textarea
                  placeholder='Enter reason for rejection'
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                />
              </div>
            )}

            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Admin Notes</p>
              <Textarea
                placeholder='Enter admin notes (optional)'
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
              />
            </div>

            <Button
              className='w-full'
              onClick={handleUpdateStatus}
              disabled={
                !status || isUpdating || (status === AppointmentStatus.REJECTED && !rejectionReason)
              }
            >
              {isUpdating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Update Appointment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
