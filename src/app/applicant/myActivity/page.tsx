'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMyAppointments } from '@/hooks/useAppointments';
import { useMyApplications } from '@/hooks/useApplications';
import { AppointmentCard } from '@/components/cards/appointment-card';
import { ApplicationCard } from '@/components/cards/application-card';
import { Loader2 } from 'lucide-react';
import { Application } from '@/types/applicationTypes';
import { Appointment } from '@/types/appointmentTypes';

export default function MyActivityPage() {
  const [activeTab, setActiveTab] = useState('appointments');

  const { data: appointments = [], isLoading: isLoadingAppointments } = useMyAppointments();
  const { data: applications = [], isLoading: isLoadingApplications } = useMyApplications();

  return (
    <div className='container mx-auto py-6 space-y-8'>
      <div className='flex flex-col space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>My Activity</h1>
        <p className='text-muted-foreground'>
          Track all your passport-related activities in one place
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='appointments'>
            Appointments
            {appointments.length > 0 && (
              <span className='ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                {appointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='applications'>
            Applications
            {applications.length > 0 && (
              <span className='ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                {applications.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='appointments' className='mt-6'>
          {isLoadingAppointments ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : appointments.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>No appointments found</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {appointments.map((appointment: Appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='applications' className='mt-6'>
          {isLoadingApplications ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : applications.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>No applications found</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {applications.map((application: Application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
