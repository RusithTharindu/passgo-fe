import { Metadata } from 'next';
import { CreateAppointmentForm } from '@/components/forms/create-appointment-form';

export const metadata: Metadata = {
  title: 'Create Appointment',
  description: 'Schedule a new appointment',
};

export default function CreateAppointmentPage() {
  return (
    <div className='container  flex flex-col items-center justify-center'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Schedule an Appointment</h1>
        <p className='text-muted-foreground'>Fill in the details to schedule your appointment</p>
      </div>
      <CreateAppointmentForm />
    </div>
  );
}
