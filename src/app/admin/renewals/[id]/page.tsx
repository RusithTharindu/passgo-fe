'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useParams, useRouter } from 'next/navigation';
import { useRenewalRequest, useUpdateRenewal } from '@/hooks/useRenewal';
import { RenewPassportStatus, PassportDocumentType } from '@/types/passportRenewalTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

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
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!renewal) {
    return <div>Renewal request not found</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold dark:text-gray-100'>
          Renewal Request Details - {renewal._id}
        </h1>
        <Button variant='outline' onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Full Name</p>
              <p className='font-medium'>{renewal.fullName}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>NIC Number</p>
              <p className='font-medium'>{renewal.nicNumber}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Passport Number</p>
              <p className='font-medium'>{renewal.currentPassportNumber}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Passport Expiry</p>
              <p className='font-medium'>
                {format(new Date(renewal.currentPassportExpiryDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Contact Number</p>
              <p className='font-medium'>{renewal.contactNumber}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Email</p>
              <p className='font-medium'>{renewal.email}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Address</p>
              <p className='font-medium'>{renewal.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Submitted Date</p>
              <p className='font-medium'>{format(new Date(renewal.createdAt), 'PPP')}</p>
            </div>
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
            {renewal.adminRemarks && (
              <div>
                <p className='text-sm text-muted-foreground'>Admin Notes</p>
                <p className='font-medium'>{renewal.adminRemarks}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {Object.entries(renewal.documents).map(([key, url]) => {
                if (!url) return null;
                const docType = key as PassportDocumentType;
                return (
                  <div
                    key={key}
                    className='p-4 border rounded-lg flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800'
                  >
                    <FileText className='w-12 h-12 text-blue-500' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{documentLabels[docType]}</p>
                      <a
                        href={`/api/documents/${url}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-blue-500 hover:underline'
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Review Request</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Update Status</p>
              <Select
                value={status}
                onValueChange={value => setStatus(value as RenewPassportStatus)}
              >
                <SelectTrigger className='w-[200px]'>
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
                placeholder='Enter admin notes (optional)'
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
              Update Request Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
