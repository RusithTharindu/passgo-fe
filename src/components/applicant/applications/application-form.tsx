'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema } from '@/types/application';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Steps } from '@/components/ui/steps';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { applicationApi } from '@/api/application';
import { CollectionLocation, DocumentType } from '@/types/application';
import { DocumentUpload } from './document-upload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { z } from 'zod';

type FormData = z.infer<typeof applicationSchema>;

const steps = [
  { title: 'Service Details', description: 'Type of service and document' },
  { title: 'Personal Information', description: 'Your personal details' },
  { title: 'Contact Details', description: 'How to reach you' },
  { title: 'Document Upload', description: 'Required documents' },
];

export function ApplicationForm() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();
  const { formStep, setFormStep, isDocumentUploadComplete, setDocumentUploadComplete } =
    useApplicationStore();
  const [uploadedDocuments, setUploadedDocuments] = useState({
    [DocumentType.NIC_FRONT]: '',
    [DocumentType.NIC_BACK]: '',
    [DocumentType.BIRTH_CERT_FRONT]: '',
    [DocumentType.BIRTH_CERT_BACK]: '',
    [DocumentType.USER_PHOTO]: '',
  });

  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      typeOfService: 'normal',
      TypeofTravelDocument: 'all',
      isDualCitizen: false,
      isChild: false,
    },
  });

  const { mutate: createApplication, isPending } = useMutation({
    mutationFn: applicationApi.create,
    onSuccess: data => {
      setApplicationId(data.id);
      setShowSuccessDialog(true);
      toast({
        title: 'Application submitted successfully',
        description: 'You can track your application status using the application ID.',
      });
    },
    onError: () => {
      toast({
        title: 'Error submitting application',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!isDocumentUploadComplete) {
      toast({
        title: 'Document upload incomplete',
        description: 'Please upload all required documents before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // Add document URLs to the form data
    const formData = {
      ...data,
      nicPhotos: {
        front: uploadedDocuments[DocumentType.NIC_FRONT],
        back: uploadedDocuments[DocumentType.NIC_BACK],
      },
      birthCertificatePhotos: {
        front: uploadedDocuments[DocumentType.BIRTH_CERT_FRONT],
        back: uploadedDocuments[DocumentType.BIRTH_CERT_BACK],
      },
      userPhoto: uploadedDocuments[DocumentType.USER_PHOTO],
      studioPhotoUrl: uploadedDocuments[DocumentType.USER_PHOTO],
    };

    createApplication(formData);
  };

  const nextStep = () => {
    const fields = getFieldsForStep(formStep) as Array<keyof FormData>;
    form.trigger(fields).then(isValid => {
      if (isValid) setFormStep(formStep + 1);
    });
  };

  // Handle document upload completion
  const handleDocumentUpload = (documentType: DocumentType, url: string) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: url,
    }));

    // Check if all required documents are uploaded
    const updatedDocuments = {
      ...uploadedDocuments,
      [documentType]: url,
    };

    const allDocumentsUploaded =
      !!updatedDocuments[DocumentType.NIC_FRONT] &&
      !!updatedDocuments[DocumentType.NIC_BACK] &&
      !!updatedDocuments[DocumentType.BIRTH_CERT_FRONT] &&
      !!updatedDocuments[DocumentType.BIRTH_CERT_BACK] &&
      !!updatedDocuments[DocumentType.USER_PHOTO];

    setDocumentUploadComplete(allDocumentsUploaded);
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <Steps
        steps={steps}
        currentStep={formStep}
        onStepClick={step => {
          const fields = getFieldsForStep(formStep) as Array<keyof FormData>;
          form.trigger(fields).then(isValid => {
            if (isValid || step < formStep) setFormStep(step);
          });
        }}
      />

      <Card className='mt-8'>
        <CardContent className='pt-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {formStep === 1 && <ServiceDetailsStep form={form} />}
              {formStep === 2 && <PersonalInfoStep form={form} />}
              {formStep === 3 && <ContactDetailsStep form={form} />}
              {formStep === 4 && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold mb-4'>Required Documents</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <h3 className='text-base font-medium mb-2'>NIC (Front)</h3>
                      <DocumentUpload
                        documentType={DocumentType.NIC_FRONT}
                        onUploadComplete={url => handleDocumentUpload(DocumentType.NIC_FRONT, url)}
                      />
                    </div>
                    <div>
                      <h3 className='text-base font-medium mb-2'>NIC (Back)</h3>
                      <DocumentUpload
                        documentType={DocumentType.NIC_BACK}
                        onUploadComplete={url => handleDocumentUpload(DocumentType.NIC_BACK, url)}
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div>
                      <h3 className='text-base font-medium mb-2'>Birth Certificate (Front)</h3>
                      <DocumentUpload
                        documentType={DocumentType.BIRTH_CERT_FRONT}
                        onUploadComplete={url =>
                          handleDocumentUpload(DocumentType.BIRTH_CERT_FRONT, url)
                        }
                      />
                    </div>
                    <div>
                      <h3 className='text-base font-medium mb-2'>Birth Certificate (Back)</h3>
                      <DocumentUpload
                        documentType={DocumentType.BIRTH_CERT_BACK}
                        onUploadComplete={url =>
                          handleDocumentUpload(DocumentType.BIRTH_CERT_BACK, url)
                        }
                      />
                    </div>
                  </div>
                  <div className='mt-6'>
                    <h3 className='text-base font-medium mb-2'>Passport Photo</h3>
                    <DocumentUpload
                      documentType={DocumentType.USER_PHOTO}
                      onUploadComplete={url => handleDocumentUpload(DocumentType.USER_PHOTO, url)}
                    />
                  </div>
                </div>
              )}

              <div className='flex justify-between pt-4'>
                {formStep > 1 && (
                  <Button type='button' variant='outline' onClick={() => setFormStep(formStep - 1)}>
                    Previous
                  </Button>
                )}
                {formStep < steps.length ? (
                  <Button type='button' onClick={nextStep} className='ml-auto'>
                    Next
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    disabled={isPending || !isDocumentUploadComplete}
                    className='ml-auto'
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Submitted Successfully</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>Your application has been submitted successfully.</p>
            <p>
              Application ID: <span className='font-mono font-bold'>{applicationId}</span>
            </p>
            <p className='text-sm text-muted-foreground'>
              Please save this ID for future reference. You can track your application status using
              this ID.
            </p>
            <div className='flex justify-end space-x-4'>
              <Button variant='outline' onClick={() => router.push('/applicant/applications')}>
                View All Applications
              </Button>
              <Button onClick={() => router.push(`/applicant/applications/${applicationId}`)}>
                View Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceDetailsStep({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name='typeOfService'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Service</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select service type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='normal'>Normal Service</SelectItem>
                <SelectItem value='oneDay'>One Day Service</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='TypeofTravelDocument'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Travel Document</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select document type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='all'>All Countries</SelectItem>
                <SelectItem value='middleEast'>Middle East</SelectItem>
                <SelectItem value='emergencyCertificate'>Emergency Certificate</SelectItem>
                <SelectItem value='identityCertificate'>Identity Certificate</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function PersonalInfoStep({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name='nationalIdentityCardNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>NIC Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='surname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='otherNames'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Names</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name='permanentAddress'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Permanent Address</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='birthdate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sex'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select sex' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='male'>Male</SelectItem>
                  <SelectItem value='female'>Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name='isDualCitizen'
        render={({ field }) => (
          <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel>Dual Citizen</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

function ContactDetailsStep({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name='mobileNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='emailAddress'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input type='email' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='collectionLocation'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Collection Location</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select collection location' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(CollectionLocation).map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function getFieldsForStep(step: number): Array<keyof FormData> {
  switch (step) {
    case 1:
      return ['typeOfService', 'TypeofTravelDocument'];
    case 2:
      return [
        'nationalIdentityCardNumber',
        'surname',
        'otherNames',
        'permanentAddress',
        'birthdate',
        'sex',
        'isDualCitizen',
      ];
    case 3:
      return ['mobileNumber', 'emailAddress', 'collectionLocation'];
    default:
      return [];
  }
}
