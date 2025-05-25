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
import { SriLankaDistrict } from '@/types/applicationTypes';

{
   
}

type FormData = z.infer<typeof applicationSchema>;

interface BirthInfoStepProps {
  form: UseFormReturn<FormData>;
}

export function BirthInfoStep({ form }: BirthInfoStepProps) {
  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Birth Certificate Information</h2>
        <p className='text-muted-foreground'>
          Provide details from your birth certificate and upload photos of the document
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={form.control}
          name='birthCertificateNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Certificate Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g., 12345678' />
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

      <div className='space-y-6'>
        <div className='bg-blue-50 border border-blue-200 rounded-md p-4 mt-4'>
          <p className='text-sm text-blue-700'>
            <strong>Note:</strong> Please ensure that all details on the birth certificate are
            clearly visible. The birth certificate should be the original document issued by the
            Registrar General&apos;s Department.
          </p>
        </div>
      </div>
    </div>
  );
}
