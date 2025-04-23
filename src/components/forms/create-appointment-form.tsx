'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createAppointmentSchema } from '@/utils/validation/AppointmentSchema';
import { useCreateAppointment, useAvailableSlots } from '@/hooks/useAppointments';
import { AppointmentLocation } from '@/types/appointmentTypes';

type FormData = z.infer<typeof createAppointmentSchema>;

export function CreateAppointmentForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      fullName: '',
      permanentAddress: '',
      nicNumber: '',
      contactNumber: '',
      preferredLocation: undefined,
      preferredDate: '',
      preferredTime: '',
      reason: '',
    },
  });

  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const selectedDate = form.watch('preferredDate');
  const selectedLocation = form.watch('preferredLocation');

  // Mock time slots for testing - replace with actual API call when ready
  const mockTimeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const { data: availableSlots = mockTimeSlots } = useAvailableSlots(
    selectedDate,
    selectedLocation as AppointmentLocation,
  );

  //   const formattedTimeSlots = availableSlots.map(slot => {
  //     try {
  //       const parsedTime = parse(slot, 'HH:mm', new Date());
  //       return format(parsedTime, 'HH:mm');
  //     } catch {
  //       return slot;
  //     }
  //   });

  function onSubmit(data: FormData) {
    const formattedDate = format(new Date(data.preferredDate), 'yyyy-MM-dd');

    createAppointment(
      {
        ...data,
        preferredDate: formattedDate,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Appointment created successfully',
          });
          router.push('/applicant/appointment');
        },
        onError: error => {
          toast({
            title: 'Error',
            description: `Failed to create appointment. Please try again. ${error.message}`,
            variant: 'destructive',
          });
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full max-w-2xl mx-auto'>
        <div className='space-y-6'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Full Name</FormLabel>
                <FormControl>
                  <Input className='h-11' placeholder='John Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='permanentAddress'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Permanent Address</FormLabel>
                <FormControl>
                  <Textarea
                    className='min-h-[100px] resize-none'
                    placeholder='Enter your permanent address'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='nicNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>NIC Number</FormLabel>
                  <FormControl>
                    <Input className='h-11' placeholder='123456789V' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='contactNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Contact Number</FormLabel>
                  <FormControl>
                    <Input className='h-11' placeholder='+94XXXXXXXXX' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='preferredLocation'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Preferred Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='h-11'>
                      <SelectValue placeholder='Select a location' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AppointmentLocation).map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='preferredDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='text-base'>Preferred Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'h-11 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={date => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        disabled={date => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const maxDate = new Date();
                          maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking 3 months ahead
                          return date < today || date > maxDate;
                        }}
                        initialFocus
                        fromDate={new Date()}
                        toDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='preferredTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Preferred Time</FormLabel>
                  <Select
                    onValueChange={value => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={!selectedDate || !selectedLocation}
                  >
                    <FormControl>
                      <SelectTrigger className='h-11'>
                        <SelectValue
                          placeholder={
                            !selectedDate
                              ? 'Select a date first'
                              : !selectedLocation
                                ? 'Select a location first'
                                : 'Select a time slot'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='reason'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Reason for Appointment</FormLabel>
                <FormControl>
                  <Textarea
                    className='min-h-[100px] resize-none'
                    placeholder='Please provide the reason for your appointment'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className='w-full h-11' disabled={isPending}>
          {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Schedule Appointment
        </Button>
      </form>
    </Form>
  );
}
