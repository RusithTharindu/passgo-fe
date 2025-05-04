'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';

type FormData = z.infer<typeof applicationSchema>;

interface ServiceDetailsStepProps {
  form: UseFormReturn<FormData>;
}

export function ServiceDetailsStep({ form }: ServiceDetailsStepProps) {
  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Service Details</h2>
        <p className='text-muted-foreground'>
          Select your preferred service type and travel document type
        </p>
      </div>

      <FormField
        control={form.control}
        name='typeOfService'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select service type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='normal'>Normal Service (5-7 working days)</SelectItem>
                <SelectItem value='oneDay'>One Day Service (24 hours)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='TypeofTravelDocument'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Travel Document Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select document type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='all'>All Countries</SelectItem>
                <SelectItem value='middleEast'>Middle East</SelectItem>
                <SelectItem value='emergencyCertificate'>Emergency Certificate</SelectItem>
                <SelectItem value='identityCertificate'>Identity Certificate</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
