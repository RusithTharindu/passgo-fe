'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Appointment } from '@/types/appointmentTypes';

interface AppointmentConfirmationModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentConfirmationModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentConfirmationModalProps) {
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Appointment Confirmed!</DialogTitle>
          <DialogDescription>
            Your appointment has been successfully scheduled. Please save these details for your
            reference.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Appointment ID</p>
              <p className='text-lg font-semibold'>{appointment.appointmentId}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Location</p>
              <p className='text-lg'>{appointment.preferredLocation}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Date & Time</p>
              <p className='text-lg'>
                {format(new Date(appointment.preferredDate), 'PPP')} at {appointment.preferredTime}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
