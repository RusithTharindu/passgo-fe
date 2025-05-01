'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Download, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/molecules/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RenewPassportResponse,
  PassportDocumentType,
  RenewPassportStatus,
} from '@/types/passportRenewalTypes';
import { DocumentUploader } from '@/components/molecules/document-uploader';
import { useUploadRenewalDocument, useRenewalDocument } from '@/hooks/usePassportRenewal';
import { useToast } from '@/hooks/use-toast';

interface RenewalDetailViewProps {
  renewal: RenewPassportResponse;
}

export function RenewalDetailView({ renewal }: RenewalDetailViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [uploadingDocument, setUploadingDocument] = useState<PassportDocumentType | null>(null);
  const { mutate: uploadDocument, isPending: isUploading } = useUploadRenewalDocument(renewal._id);

  // Format dates for display
  const dateOfBirth = new Date(renewal.dateOfBirth);
  const expiryDate = new Date(renewal.currentPassportExpiryDate);
  const createdDate = new Date(renewal.createdAt);
  const updatedDate = new Date(renewal.updatedAt);

  // Calculate document completeness
  const requiredDocuments = 5; // 5 required, 1 optional
  const uploadedDocuments = Object.values(renewal.documents).filter(Boolean).length;
  const documentCompleteness = Math.min(
    Math.round((uploadedDocuments / requiredDocuments) * 100),
    100,
  );

  // Handle document upload
  const handleUploadDocument = (documentType: PassportDocumentType, file: File) => {
    setUploadingDocument(documentType);

    uploadDocument(
      {
        documentType,
        file,
      },
      {
        onSuccess: () => {
          setUploadingDocument(null);
          toast({
            title: 'Success',
            description: 'Document uploaded successfully.',
          });
        },
        onError: error => {
          setUploadingDocument(null);
          toast({
            title: 'Error',
            description: `Failed to upload document. ${error.message}`,
            variant: 'destructive',
          });
        },
      },
    );
  };

  // Helper to render document item
  const renderDocumentItem = (
    label: string,
    documentType: PassportDocumentType,
    isRequired: boolean = true,
  ) => {
    const documentUrl = renewal.documents[documentType];
    const isImage = documentUrl?.match(/\.(jpeg|jpg|gif|png)$/i);
    const isUploading = uploadingDocument === documentType;
    const canUpload = renewal.status === RenewPassportStatus.PENDING;

    return (
      <div className='border rounded-lg p-4 space-y-3'>
        <div className='flex justify-between items-center'>
          <h3 className='font-medium text-sm'>
            {label}
            {isRequired && <span className='text-red-500 ml-1'>*</span>}
          </h3>
          {documentUrl && (
            <Button size='sm' variant='outline' asChild>
              <a href={documentUrl} target='_blank' rel='noopener noreferrer'>
                <Download className='mr-2 h-4 w-4' />
                Download
              </a>
            </Button>
          )}
        </div>

        {documentUrl ? (
          <div className='relative h-48 w-full bg-gray-50 border rounded-md overflow-hidden'>
            {isImage ? (
              <Image src={documentUrl} alt={label} fill className='object-contain' />
            ) : (
              <div className='flex flex-col items-center justify-center h-full'>
                <FileText className='h-10 w-10 text-primary' />
                <p className='mt-2 text-sm'>Document uploaded</p>
              </div>
            )}
          </div>
        ) : canUpload ? (
          <DocumentUploader
            label={`Upload ${label}`}
            value=''
            onChange={() => {}}
            onFileSelect={file => handleUploadDocument(documentType, file)}
            isLoading={isUploading && uploadingDocument === documentType}
          />
        ) : (
          <div className='flex items-center justify-center h-32 bg-gray-50 border rounded-md'>
            <p className='text-muted-foreground text-sm'>No document uploaded</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Button variant='outline' asChild>
          <Link href='/applicant/passport-renewal'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Renewals
          </Link>
        </Button>
        <StatusBadge status={renewal.status} />
      </div>

      <div className='bg-white rounded-lg border shadow-sm'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-medium'>Passport Renewal Request</h2>
          <p className='text-muted-foreground'>ID: {renewal._id}</p>
        </div>

        <Tabs defaultValue='details' value={activeTab} onValueChange={setActiveTab} className='p-4'>
          <TabsList className='mb-4'>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='documents'>Documents</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='font-medium text-base'>Personal Information</h3>

                <div className='space-y-3'>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <p className='text-sm text-muted-foreground'>Full Name</p>
                      <p className='font-medium'>{renewal.fullName}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>NIC Number</p>
                      <p className='font-medium'>{renewal.nicNumber}</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>Date of Birth</p>
                    <p className='font-medium'>{format(dateOfBirth, 'PPP')}</p>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>Address</p>
                    <p className='font-medium'>{renewal.address}</p>
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <p className='text-sm text-muted-foreground'>Contact Number</p>
                      <p className='font-medium'>{renewal.contactNumber}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Email</p>
                      <p className='font-medium'>{renewal.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='font-medium text-base'>Passport Information</h3>

                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Current Passport Number</p>
                    <p className='font-medium'>{renewal.currentPassportNumber}</p>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>Current Passport Expiry Date</p>
                    <p className='font-medium'>{format(expiryDate, 'PPP')}</p>
                  </div>

                  <h3 className='font-medium text-base mt-6'>Request Information</h3>

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <p className='text-sm text-muted-foreground'>Created Date</p>
                      <p className='font-medium'>{format(createdDate, 'PPP')}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Last Updated</p>
                      <p className='font-medium'>{format(updatedDate, 'PPP pp')}</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>Document Completeness</p>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-primary'
                          style={{ width: `${documentCompleteness}%` }}
                        />
                      </div>
                      <span className='text-xs'>{documentCompleteness}%</span>
                    </div>
                  </div>

                  {renewal.status === RenewPassportStatus.VERIFIED && (
                    <div className='bg-green-50 p-3 rounded text-sm border border-green-100'>
                      <div className='flex'>
                        <CheckCircle2 className='h-4 w-4 text-green-500 mt-0.5 mr-2' />
                        <div>
                          <p className='font-medium text-green-700'>
                            Verified on {format(updatedDate, 'PPP pp')}
                          </p>
                          <p className='text-green-600'>
                            By: {renewal.userId.firstName} {renewal.userId.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {renewal.status === RenewPassportStatus.REJECTED && renewal.adminRemarks && (
                    <div className='bg-red-50 p-3 rounded text-sm border border-red-100'>
                      <p className='font-medium text-red-700'>Rejection Reason:</p>
                      <p className='text-red-600'>{renewal.adminRemarks}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='documents' className='space-y-6'>
            {documentCompleteness < 100 && renewal.status === RenewPassportStatus.PENDING && (
              <div className='bg-amber-50 p-4 rounded-md border border-amber-100 mb-4'>
                <h3 className='font-medium text-amber-800'>Documents Required</h3>
                <p className='text-amber-700 text-sm mt-1'>
                  Please upload all required documents to complete your renewal request.
                </p>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {renderDocumentItem('Current Passport', PassportDocumentType.CURRENT_PASSPORT)}
              {renderDocumentItem('NIC Front', PassportDocumentType.NIC_FRONT)}
              {renderDocumentItem('NIC Back', PassportDocumentType.NIC_BACK)}
              {renderDocumentItem('Birth Certificate', PassportDocumentType.BIRTH_CERT)}
              {renderDocumentItem('Passport Photo', PassportDocumentType.PHOTO)}
              {renderDocumentItem(
                'Additional Documents',
                PassportDocumentType.ADDITIONAL_DOCS,
                false,
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
