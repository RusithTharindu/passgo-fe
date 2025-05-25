'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { DocumentUpload } from './document-upload';
import { DocumentType } from '@/types/application';

type FormData = z.infer<typeof applicationSchema>;

interface DualCitizenshipStepProps {
  form: UseFormReturn<FormData>;
}

export function DualCitizenshipStep({ form }: DualCitizenshipStepProps) {
  const isDualCitizen = form.watch('isDualCitizen');

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Dual Citizenship Information</h2>
        <p className='text-muted-foreground'>
          Provide details about your dual citizenship if applicable
        </p>
      </div>

      <FormField
        control={form.control}
        name='isDualCitizen'
        render={({ field }) => (
          <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel>I am a dual citizen</FormLabel>
              <p className='text-sm text-muted-foreground'>
                Check this box if you hold citizenship of another country
              </p>
            </div>
          </FormItem>
        )}
      />

      {isDualCitizen && (
        <div className='space-y-6 border rounded-md p-6 bg-muted/20'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='dualCitizeshipNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dual Citizenship Certificate Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='foreignNationality'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foreign Nationality</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='foreignPassportNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foreign Passport Number</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className='mt-6'>
            <h3 className='text-base font-medium mb-3'>Upload Dual Citizenship Certificate</h3>
            <DocumentUpload documentType={DocumentType.DUAL_CITIZENSHIP} />
          </div> */}
        </div>
      )}
    </div>
  );
}
