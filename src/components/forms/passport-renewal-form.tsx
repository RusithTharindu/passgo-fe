'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

{
  /* eslint-disable @typescript-eslint/no-explicit-any */
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import axios from 'axios';
import { CalendarIcon, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DocumentUploader } from '@/components/molecules/document-uploader';
import { useUserDetails } from '@/store/useUserStore';
import {
  useCreateRenewalRequest,
  useUploadRenewalDocument,
  useSendRenewalCompletionEmail,
} from '@/hooks/usePassportRenewal';
import { getSingleRenewalRequest } from '@/api/applicant/renewalApi';
import {
  passportRenewalSchema,
  PassportRenewalFormValues,
  documentValidationSchema,
} from '@/utils/validation/RenewalSchema';
import { PassportDocumentType, RenewPassportResponse } from '@/types/passportRenewalTypes';

const STEPS = ['Personal Information', 'Passport Details', 'Documents'] as const;
type Step = (typeof STEPS)[number];

export function PassportRenewalForm() {
  const router = useRouter();
  const { toast } = useToast();
  const userDetails = useUserDetails();
  const [activeStep, setActiveStep] = useState<Step>('Personal Information');
  const [stepIndex, setStepIndex] = useState(0);
  const [renewalId, setRenewalId] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<PassportDocumentType | null>(null);

  const activeStepIndex = STEPS.indexOf(activeStep);

  const form = useForm<PassportRenewalFormValues>({
    resolver: zodResolver(passportRenewalSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      nicNumber: '',
      currentPassportNumber: '',
      currentPassportExpiryDate: '',
      address: '',
      contactNumber: '',
      email: userDetails?.email || '',
      documents: {
        [PassportDocumentType.CURRENT_PASSPORT]: '',
        [PassportDocumentType.NIC_FRONT]: '',
        [PassportDocumentType.NIC_BACK]: '',
        [PassportDocumentType.BIRTH_CERT]: '',
        [PassportDocumentType.PHOTO]: '',
        [PassportDocumentType.ADDITIONAL_DOCS]: '',
      },
    },
    mode: 'onChange',
  });

  const { mutate: createRenewalRequest, isPending: isCreating } = useCreateRenewalRequest();
  const { mutate: uploadDocument, isPending: isUploading } = useUploadRenewalDocument(
    renewalId || '',
  );
  const { mutate: sendCompletionEmail, isPending: isSendingEmail } = useSendRenewalCompletionEmail(
    renewalId || '',
  );

  const goToStep = (step: Step) => {
    setActiveStep(step);
    setStepIndex(STEPS.indexOf(step));
  };

  const goToNextStep = () => {
    const nextStepIndex = activeStepIndex + 1;
    if (nextStepIndex < STEPS.length) {
      const nextStep = STEPS[nextStepIndex];
      goToStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    const prevStepIndex = activeStepIndex - 1;
    if (prevStepIndex >= 0) {
      const prevStep = STEPS[prevStepIndex];
      goToStep(prevStep);
    }
  };

  const handleFileSelect = (documentType: PassportDocumentType, file: File) => {
    setUploadStep(documentType);

    if (!renewalId) {
      toast({
        title: 'Error',
        description: 'You must submit the form first before uploading documents.',
        variant: 'destructive',
      });
      return;
    }

    uploadDocument(
      {
        documentType,
        file,
      },
      {
        onSuccess: response => {
          form.setValue(`documents.${documentType}` as any, response.url);
          setUploadStep(null);
          toast({
            title: 'Success',
            description: 'Document uploaded successfully.',
          });
        },
        onError: (error: any) => {
          setUploadStep(null);
          const errorMessage = error?.message || 'Failed to upload document';

          if (errorMessage.includes('own requests')) {
            toast({
              title: 'Access Denied',
              description: 'You can only upload documents to your own passport renewal requests.',
              variant: 'destructive',
            });
            // Redirect to their requests list
            router.push('/applicant/passport-renewal');
            return;
          }

          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        },
      },
    );
  };

  const onSubmit = async (data: PassportRenewalFormValues) => {
    if (activeStep === 'Documents' && renewalId) {
      try {
        const requiredDocuments = [
          PassportDocumentType.CURRENT_PASSPORT,
          PassportDocumentType.NIC_FRONT,
          PassportDocumentType.NIC_BACK,
          PassportDocumentType.BIRTH_CERT,
          PassportDocumentType.PHOTO,
        ];

        // Get the latest renewal data to check documents
        const renewalData = await getSingleRenewalRequest(renewalId);
        const missingDocuments = requiredDocuments.filter(
          docType => !renewalData.documents[docType],
        );

        if (missingDocuments.length > 0) {
          const firstMissing = missingDocuments[0];
          form.setFocus(`documents.${firstMissing}` as any);

          toast({
            title: 'Missing Documents',
            description: 'Please upload all required documents',
            variant: 'destructive',
          });
          return;
        }

        // Send completion email
        try {
          await axios.post('/api/renewal/send', {
            renewal: renewalData,
            recipientEmail: userDetails?.email,
          });

          toast({
            title: 'Success',
            description:
              'All documents uploaded successfully. A confirmation email has been sent to your email address.',
          });
          router.push(`/applicant/passport-renewal/${renewalId}`);
        } catch (error) {
          console.error('Failed to send completion email:', error);
          toast({
            title: 'Success',
            description:
              'Your passport renewal request is complete, but we could not send the confirmation email.',
          });
          router.push(`/applicant/passport-renewal/${renewalId}`);
        }
        return;
      } catch (error) {
        console.error('Document validation failed:', error);
        toast({
          title: 'Error',
          description: 'Failed to validate documents. Please try again.',
          variant: 'destructive',
        });
        return;
      }
    }

    if (activeStepIndex < STEPS.length - 1 && !renewalId) {
      goToNextStep();
      return;
    }

    if (!renewalId) {
      try {
        const formattedDOB = format(new Date(data.dateOfBirth), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        const formattedExpiry = format(
          new Date(data.currentPassportExpiryDate),
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
        );

        createRenewalRequest(
          {
            ...data,
            dateOfBirth: formattedDOB,
            currentPassportExpiryDate: formattedExpiry,
          },
          {
            onSuccess: response => {
              setRenewalId(response._id);
              toast({
                title: 'Success',
                description:
                  'Passport renewal request created. Please upload the required documents.',
              });
              goToStep('Documents');
            },
            onError: (error: Error) => {
              toast({
                title: 'Error',
                description: `Failed to create renewal request. ${error.message}`,
                variant: 'destructive',
              });
            },
          },
        );
      } catch (error) {
        console.error('Error formatting dates:', error);
        toast({
          title: 'Error',
          description: 'Failed to format dates properly. Please check your date inputs.',
          variant: 'destructive',
        });
      }
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 'Personal Information') {
      const personalInfoFields = [
        'fullName',
        'dateOfBirth',
        'nicNumber',
        'address',
        'contactNumber',
        'email',
      ];
      const hasErrors = personalInfoFields.some(
        field => !!form.formState.errors[field as keyof PassportRenewalFormValues],
      );
      const isEmpty = personalInfoFields.some(
        field => !form.getValues(field as keyof PassportRenewalFormValues),
      );
      return hasErrors || isEmpty;
    } else if (activeStep === 'Passport Details') {
      return (
        !form.getValues('currentPassportNumber') ||
        !form.getValues('currentPassportExpiryDate') ||
        !!form.formState.errors.currentPassportNumber ||
        !!form.formState.errors.currentPassportExpiryDate
      );
    } else if (activeStep === 'Documents' && !renewalId) {
      return isCreating;
    }
    return false;
  };

  const showDocumentsTab = activeStep === 'Documents';
  const isFormSubmitted = !!renewalId;

  return (
    <div className='w-full max-w-3xl mx-auto'>
      <Tabs value={activeStep} className='w-full'>
        <TabsList className='grid grid-cols-3 mb-8'>
          {STEPS.map(step => (
            <TabsTrigger
              key={step}
              value={step}
              onClick={() => {
                if (STEPS.indexOf(step) <= Math.max(activeStepIndex, isFormSubmitted ? 2 : 1)) {
                  goToStep(step);
                }
              }}
              disabled={STEPS.indexOf(step) > Math.max(activeStepIndex, isFormSubmitted ? 2 : 1)}
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              {step}
            </TabsTrigger>
          ))}
        </TabsList>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, errors => {
              toast({
                title: 'Validation Error',
                description: 'Please check the form for errors',
                variant: 'destructive',
              });
            })}
            className='space-y-6'
          >
            <TabsContent value='Personal Information' className='space-y-6'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={date => {
                              field.onChange(date ? date.toISOString() : '');
                            }}
                            disabled={date => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            captionLayout='buttons'
                            defaultMonth={field.value ? new Date(field.value) : new Date(2000, 0)}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='nicNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC Number</FormLabel>
                      <FormControl>
                        <Input placeholder='123456789V' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter your permanent address'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='contactNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder='+94XXXXXXXXX' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='john.doe@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value='Passport Details' className='space-y-6'>
              <FormField
                control={form.control}
                name='currentPassportNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Passport Number</FormLabel>
                    <FormControl>
                      <Input placeholder='NP1234567' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='currentPassportExpiryDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Current Passport Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={date => {
                            field.onChange(date ? date.toISOString() : '');
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value='Documents' className='space-y-6'>
              {isFormSubmitted ? (
                <div className='space-y-6'>
                  <div className='rounded-md bg-green-50 p-4 border border-green-200'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <CheckCircle2 className='h-5 w-5 text-green-400' />
                      </div>
                      <div className='ml-3'>
                        <h3 className='text-sm font-medium text-green-800'>
                          Renewal Request Created
                        </h3>
                        <div className='mt-2 text-sm text-green-700'>
                          <p>
                            Your passport renewal request has been created. Please upload the
                            required documents below.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name={`documents.${PassportDocumentType.CURRENT_PASSPORT}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Passport Scan</FormLabel>
                          <FormControl>
                            <DocumentUploader
                              label='Upload your current passport'
                              value={field.value}
                              onChange={field.onChange}
                              onFileSelect={file =>
                                handleFileSelect(PassportDocumentType.CURRENT_PASSPORT, file)
                              }
                              accept='image/png,image/jpeg,image/jpg,application/pdf'
                              isLoading={
                                uploadStep === PassportDocumentType.CURRENT_PASSPORT && isUploading
                              }
                              error={
                                form.formState.errors.documents?.[
                                  PassportDocumentType.CURRENT_PASSPORT
                                ]?.message
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`documents.${PassportDocumentType.NIC_FRONT}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIC Front Scan</FormLabel>
                          <FormControl>
                            <DocumentUploader
                              label='Upload front of your NIC'
                              value={field.value}
                              onChange={field.onChange}
                              onFileSelect={file =>
                                handleFileSelect(PassportDocumentType.NIC_FRONT, file)
                              }
                              accept='image/png,image/jpeg,image/jpg,application/pdf'
                              isLoading={
                                uploadStep === PassportDocumentType.NIC_FRONT && isUploading
                              }
                              error={
                                form.formState.errors.documents?.[PassportDocumentType.NIC_FRONT]
                                  ?.message
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`documents.${PassportDocumentType.NIC_BACK}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIC Back Scan</FormLabel>
                          <FormControl>
                            <DocumentUploader
                              label='Upload back of your NIC'
                              value={field.value}
                              onChange={field.onChange}
                              onFileSelect={file =>
                                handleFileSelect(PassportDocumentType.NIC_BACK, file)
                              }
                              accept='image/png,image/jpeg,image/jpg,application/pdf'
                              isLoading={
                                uploadStep === PassportDocumentType.NIC_BACK && isUploading
                              }
                              error={
                                form.formState.errors.documents?.[PassportDocumentType.NIC_BACK]
                                  ?.message
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`documents.${PassportDocumentType.BIRTH_CERT}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Certificate</FormLabel>
                          <FormControl>
                            <DocumentUploader
                              label='Upload your birth certificate'
                              value={field.value}
                              onChange={field.onChange}
                              onFileSelect={file =>
                                handleFileSelect(PassportDocumentType.BIRTH_CERT, file)
                              }
                              accept='image/png,image/jpeg,image/jpg,application/pdf'
                              isLoading={
                                uploadStep === PassportDocumentType.BIRTH_CERT && isUploading
                              }
                              error={
                                form.formState.errors.documents?.[PassportDocumentType.BIRTH_CERT]
                                  ?.message
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`documents.${PassportDocumentType.PHOTO}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo</FormLabel>
                          <FormControl>
                            <DocumentUploader
                              label='Upload your photo'
                              value={field.value}
                              onChange={field.onChange}
                              onFileSelect={file =>
                                handleFileSelect(PassportDocumentType.PHOTO, file)
                              }
                              accept='image/png,image/jpeg,image/jpg'
                              isLoading={uploadStep === PassportDocumentType.PHOTO && isUploading}
                              error={
                                form.formState.errors.documents?.[PassportDocumentType.PHOTO]
                                  ?.message
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`documents.${PassportDocumentType.ADDITIONAL_DOCS}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Documents</FormLabel>
                          <FormControl>
                            <DocumentUploader
                              label='Upload additional documents'
                              value={field.value}
                              onChange={field.onChange}
                              onFileSelect={file =>
                                handleFileSelect(PassportDocumentType.ADDITIONAL_DOCS, file)
                              }
                              accept='image/png,image/jpeg,image/jpg,application/pdf'
                              isLoading={
                                uploadStep === PassportDocumentType.ADDITIONAL_DOCS && isUploading
                              }
                              error={
                                form.formState.errors.documents?.[
                                  PassportDocumentType.ADDITIONAL_DOCS
                                ]?.message
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div className='text-center space-y-4 py-8'>
                  <h3 className='text-lg font-medium'>Submit Application First</h3>
                  <p className='text-muted-foreground'>
                    Please complete and submit your application details before uploading documents.
                  </p>
                </div>
              )}
            </TabsContent>

            <div className='flex justify-between mt-8 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={goToPreviousStep}
                disabled={activeStepIndex === 0}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Previous
              </Button>

              <Button
                type='submit'
                disabled={isNextDisabled() || isCreating || isUploading || isSendingEmail}
              >
                {isCreating || isUploading || isSendingEmail ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {isCreating ? 'Creating...' : isUploading ? 'Uploading...' : 'Sending Email...'}
                  </>
                ) : activeStep === 'Documents' && renewalId ? (
                  'Complete Application'
                ) : activeStep === 'Passport Details' && !renewalId ? (
                  'Submit Application'
                ) : activeStepIndex === STEPS.length - 1 ? (
                  'Submit Application'
                ) : (
                  <>
                    Next
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
