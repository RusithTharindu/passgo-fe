'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import { DocumentUpload } from './document-upload';
import { DocumentKey } from './main-application-form';
import { DocumentType } from '@/types/application';

type FormData = z.infer<typeof applicationSchema>;

interface DocumentsStepProps {
  form: UseFormReturn<FormData>;
  onUploadComplete: (documentType: DocumentType, file: File) => void;
  isUploading: boolean;
  uploadingDocument: DocumentType | null;
}

export function DocumentsStep({
  form,
  onUploadComplete,
  isUploading,
  uploadingDocument,
}: DocumentsStepProps) {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={form.control}
          name={`documents.birth_certificate_front` as `documents.${DocumentKey}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Certificate (Front)</FormLabel>
              <FormControl>
                <DocumentUpload
                  documentType={DocumentType.BIRTH_CERT_FRONT}
                  onFileSelect={file => onUploadComplete(DocumentType.BIRTH_CERT_FRONT, file)}
                  isLoading={uploadingDocument === DocumentType.BIRTH_CERT_FRONT && isUploading}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`documents.birth_certificate_back` as `documents.${DocumentKey}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Certificate (Back)</FormLabel>
              <FormControl>
                <DocumentUpload
                  documentType={DocumentType.BIRTH_CERT_BACK}
                  onFileSelect={file => onUploadComplete(DocumentType.BIRTH_CERT_BACK, file)}
                  isLoading={uploadingDocument === DocumentType.BIRTH_CERT_BACK && isUploading}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={form.control}
          name={`documents.nic_front` as `documents.${DocumentKey}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIC (Front)</FormLabel>
              <FormControl>
                <DocumentUpload
                  documentType={DocumentType.NIC_FRONT}
                  onFileSelect={file => onUploadComplete(DocumentType.NIC_FRONT, file)}
                  isLoading={uploadingDocument === DocumentType.NIC_FRONT && isUploading}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`documents.nic_back` as `documents.${DocumentKey}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIC (Back)</FormLabel>
              <FormControl>
                <DocumentUpload
                  documentType={DocumentType.NIC_BACK}
                  onFileSelect={file => onUploadComplete(DocumentType.NIC_BACK, file)}
                  isLoading={uploadingDocument === DocumentType.NIC_BACK && isUploading}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`documents.user_photo` as `documents.${DocumentKey}`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passport Photo</FormLabel>
            <FormControl>
              <DocumentUpload
                documentType={DocumentType.USER_PHOTO}
                onFileSelect={file => onUploadComplete(DocumentType.USER_PHOTO, file)}
                isLoading={uploadingDocument === DocumentType.USER_PHOTO && isUploading}
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <FormField
        control={form.control}
        name={`documents.additional_documents` as `documents.${DocumentKey}`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Documents (Optional)</FormLabel>
            <FormControl>
              <DocumentUpload
                documentType={DocumentType}
                onFileSelect={file => onUploadComplete(DocumentType.ADDITIONAL_DOCS, file)}
                isLoading={uploadingDocument === DocumentType.ADDITIONAL_DOCS && isUploading}
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </div>
  );
}
