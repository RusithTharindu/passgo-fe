'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import { NICValidator } from './nic-validator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type FormData = z.infer<typeof applicationSchema>;

interface PersonalInfoStepProps {
  form: UseFormReturn<FormData>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const [isNICValidated, setIsNICValidated] = useState(false);
  const nicNumber = form.watch('nationalIdentityCardNumber');

  const handleNICValidationSuccess = (data: { gender: 'male' | 'female'; birthdate: string }) => {
    form.setValue('sex', data.gender);
    form.setValue('birthdate', data.birthdate);
    setIsNICValidated(true);
  };

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Personal Information</h2>
        <p className='text-muted-foreground'>
          Enter your personal details for the passport application
        </p>
      </div>

      <FormField
        control={form.control}
        name='nationalIdentityCardNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>NIC Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder='e.g., 199012345678 or 901234567V' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {nicNumber && nicNumber.length >= 10 && !isNICValidated && (
        <NICValidator nicNumber={nicNumber} onValidationSuccess={handleNICValidationSuccess} />
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={form.control}
          name='surname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='otherNames'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Names</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name='sex'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sex</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='flex space-x-4'
              >
                <FormItem className='flex items-center space-x-2'>
                  <FormControl>
                    <RadioGroupItem value='male' />
                  </FormControl>
                  <FormLabel className='font-normal'>Male</FormLabel>
                </FormItem>
                <FormItem className='flex items-center space-x-2'>
                  <FormControl>
                    <RadioGroupItem value='female' />
                  </FormControl>
                  <FormLabel className='font-normal'>Female</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='birthdate'
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>Date of Birth</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={date => field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)}
                  disabled={date => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={form.control}
          name='birthCertificateNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Certificate Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='birthCertificateDistrict'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Certificate District</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <FormField
          control={form.control}
          name='placeOfBirth'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Birth</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='profession'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession/Occupation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
