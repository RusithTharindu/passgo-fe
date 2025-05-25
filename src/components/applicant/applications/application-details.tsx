'use client';

import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '@/api/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Application } from '@/types/application';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ApplicationDetailsProps {
  applicationId: string;
}

export function ApplicationDetails({ applicationId }: ApplicationDetailsProps) {
  const router = useRouter();
  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationApi.getById(applicationId),
  });

  if (isLoading) {
    return <ApplicationDetailsSkeleton />;
  }

  if (!application) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>Application not found</p>
        <Button variant='link' onClick={() => router.push('/applicant/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.push('/applicant/applications')}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <h1 className='text-3xl font-bold'>Application Details</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Application ID</p>
              <p className='font-mono'>{application.id}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Status</p>
              <StatusBadge status={application.status} />
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Type of Service</p>
              <p className='capitalize'>{application.typeOfService}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Travel Document Type</p>
              <p className='capitalize'>{application.TypeofTravelDocument}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Full Name</p>
              <p>
                {application.surname} {application.otherNames}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>NIC Number</p>
              <p>{application.nationalIdentityCardNumber}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Date of Birth</p>
              <p>
                {application.birthdate ? format(new Date(application.birthdate), 'PPP') : 'N/A'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Contact</p>
              <p>{application.mobileNumber}</p>
              <p className='text-sm'>{application.emailAddress}</p>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationTimeline status={application.status} />
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {application.nicPhotos.front && (
                <DocumentPreview
                  title='NIC (Front)'
                  url={application.nicPhotos.front}
                  isVerified={application.documentVerification?.some(
                    doc => doc.documentType === 'nic_front' && doc.verified,
                  )}
                />
              )}
              {application.nicPhotos.back && (
                <DocumentPreview
                  title='NIC (Back)'
                  url={application.nicPhotos.back}
                  isVerified={application.documentVerification?.some(
                    doc => doc.documentType === 'nic_back' && doc.verified,
                  )}
                />
              )}
              {application.birthCertificatePhotos.front && (
                <DocumentPreview
                  title='Birth Certificate (Front)'
                  url={application.birthCertificatePhotos.front}
                  isVerified={application.documentVerification?.some(
                    doc => doc.documentType === 'birth_cert_front' && doc.verified,
                  )}
                />
              )}
              {application.birthCertificatePhotos.back && (
                <DocumentPreview
                  title='Birth Certificate (Back)'
                  url={application.birthCertificatePhotos.back}
                  isVerified={application.documentVerification?.some(
                    doc => doc.documentType === 'birth_cert_back' && doc.verified,
                  )}
                />
              )}
              {application.userPhoto && (
                <DocumentPreview
                  title='Studio Photo'
                  url={application.userPhoto}
                  isVerified={application.photoVerified}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Application['status'] }) {
  const variants: Record<Application['status'], 'default' | 'secondary' | 'destructive'> = {
    pending: 'default',
    document_verification: 'secondary',
    biometric_pending: 'secondary',
    biometric_completed: 'secondary',
    payment_pending: 'default',
    payment_completed: 'default',
    processing: 'secondary',
    completed: 'default',
    rejected: 'destructive',
  };

  return <Badge variant={variants[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
}

function ApplicationTimeline({ status }: { status: Application['status'] }) {
  const timeline = [
    { status: 'pending', label: 'Application Submitted' },
    { status: 'document_verification', label: 'Document Verification' },
    { status: 'biometric_pending', label: 'Biometric Appointment' },
    { status: 'biometric_completed', label: 'Biometric Completed' },
    { status: 'payment_pending', label: 'Payment Required' },
    { status: 'payment_completed', label: 'Payment Completed' },
    { status: 'processing', label: 'Processing' },
    { status: 'completed', label: 'Completed' },
  ];

  const currentIndex = timeline.findIndex(item => item.status === status);

  return (
    <div className='relative'>
      <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-muted' />
      <div className='space-y-6'>
        {timeline.map((item, index) => {
          const isCompleted = index <= currentIndex && status !== 'rejected';
          const isCurrent = item.status === status;

          return (
            <div key={item.status} className='relative flex items-center gap-4 pl-10'>
              <div
                className={`absolute left-0 p-2 rounded-full ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className='h-4 w-4' />
                ) : isCurrent ? (
                  <Clock className='h-4 w-4' />
                ) : (
                  <div className='h-4 w-4' />
                )}
              </div>
              <p
                className={
                  isCompleted ? 'font-medium' : isCurrent ? 'font-medium' : 'text-muted-foreground'
                }
              >
                {item.label}
              </p>
            </div>
          );
        })}
        {status === 'rejected' && (
          <div className='relative flex items-center gap-4 pl-10'>
            <div className='absolute left-0 p-2 rounded-full bg-destructive text-destructive-foreground'>
              <X className='h-4 w-4' />
            </div>
            <p className='font-medium text-destructive'>Application Rejected</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentPreview({
  title,
  url,
  isVerified,
}: {
  title: string;
  url: string;
  isVerified?: boolean;
}) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <p className='font-medium'>{title}</p>
        {isVerified !== undefined && (
          <Badge variant={isVerified ? 'default' : 'secondary'}>
            {isVerified ? 'Verified' : 'Pending'}
          </Badge>
        )}
      </div>
      <div className='relative aspect-video w-full overflow-hidden rounded-lg border'>
        <Image src={url} alt={title} fill className='object-cover' />
      </div>
    </div>
  );
}

function ApplicationDetailsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Skeleton className='h-10 w-10' />
        <Skeleton className='h-10 w-48' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-40' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className='h-4 w-24 mb-1' />
                <Skeleton className='h-6 w-48' />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-40' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className='h-4 w-24 mb-1' />
                <Skeleton className='h-6 w-48' />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
