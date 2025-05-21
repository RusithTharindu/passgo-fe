'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useParams, useRouter } from 'next/navigation';
import { useRenewalRequest, useUpdateRenewal } from '@/hooks/useRenewal';
import { RenewPassportStatus, PassportDocumentType } from '@/types/passportRenewalTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SubmittedDocumentView } from '@/components/molecules/submitted-document-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentPreview } from '@/components/molecules/document-preview';

const documentLabels = {
  [PassportDocumentType.CURRENT_PASSPORT]: 'Current Passport',
  [PassportDocumentType.NIC_FRONT]: 'NIC Front',
  [PassportDocumentType.NIC_BACK]: 'NIC Back',
  [PassportDocumentType.BIRTH_CERT]: 'Birth Certificate',
  [PassportDocumentType.PHOTO]: 'Passport Photo',
  [PassportDocumentType.ADDITIONAL_DOCS]: 'Additional Documents',
};

export default function RenewalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<RenewPassportStatus | ''>('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const { data: renewal, isLoading } = useRenewalRequest(params.id as string);
  const { mutate: updateRenewal, isPending: isUpdating } = useUpdateRenewal();

  const handleUpdateStatus = () => {
    if (!status) return;

    const data = {
      status,
      ...(status === RenewPassportStatus.REJECTED ? { rejectionReason } : {}),
      ...(adminNotes ? { adminNotes } : {}),
    };

    updateRenewal(
      { id: params.id as string, data },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Renewal request status updated successfully',
          });
          router.refresh();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to update renewal request status',
            variant: 'destructive',
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!renewal) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <AlertTriangle className='h-12 w-12 text-destructive mb-4' />
        <h1 className='text-2xl font-bold mb-2'>Renewal Request Not Found</h1>
        <p className='text-muted-foreground mb-4'>
          The requested renewal application does not exist.
        </p>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to List
        </Button>
      </div>
    );
  }

  const documentCompleteness = Math.min(
    Math.round((Object.values(renewal.documents).filter(Boolean).length / 5) * 100),
    100,
  );

  return (
    <div className='p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold'>Renewal Request Details</h1>
          <p className='text-muted-foreground'>ID: {renewal._id}</p>
        </div>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to List
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
              <CardDescription>Personal and contact details of the applicant</CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Full Name</p>
                <p className='font-medium'>{renewal.fullName}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>NIC Number</p>
                <p className='font-medium'>{renewal.nicNumber}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Date of Birth</p>
                <p className='font-medium'>{format(new Date(renewal.dateOfBirth), 'PPP')}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Contact Number</p>
                <p className='font-medium'>{renewal.contactNumber}</p>
              </div>
              <div className='col-span-2'>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-medium'>{renewal.email}</p>
              </div>
              <div className='col-span-2'>
                <p className='text-sm text-muted-foreground'>Address</p>
                <p className='font-medium'>{renewal.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passport Information</CardTitle>
              <CardDescription>Current passport details</CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Passport Number</p>
                <p className='font-medium'>{renewal.currentPassportNumber}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Expiry Date</p>
                <p className='font-medium'>
                  {format(new Date(renewal.currentPassportExpiryDate), 'PPP')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>Review uploaded documents</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-24 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-primary'
                      style={{ width: `${documentCompleteness}%` }}
                    />
                  </div>
                  <span className='text-sm'>{documentCompleteness}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {Object.entries(documentLabels).map(([key, label]) => {
                const documentUrl = renewal.documents[key as PassportDocumentType];
                if (!documentUrl) return null;
                return (
                  <DocumentPreview
                    key={key}
                    id={renewal._id}
                    label={label}
                    url={documentUrl}
                    documentType={key}
                    isRequired={key !== PassportDocumentType.ADDITIONAL_DOCS}
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Request Status</CardTitle>
              <CardDescription>Current status and timeline</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Current Status</p>
                <Badge
                  className={
                    renewal.status === RenewPassportStatus.VERIFIED
                      ? 'bg-green-500/10 text-green-500'
                      : renewal.status === RenewPassportStatus.REJECTED
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                  }
                >
                  {renewal.status}
                </Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Submitted Date</p>
                <p className='font-medium'>{format(new Date(renewal.createdAt), 'PPP')}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Last Updated</p>
                <p className='font-medium'>{format(new Date(renewal.updatedAt), 'PPP pp')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change request status and add notes</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>New Status</p>
                <Select
                  value={status}
                  onValueChange={value => setStatus(value as RenewPassportStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RenewPassportStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {status === RenewPassportStatus.REJECTED && (
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Rejection Reason</p>
                  <Textarea
                    placeholder='Enter reason for rejection'
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Admin Notes</p>
                <Textarea
                  placeholder='Add any additional notes (optional)'
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                />
              </div>

              <Button
                className='w-full'
                onClick={handleUpdateStatus}
                disabled={
                  !status ||
                  isUpdating ||
                  (status === RenewPassportStatus.REJECTED && !rejectionReason)
                }
              >
                {isUpdating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
