'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';

type FormData = z.infer<typeof applicationSchema>;

interface ChildInfoStepProps {
  form: UseFormReturn<FormData>;
}

export function ChildInfoStep({ form }: ChildInfoStepProps) {
  const isChild = form.watch('isChild');

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Child Information</h2>
        <p className='text-muted-foreground'>
          Provide details if this application is for a child under 16 years
        </p>
      </div>

      <FormField
        control={form.control}
        name='isChild'
        render={({ field }) => (
          <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel>This application is for a child under 16 years</FormLabel>
              <p className='text-sm text-muted-foreground'>
                Check this box if you are applying for a passport for a child under 16 years of age
              </p>
            </div>
          </FormItem>
        )}
      />

      {isChild && (
        <div className='space-y-6 border rounded-md p-6 bg-muted/20'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='childFatherPassportNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father&apos;s Passport Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='childMotherPassportNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother&apos;s Passport Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='rounded-md border p-4 bg-blue-50'>
            <h4 className='font-medium text-blue-800 mb-2'>Important Note</h4>
            <p className='text-sm text-blue-700'>
              For child passport applications, please ensure you have the following additional
              documents ready:
            </p>
            <ul className='list-disc list-inside text-sm text-blue-700 mt-2'>
              <li>Child&apos;s birth certificate (original and photocopy)</li>
              <li>Parents&apos; national ID cards or passports (photocopies)</li>
              <li>Letter of consent from both parents</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
