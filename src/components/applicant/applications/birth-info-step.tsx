'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import { DocumentUpload } from './document-upload';
import { DocumentType } from '@/types/application';

type FormData = z.infer<typeof applicationSchema>;

interface BirthInfoStepProps {
  form: UseFormReturn<FormData>;
}

export function BirthInfoStep({ form }: BirthInfoStepProps) {
  const handleBirthCertFrontUpload = (url: string) => {
    form.setValue('birthCertificatePhotos.front', url);
  };

  const handleBirthCertBackUpload = (url: string) => {
    form.setValue('birthCertificatePhotos.back', url);
  };

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
              <FormControl>
                <Input {...field} placeholder='e.g., Colombo' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='space-y-6'>
        <h3 className='text-lg font-medium mt-6'>Upload Birth Certificate</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <FormLabel>Birth Certificate (Front)</FormLabel>
            <DocumentUpload
              documentType={DocumentType.BIRTH_CERT_FRONT}
              onUploadComplete={handleBirthCertFrontUpload}
            />
          </div>

          <div>
            <FormLabel>Birth Certificate (Back)</FormLabel>
            <DocumentUpload
              documentType={DocumentType.BIRTH_CERT_BACK}
              onUploadComplete={handleBirthCertBackUpload}
            />
          </div>
        </div>

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
