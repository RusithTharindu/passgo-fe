'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CollectionLocation, SriLankaDistrict } from '@/types/applicationTypes';

type FormData = z.infer<typeof applicationSchema>;

interface ContactDetailsStepProps {
  form: UseFormReturn<FormData>;
}

export function ContactDetailsStep({ form }: ContactDetailsStepProps) {
  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Contact Details</h2>
        <p className='text-muted-foreground'>
          Provide your contact information so we can reach you
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={form.control}
          name='mobileNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g., 0771234567' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='landlineNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Landline Number (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g., 0112345678' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name='emailAddress'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input {...field} type='email' placeholder='your.email@example.com' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-1 gap-6'>
        <FormField
          control={form.control}
          name='permanentAddress'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permanent Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='permenantAddressDistrict'
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select district' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(SriLankaDistrict).map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
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
        name='collectionLocation'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Collection Location</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select collection location' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={CollectionLocation.COLOMBO}>Colombo</SelectItem>
                <SelectItem value={CollectionLocation.KANDY}>Kandy</SelectItem>
                <SelectItem value={CollectionLocation.GALLE}>Galle</SelectItem>
                <SelectItem value={CollectionLocation.MATARA}>Matara</SelectItem>
                <SelectItem value={CollectionLocation.VAVUNIYA}>Vavuniya</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
