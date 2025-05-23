'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applicationApi } from '@/api/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApplicationStatus } from '@/utils/statusTransitions';
import { format } from 'date-fns';

// Define an interface for the application data
interface ApplicationData {
  _id?: string;
  id?: string;
  status: string; // Changed from ApplicationStatus to string to accept any status format
  surname?: string;
  otherNames?: string;
  nationalIdentityCardNumber?: string;
  birthdate?: string;
  createdAt?: string;
  typeOfService?: string;
  collectionLocation?: string;
  rejectionReason?: string;
  adminNotes?: string;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  // Using Record for additional properties instead of any
  [key: string]: unknown;
}

// Define the order of statuses for the timeline
const statusOrder = [
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.PAYMENT_PENDING,
  ApplicationStatus.PAYMENT_VERIFIED,
  ApplicationStatus.COUNTER_VERIFICATION,
  ApplicationStatus.BIOMETRICS_PENDING,
  ApplicationStatus.BIOMETRICS_COMPLETED,
  ApplicationStatus.CONTROLLER_REVIEW,
  ApplicationStatus.SENIOR_OFFICER_REVIEW,
  ApplicationStatus.DATA_ENTRY,
  ApplicationStatus.PRINTING_PENDING,
  ApplicationStatus.PRINTING,
  ApplicationStatus.QUALITY_ASSURANCE,
  ApplicationStatus.READY_FOR_COLLECTION,
  ApplicationStatus.COLLECTED,
];

// Status descriptions for better context
const statusDescriptions = {
  [ApplicationStatus.SUBMITTED]: 'Your application has been submitted successfully.',
  [ApplicationStatus.PAYMENT_PENDING]:
    'Please complete the payment to proceed with your application.',
  [ApplicationStatus.PAYMENT_VERIFIED]:
    'Your payment has been verified. Your application is proceeding.',
  [ApplicationStatus.COUNTER_VERIFICATION]: 'Your application is being verified at the counter.',
  [ApplicationStatus.BIOMETRICS_PENDING]: 'Your biometrics data collection is pending.',
  [ApplicationStatus.BIOMETRICS_COMPLETED]: 'Your biometrics have been collected successfully.',
  [ApplicationStatus.CONTROLLER_REVIEW]: 'Your application is under controller review.',
  [ApplicationStatus.SENIOR_OFFICER_REVIEW]:
    'Your application is being reviewed by a senior officer.',
  [ApplicationStatus.DATA_ENTRY]: 'Your application data is being entered into the system.',
  [ApplicationStatus.PRINTING_PENDING]: 'Your passport is in the printing queue.',
  [ApplicationStatus.PRINTING]: 'Your passport is currently being printed.',
  [ApplicationStatus.QUALITY_ASSURANCE]: 'Your passport is undergoing quality inspection.',
  [ApplicationStatus.READY_FOR_COLLECTION]: 'Your passport is ready for collection.',
  [ApplicationStatus.COLLECTED]: 'Your passport has been collected. Process complete!',
  [ApplicationStatus.ON_HOLD]: 'Your application is currently on hold.',
  [ApplicationStatus.REJECTED]:
    'Your application has been rejected. Please check the reason below.',
};

// Determine the status variant for styling
const getStatusVariant = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.SUBMITTED:
    case ApplicationStatus.PAYMENT_PENDING:
    case ApplicationStatus.PAYMENT_VERIFIED:
    case ApplicationStatus.COUNTER_VERIFICATION:
    case ApplicationStatus.BIOMETRICS_PENDING:
    case ApplicationStatus.BIOMETRICS_COMPLETED:
    case ApplicationStatus.CONTROLLER_REVIEW:
    case ApplicationStatus.SENIOR_OFFICER_REVIEW:
    case ApplicationStatus.DATA_ENTRY:
    case ApplicationStatus.PRINTING_PENDING:
    case ApplicationStatus.PRINTING:
    case ApplicationStatus.QUALITY_ASSURANCE:
      return 'secondary';
    case ApplicationStatus.READY_FOR_COLLECTION:
    case ApplicationStatus.COLLECTED:
      return 'default';
    case ApplicationStatus.ON_HOLD:
      return 'outline';
    case ApplicationStatus.REJECTED:
      return 'destructive';
    default:
      return 'outline';
  }
};

const formatStatus = (status: ApplicationStatus) => {
  return status
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export default function ApplicationStatusDetail() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setIsLoading(true);
      try {
        const data = await applicationApi.getById(params.id as string);
        setApplication(data as unknown as ApplicationData);
      } catch (error: unknown) {
        console.error('Error fetching application:', error);

        let errorTitle = 'Error';
        let errorDescription = 'Failed to fetch application details';

        const appError = error as {
          response?: { status: number };
          message?: string;
        };

        if (
          appError?.response?.status === 429 ||
          (appError.message && appError.message.includes('Too Many Requests'))
        ) {
          errorTitle = 'Too Many Requests';
          errorDescription = 'Please wait a moment before trying again';
        } else if (appError?.response?.status === 404) {
          errorTitle = 'Application Not Found';
          errorDescription = 'We couldn&apos;t find the application with this ID';
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: 'destructive',
        });

        router.push('/applicant/application/status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [params.id, router, toast]);

  if (isLoading) {
    return (
      <div className='container mx-auto py-12 flex items-center justify-center min-h-[50vh]'>
        <div className='flex flex-col items-center'>
          <Loader2 className='h-12 w-12 animate-spin text-primary' />
          <p className='mt-4 text-muted-foreground'>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className='container mx-auto py-12 flex flex-col items-center justify-center min-h-[50vh]'>
        <AlertCircle className='h-12 w-12 text-destructive mb-4' />
        <h2 className='text-2xl font-bold mb-2'>Application Not Found</h2>
        <p className='text-muted-foreground mb-6'>
          We couldn&apos;t find the application with the provided ID.
        </p>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Go Back
        </Button>
      </div>
    );
  }

  const currentStatus = mapToApplicationStatus(application.status);

  const currentStatusIndex = statusOrder.indexOf(currentStatus);

  function mapToApplicationStatus(status: string): ApplicationStatus {
    if (Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      return status as ApplicationStatus;
    }

    const statusMap: Record<string, ApplicationStatus> = {
      pending: ApplicationStatus.SUBMITTED,
      document_verification: ApplicationStatus.COUNTER_VERIFICATION,
      biometric_pending: ApplicationStatus.BIOMETRICS_PENDING,
      biometric_completed: ApplicationStatus.BIOMETRICS_COMPLETED,
      payment_pending: ApplicationStatus.PAYMENT_PENDING,
      payment_completed: ApplicationStatus.PAYMENT_VERIFIED,
      processing: ApplicationStatus.DATA_ENTRY,
      completed: ApplicationStatus.COLLECTED,
      rejected: ApplicationStatus.REJECTED,
    };

    return statusMap[status] || ApplicationStatus.SUBMITTED; // Default to SUBMITTED if unknown
  }

  return (
    <div className='container mx-auto py-12'>
      <Button variant='outline' className='mb-6' onClick={() => router.back()}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Search
      </Button>

      <div className='grid gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='text-2xl'>Application Status</CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                Application ID: {application._id || application.id}
              </p>
            </div>
            <Badge variant={getStatusVariant(currentStatus)}>{formatStatus(currentStatus)}</Badge>
          </CardHeader>
          <CardContent>
            <div className='mb-6'>
              <p className='text-muted-foreground'>{statusDescriptions[currentStatus]}</p>
              {currentStatus === ApplicationStatus.REJECTED && application.rejectionReason && (
                <div className='mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md'>
                  <h3 className='font-medium text-destructive mb-2'>Rejection Reason</h3>
                  <p>{application.rejectionReason}</p>
                </div>
              )}
              {currentStatus === ApplicationStatus.ON_HOLD && application.adminNotes && (
                <div className='mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md'>
                  <h3 className='font-medium text-yellow-600 mb-2'>Hold Reason</h3>
                  <p>{application.adminNotes}</p>
                </div>
              )}
            </div>

            {/* Horizontal Timeline */}
            <div className='relative mt-12 mb-6'>
              {/* Timeline line */}
              <div className='absolute h-1 bg-muted w-full top-4 rounded-full'></div>

              {/* Timeline steps */}
              <div className='relative flex justify-between'>
                {statusOrder.map((status, index) => {
                  // Determine if this status is the current one, completed, or upcoming
                  const isCompleted = currentStatusIndex > index;
                  const isCurrent = currentStatusIndex === index;
                  const isRejected = currentStatus === ApplicationStatus.REJECTED;
                  const isOnHold = currentStatus === ApplicationStatus.ON_HOLD;

                  // Skip the ON_HOLD and REJECTED statuses from the timeline
                  if (
                    status === ApplicationStatus.ON_HOLD ||
                    status === ApplicationStatus.REJECTED
                  ) {
                    return null;
                  }

                  const isVisible =
                    index === 0 ||
                    index === statusOrder.length - 1 ||
                    index === Math.floor(statusOrder.length / 2) ||
                    isCurrent ||
                    index % 3 === 0;

                  if (!isVisible) return null;

                  return (
                    <div
                      key={status}
                      className={`flex flex-col items-center relative ${isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      <div
                        className={`
                          h-9 w-9 rounded-full flex items-center justify-center z-10
                          ${
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : isCurrent
                                ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                                : isRejected || isOnHold
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-muted text-muted-foreground'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className='h-5 w-5' />
                        ) : isCurrent ? (
                          <Clock className='h-5 w-5 animate-pulse' />
                        ) : (
                          <span className='text-xs font-medium'>{index + 1}</span>
                        )}
                      </div>
                      <div className='text-xs font-medium mt-2 text-center max-w-[80px]'>
                        {formatStatus(status).split(' ').slice(0, 2).join(' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application Details */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t'>
              <div>
                <h3 className='font-medium mb-2'>Personal Information</h3>
                <dl className='space-y-2'>
                  <div className='grid grid-cols-2'>
                    <dt className='text-sm text-muted-foreground'>Full Name</dt>
                    <dd className='text-sm font-medium'>
                      {application.surname} {application.otherNames}
                    </dd>
                  </div>
                  <div className='grid grid-cols-2'>
                    <dt className='text-sm text-muted-foreground'>NIC Number</dt>
                    <dd className='text-sm font-medium'>
                      {application.nationalIdentityCardNumber}
                    </dd>
                  </div>
                  <div className='grid grid-cols-2'>
                    <dt className='text-sm text-muted-foreground'>Date of Birth</dt>
                    <dd className='text-sm font-medium'>
                      {application.birthdate ? format(new Date(application.birthdate), 'PPP') : '-'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className='font-medium mb-2'>Application Information</h3>
                <dl className='space-y-2'>
                  <div className='grid grid-cols-2'>
                    <dt className='text-sm text-muted-foreground'>Submission Date</dt>
                    <dd className='text-sm font-medium'>
                      {application.createdAt ? format(new Date(application.createdAt), 'PPP') : '-'}
                    </dd>
                  </div>
                  <div className='grid grid-cols-2'>
                    <dt className='text-sm text-muted-foreground'>Service Type</dt>
                    <dd className='text-sm font-medium'>
                      {application.typeOfService === 'oneDay' ? 'One Day' : 'Normal'}
                    </dd>
                  </div>
                  <div className='grid grid-cols-2'>
                    <dt className='text-sm text-muted-foreground'>Collection Location</dt>
                    <dd className='text-sm font-medium'>{application.collectionLocation || '-'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
