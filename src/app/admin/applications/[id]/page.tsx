'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '@/api/application';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  ApplicationStatus,
  getValidNextStatuses,
  formatStatus,
  getStatusDescription,
} from '@/utils/statusTransitions';
import { ApplicationStatus as AppStatus } from '@/types/application';
import axios from 'axios';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
}

function DocumentPreview({ label, url, type }: { label: string; url: string; type: string }) {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = type.startsWith('image/');

  return (
    <>
      <div className='border rounded-lg p-4 space-y-3'>
        <div className='flex justify-between items-center'>
          <h3 className='font-medium text-sm'>{label}</h3>
          <Button size='sm' variant='outline' onClick={() => setShowPreview(true)}>
            View
          </Button>
        </div>
        <div className='aspect-video relative bg-muted rounded-md overflow-hidden'>
          {isImage ? (
            <Image src={url} alt={label} fill className='object-cover' />
          ) : (
            <div className='flex items-center justify-center h-full'>
              <FileText className='h-8 w-8 text-muted-foreground' />
            </div>
          )}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='max-w-4xl'>
          {isImage ? (
            <div className='relative aspect-video'>
              <Image src={url} alt={label} fill className='object-contain' />
            </div>
          ) : (
            <iframe src={url} title={label} className='w-full h-[80vh]' />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminApplicationDetails() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');
  const [availableStatuses, setAvailableStatuses] = useState<ApplicationStatus[]>([]);

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', params.id],
    queryFn: async () => {
      // Since getById doesn't take an id parameter anymore,
      // we'll use the more generic update method to fetch by ID
      const response = await applicationApi.getById(params.id as string);
      // const app = response.find(a => a._id === params.id || a.id === params.id);
      // if (!app) throw new Error('Application not found');
      return response;
    },
  });

  // Update available statuses when the application data is loaded
  useEffect(() => {
    if (application?.status) {
      try {
        // Map the application status to the backend ApplicationStatus enum
        const appStatus = application.status as unknown as ApplicationStatus;

        // Get valid next statuses based on current status
        const validStatuses = getValidNextStatuses(appStatus);
        setAvailableStatuses(validStatuses);

        // Reset selected status when application changes
        setSelectedStatus('');
      } catch (error) {
        console.error('Error setting available statuses:', error);
        setAvailableStatuses([]);
      }
    }
  }, [application]);

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!selectedStatus) throw new Error('Please select a status');

      // Validate the status transition
      if (application?.status) {
        const appStatus = application.status as unknown as ApplicationStatus;
        if (!getValidNextStatuses(appStatus).includes(selectedStatus)) {
          throw new Error('Invalid status transition');
        }
      }

      return applicationApi.update(params.id as string, {
        status: selectedStatus as unknown as AppStatus,
        adminNotes,
        rejectionReason:
          selectedStatus === ApplicationStatus.REJECTED ? rejectionReason : undefined,
      });
    },
    onSuccess: async updatedApplication => {
      try {
        // Send email notification
        await axios.post('/api/application/send', {
          application: updatedApplication,
          recipientEmail: updatedApplication.emailAddress,
        });

        queryClient.invalidateQueries({ queryKey: ['application', params.id] });
        toast({
          title: 'Success',
          description: 'Application status updated successfully and notification sent.',
        });

        // Reset form fields after successful update
        setSelectedStatus('');
        setAdminNotes('');
        setRejectionReason('');
      } catch (error) {
        console.error('Failed to send email notification:', error);
        toast({
          title: 'Status Updated',
          description: 'Application status updated but failed to send email notification.',
          variant: 'destructive',
        });
      }
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!application) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-2xl font-bold'>Application not found</h1>
        <Button onClick={() => router.back()} variant='link' className='mt-4'>
          <ArrowLeft className='mr-2 h-4 w-4' /> Go back
        </Button>
      </div>
    );
  }

  // Cast the application status to the backend ApplicationStatus enum
  const currentStatus = application.status as unknown as ApplicationStatus;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>
          Passport Application - {application._id || application.id}
        </h1>
        <div className='flex items-center gap-3'>
          <Badge variant={getStatusVariant(currentStatus)}>{formatStatus(currentStatus)}</Badge>
          <Button variant='outline' onClick={() => router.back()}>
            Back to List
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Full Name</p>
              <p className='font-medium'>
                {application.surname || '-'} {application.otherNames || '-'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>NIC Number</p>
              <p className='font-medium'>{application.nationalIdentityCardNumber || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Date of Birth</p>
              <p className='font-medium'>
                {application.birthdate ? format(new Date(application.birthdate), 'PPP') : '-'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Sex</p>
              <p className='font-medium'>
                {application.sex ? (application.sex === 'male' ? 'Male' : 'Female') : '-'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Profession</p>
              <p className='font-medium'>{application.profession || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Contact Number</p>
              <p className='font-medium'>{application.mobileNumber || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Email Address</p>
              <p className='font-medium'>{application.emailAddress || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Application Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Application Date</p>
              <p className='font-medium'>
                {application.createdAt ? format(new Date(application.createdAt), 'PPP') : '-'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Service Type</p>
              <p className='font-medium'>
                {application.typeOfService === 'oneDay' ? 'One Day' : 'Normal'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Travel Document Type</p>
              <p className='font-medium'>
                {application.TypeofTravelDocument
                  ? (() => {
                      switch (application.TypeofTravelDocument) {
                        case 'all':
                          return 'All Countries';
                        case 'middleEast':
                          return 'Middle East';
                        case 'emergencyCertificate':
                          return 'Emergency Certificate';
                        case 'identityCertificate':
                          return 'Identity Certificate';
                        default:
                          return application.TypeofTravelDocument;
                      }
                    })()
                  : '-'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Collection Location</p>
              <p className='font-medium'>{application.collectionLocation || '-'}</p>
            </div>
            {application.presentTravelDocument && (
              <div>
                <p className='text-sm text-muted-foreground'>Present Travel Document</p>
                <p className='font-medium'>{application.presentTravelDocument}</p>
              </div>
            )}
            {application.adminNotes && (
              <div>
                <p className='text-sm text-muted-foreground'>Admin Notes</p>
                <p className='font-medium'>{application.adminNotes}</p>
              </div>
            )}
            {currentStatus === ApplicationStatus.REJECTED && application.rejectionReason && (
              <div>
                <p className='text-sm text-muted-foreground'>Rejection Reason</p>
                <p className='font-medium text-red-500'>{application.rejectionReason}</p>
              </div>
            )}

            <div className='bg-muted p-3 rounded-md'>
              <p className='text-sm text-muted-foreground'>Current Status</p>
              <p className='font-medium'>{getStatusDescription(currentStatus)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address & Birth Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Permanent Address</p>
              <p className='font-medium'>{application.permanentAddress || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Address District</p>
              <p className='font-medium'>{application.permenantAddressDistrict || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Place of Birth</p>
              <p className='font-medium'>{application.placeOfBirth || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Birth Certificate Number</p>
              <p className='font-medium'>{application.birthCertificateNumber || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Birth Certificate District</p>
              <p className='font-medium'>{application.birthCertificateDistrict || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dual Citizenship Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Is Dual Citizen</p>
              <p className='font-medium'>
                {application.isDualCitizen !== undefined
                  ? application.isDualCitizen
                    ? 'Yes'
                    : 'No'
                  : '-'}
              </p>
            </div>
            {application.isDualCitizen && (
              <>
                <div>
                  <p className='text-sm text-muted-foreground'>Dual Citizenship Number</p>
                  <p className='font-medium'>{application.dualCitizeshipNumber || '-'}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Foreign Nationality</p>
                  <p className='font-medium'>{application.foreignNationality || '-'}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Foreign Passport Number</p>
                  <p className='font-medium'>{application.foreignPassportNumber || '-'}</p>
                </div>
              </>
            )}
            {application.isChild && (
              <>
                <div>
                  <p className='text-sm text-muted-foreground'>Is Child</p>
                  <p className='font-medium'>Yes</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Father&apos;s Passport Number</p>
                  <p className='font-medium'>{application.childFatherPassportNumber || '-'}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Mother&apos;s Passport Number</p>
                  <p className='font-medium'>{application.childMotherPassportNumber || '-'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        {application.documents && application.documents.length > 0 && (
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {application.documents.map((doc: Document) => (
                  <DocumentPreview key={doc.id} label={doc.name} url={doc.url} type={doc.type} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Update Section */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Update Application Status</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {availableStatuses.length === 0 ? (
              <div className='relative w-full rounded-lg border p-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/30'>
                <AlertCircle className='h-4 w-4 absolute left-4 top-4' />
                <div className='pl-7'>
                  <h5 className='mb-1 font-medium leading-none tracking-tight'>
                    No status transitions available
                  </h5>
                  <div className='text-sm'>
                    <p>This application is in its final state and cannot be updated further.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Update Status</p>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value: ApplicationStatus) => setSelectedStatus(value)}
                  >
                    <SelectTrigger className='w-[240px]'>
                      <SelectValue placeholder='Select new status' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {formatStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Only valid next status options are shown based on the current status.
                  </p>
                </div>

                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Admin Notes</p>
                  <Textarea
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder='Add any notes about this application...'
                    className='min-h-[100px]'
                  />
                </div>

                {selectedStatus === ApplicationStatus.REJECTED && (
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Rejection Reason <span className='text-red-500'>*</span>
                    </p>
                    <Textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      placeholder='Provide a reason for rejection...'
                      className='min-h-[100px]'
                      required
                    />
                  </div>
                )}

                <div className='pt-4'>
                  <Button
                    onClick={() => updateStatus()}
                    disabled={
                      !selectedStatus ||
                      isUpdating ||
                      (selectedStatus === ApplicationStatus.REJECTED && !rejectionReason)
                    }
                    className='w-full'
                  >
                    {isUpdating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Update Application Status
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getStatusVariant(status: ApplicationStatus) {
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
}
