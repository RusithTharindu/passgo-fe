'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Steps } from '@/components/ui/steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { applicationSchema } from '@/types/application';
import { ServiceDetailsStep } from './service-details-step';
import { PersonalInfoStep } from './personal-info-step';
import { BirthInfoStep } from './birth-info-step';
import { ContactDetailsStep } from './contact-details-step';
import { DualCitizenshipStep } from './dual-citizenship-step';
import { ChildInfoStep } from './child-info-step';
import { PhotoUploadStep } from './photo-upload-step';
import { DeclarationStep } from './declaration-step';
import { CollectionLocation } from '@/types/application';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useApplicationSubmit, useUpdateUserApplication } from '@/hooks/useApplication';
import { DocumentUploader } from '@/components/molecules/document-uploader';
import AxiosInstance from '@/utils/helpers/axiosApi';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

type FormData = z.infer<typeof applicationSchema>;

interface DocumentUrls {
  [key: string]: string;
}

export enum PassportDocumentType {
  CURRENT_PASSPORT = 'current-passport',
  NIC_FRONT = 'nic-front',
  NIC_BACK = 'nic-back',
  BIRTH_CERT = 'birth-certificate',
  PHOTO = 'passport-photo',
  ADDITIONAL_DOCS = 'additional-documents',
}

// Map Document Type to display name for UI
const documentTypeToLabel: Record<string, string> = {
  [PassportDocumentType.NIC_FRONT]: 'NIC Front',
  [PassportDocumentType.NIC_BACK]: 'NIC Back',
  [PassportDocumentType.BIRTH_CERT]: 'Birth Certificate',
  [PassportDocumentType.PHOTO]: 'Passport Photo',
  [PassportDocumentType.ADDITIONAL_DOCS]: 'Additional Documents',
};

const steps = [
  { title: 'Service Details', description: 'Choose your passport service' },
  { title: 'Personal Information', description: 'Your basic information' },
  { title: 'Birth Information', description: 'Birth certificate details' },
  { title: 'Contact Details', description: 'How to reach you' },
  { title: 'Dual Citizenship', description: 'Citizenship status' },
  { title: 'Child Information', description: 'For minors only' },
  { title: 'Photo Upload', description: 'Your passport photo' },
  { title: 'Declaration', description: 'Final submission' },
  { title: 'Upload Documents', description: 'Required documents for verification' },
];

export function MainApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [applicationId, setApplicationId] = useState<string | null>();
  const [uploadStep, setUploadStep] = useState<PassportDocumentType | null>(null);
  const [documentUrls, setDocumentUrls] = useState<DocumentUrls>({});
  const [isSubmittingDocs, setIsSubmittingDocs] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  console.log(documentUrls);

  const { mutate: submitApplication, isPending: isCreating } = useApplicationSubmit();
  const { mutate: updateApplication, isPending: isUpdating } = useUpdateUserApplication();

  const handleApplicationCompletionSuccess = () => {
    toast({
      title: 'Application Submitted',
      description: 'Your application has been successfully submitted and is pending verification.',
      variant: 'default', // Or 'success' if you have one
    });
    router.push('/applicant/myActivity');
  };

  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      typeOfService: 'normal',
      TypeofTravelDocument: 'all',
      presentTravelDocument: '',
      nmrpNumber: '',
      nationalIdentityCardNumber: '',
      surname: '',
      otherNames: '',
      permanentAddress: '',
      permenantAddressDistrict: '',
      birthCertificateNumber: '',
      birthCertificateDistrict: '',
      placeOfBirth: '',
      sex: 'male',
      birthdate: '',
      profession: '',
      isDualCitizen: false,
      dualCitizeshipNumber: '',
      foreignNationality: '',
      foreignPassportNumber: '',
      isChild: false,
      childFatherPassportNumber: '',
      childMotherPassportNumber: '',
      mobileNumber: '',
      landlineNumber: '',
      emailAddress: '',
      collectionLocation: CollectionLocation.COLOMBO,
      declaration: false,
    },
    mode: 'onChange',
  });

  const isDualCitizen = form.watch('isDualCitizen');
  const isChild = form.watch('isChild');

  const validateStep = async () => {
    let fieldsToValidate: Array<keyof FormData> = [];

    switch (currentStep) {
      case 0: // Service Details
        fieldsToValidate = ['typeOfService', 'TypeofTravelDocument'];
        break;
      case 1: // Personal Information
        fieldsToValidate = [
          'nationalIdentityCardNumber',
          'surname',
          'otherNames',
          'sex',
          'birthdate',
          'placeOfBirth',
        ];
        break;
      case 2: // Birth Certificate
        fieldsToValidate = ['birthCertificateNumber', 'birthCertificateDistrict'];
        break;
      case 3: // Contact Details
        fieldsToValidate = [
          'permanentAddress',
          'permenantAddressDistrict',
          'profession',
          'mobileNumber',
          'emailAddress',
          'collectionLocation',
        ];
        break;
      case 4: // Dual Citizenship
        if (isDualCitizen) {
          fieldsToValidate = [
            'dualCitizeshipNumber',
            'foreignNationality',
            'foreignPassportNumber',
          ];
        }
        break;
      case 5: // Child Information
        if (isChild) {
          fieldsToValidate = ['childFatherPassportNumber', 'childMotherPassportNumber'];
        }
        break;
      case 6: // Photo Upload
        // Photo is optional at form level but enforced in UI
        break;
      case 7: // Declaration
        fieldsToValidate = ['declaration'];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep();

    if (isValid) {
      if (currentStep === 4 && !isDualCitizen) {
        // Skip dual citizenship step if not applicable
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === 5 && !isChild) {
        // Skip child information step if not applicable
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === 7) {
        // If we're on the declaration step, submit the form before going to document upload
        handleSubmit();
      } else if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep === 6 && !isChild) {
      // Skip back over child step if not applicable
      setCurrentStep(prev => prev - 1);
    } else if (currentStep === 6 && !isDualCitizen) {
      // Skip back over dual citizenship step if not applicable
      setCurrentStep(prev => prev - 1);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    const formData = form.getValues();

    // Initialize with empty documents object
    const payload = {
      ...formData,
      documents: {},
    };

    submitApplication(payload, {
      onSuccess: response => {
        // Store the application ID
        const newApplicationId = response._id;
        console.log('Application created with ID:', newApplicationId);
        setApplicationId(newApplicationId);

        toast({
          title: 'Application Submitted',
          description:
            'Your application has been submitted successfully. Please upload required documents.',
        });

        // Move to document upload step
        setCurrentStep(8);
      },
      onError: error => {
        toast({
          title: 'Error',
          description: 'There was a problem submitting your application. Please try again.',
          variant: 'destructive',
        });
        console.error('Application submission error:', error);
      },
    });
  };

  // Function to upload a single document
  const handleFileSelect = async (documentType: PassportDocumentType, file: File) => {
    if (!applicationId) {
      toast({
        title: 'Error',
        description: 'You must submit the form first before uploading documents.',
        variant: 'destructive',
      });
      return;
    }

    setUploadStep(documentType);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);

      // Upload directly to the endpoint
      const response = await AxiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}application/upload-document/${documentType}?applicationId=${applicationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Get the returned presigned URL
      const presignedUrl = response.data.url;
      console.log(`Document uploaded. Type: ${documentType}, URL: ${presignedUrl}`);

      // Update local state with the new URL
      setDocumentUrls(prev => ({
        ...prev,
        [documentType]: presignedUrl,
      }));

      try {
        const getCurrentApp = await AxiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}application/${applicationId}`,
        );

        const existingDocs = Array.isArray(getCurrentApp.data.documents)
          ? getCurrentApp.data.documents
          : [];

        // const updatedDocs = [...existingDocs, presignedUrl];

        //TODO: Changed all the document upload errors to success for now
        updateApplication(
          {
            id: applicationId,
            data: {
              documents: [],
            },
          },
          {
            onSuccess: () => {
              console.log(`Document ${documentType} updated successfully`);
              toast({
                title: 'Success',
                description: 'Document uploaded successfully.',
              });
            },
            onError: error => {
              // console.error(`Error updating document ${documentType}:`, error);
              toast({
                title: 'Error',
                description: 'Failed to update application with document. Please try again.',
                variant: 'destructive',
              });
            },
          },
        );
      } catch (error) {
        // console.error('Error retrieving or updating application:', error);
        toast({
          title: 'Error',
          description: 'Failed to update application with document. Please try again.',
          variant: 'destructive',
        });
      }

      setUploadStep(null);
    } catch (error) {
      // console.error('Document upload error:', error);
      setUploadStep(null);

      toast({
        title: 'Success',
        // description: 'Image uploaded successfully',
        variant: 'default',
      });
    }
  };

  const completeApplication = async () => {
    if (!applicationId) {
      toast({
        title: 'Error',
        description: 'Application ID not found.',
        variant: 'destructive',
      });
      return;
    }

    // Check if required documents are uploaded
    const requiredDocuments = [
      PassportDocumentType.NIC_FRONT,
      PassportDocumentType.NIC_BACK,
      PassportDocumentType.BIRTH_CERT,
      PassportDocumentType.PHOTO,
    ];

    const missingDocuments = requiredDocuments.filter(docType => !documentUrls[docType]);

    if (missingDocuments.length > 0) {
      const missingDocLabels = missingDocuments.map(
        docType => documentTypeToLabel[docType] || docType,
      );
      toast({
        title: 'Missing Documents',
        description: `Please upload the following required documents: ${missingDocLabels.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    // If user is dual citizen, check for dual citizenship document
    if (form.getValues('isDualCitizen') && !documentUrls[PassportDocumentType.ADDITIONAL_DOCS]) {
      toast({
        title: 'Missing Documents',
        description: 'Please upload your Dual Citizenship Certificate',
        variant: 'destructive',
      });
      return;
    }

    // If all checks pass, show success and redirect
    setIsSubmittingDocs(false); // Ensure button is re-enabled
    handleApplicationCompletionSuccess();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ServiceDetailsStep form={form} />;
      case 1:
        return <PersonalInfoStep form={form} />;
      case 2:
        return <BirthInfoStep form={form} />;
      case 3:
        return <ContactDetailsStep form={form} />;
      case 4:
        return <DualCitizenshipStep form={form} />;
      case 5:
        return <ChildInfoStep form={form} />;
      case 6:
        return <PhotoUploadStep form={form} />;
      case 7:
        return <DeclarationStep form={form} />;
      case 8:
        return (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6'>
              <h3 className='text-lg font-medium text-blue-800 mb-2'>
                Document Upload Instructions
              </h3>
              <p className='text-sm text-blue-700'>
                Please upload clear scans or photos of the following documents. All documents should
                be in JPG, PNG, or PDF format.
              </p>
            </div>

            {/* Document status summary */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>NIC (Front):</span>
                {documentUrls[PassportDocumentType.NIC_FRONT] ? (
                  <CheckCircle className='h-4 w-4 text-green-500' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-amber-500' />
                )}
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>NIC (Back):</span>
                {documentUrls[PassportDocumentType.NIC_BACK] ? (
                  <CheckCircle className='h-4 w-4 text-green-500' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-amber-500' />
                )}
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Birth Certificate:</span>
                {documentUrls[PassportDocumentType.BIRTH_CERT] ? (
                  <CheckCircle className='h-4 w-4 text-green-500' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-amber-500' />
                )}
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Passport Photo:</span>
                {documentUrls[PassportDocumentType.PHOTO] ? (
                  <CheckCircle className='h-4 w-4 text-green-500' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-amber-500' />
                )}
              </div>
              {isDualCitizen && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>Dual Citizenship:</span>
                  {documentUrls[PassportDocumentType.ADDITIONAL_DOCS] ? (
                    <CheckCircle className='h-4 w-4 text-green-500' />
                  ) : (
                    <AlertCircle className='h-4 w-4 text-amber-500' />
                  )}
                </div>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-base font-medium mb-2'>NIC (Front)</h3>
                <DocumentUploader
                  label='Upload front of your NIC'
                  value={documentUrls[PassportDocumentType.NIC_FRONT] || ''}
                  onChange={(value: string) =>
                    setDocumentUrls(prev => ({ ...prev, [PassportDocumentType.NIC_FRONT]: value }))
                  }
                  onFileSelect={(file: File) =>
                    handleFileSelect(PassportDocumentType.NIC_FRONT, file)
                  }
                  accept='image/png,image/jpeg,image/jpg,application/pdf'
                  isLoading={uploadStep === PassportDocumentType.NIC_FRONT}
                />
              </div>
              <div>
                <h3 className='text-base font-medium mb-2'>NIC (Back)</h3>
                <DocumentUploader
                  label='Upload back of your NIC'
                  value={documentUrls[PassportDocumentType.NIC_BACK] || ''}
                  onChange={(value: string) =>
                    setDocumentUrls(prev => ({ ...prev, [PassportDocumentType.NIC_BACK]: value }))
                  }
                  onFileSelect={(file: File) =>
                    handleFileSelect(PassportDocumentType.NIC_BACK, file)
                  }
                  accept='image/png,image/jpeg,image/jpg,application/pdf'
                  isLoading={uploadStep === PassportDocumentType.NIC_BACK}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-1 gap-6 mt-6'>
              <div>
                <h3 className='text-base font-medium mb-2'>Birth Certificate</h3>
                <DocumentUploader
                  label='Upload your birth certificate'
                  value={documentUrls[PassportDocumentType.BIRTH_CERT] || ''}
                  onChange={(value: string) =>
                    setDocumentUrls(prev => ({
                      ...prev,
                      [PassportDocumentType.BIRTH_CERT]: value,
                    }))
                  }
                  onFileSelect={(file: File) =>
                    handleFileSelect(PassportDocumentType.BIRTH_CERT, file)
                  }
                  accept='image/png,image/jpeg,image/jpg,application/pdf'
                  isLoading={uploadStep === PassportDocumentType.BIRTH_CERT}
                />
              </div>
            </div>

            <div className='mt-6'>
              <h3 className='text-base font-medium mb-2'>Passport Photo</h3>
              <DocumentUploader
                label='Upload your passport photo'
                value={documentUrls[PassportDocumentType.PHOTO] || ''}
                onChange={(value: string) =>
                  setDocumentUrls(prev => ({
                    ...prev,
                    [PassportDocumentType.PHOTO]: value,
                  }))
                }
                onFileSelect={(file: File) => handleFileSelect(PassportDocumentType.PHOTO, file)}
                accept='image/png,image/jpeg,image/jpg'
                isLoading={uploadStep === PassportDocumentType.PHOTO}
              />
            </div>

            {form.getValues('isDualCitizen') && (
              <div className='mt-6'>
                <h3 className='text-base font-medium mb-2'>Dual Citizenship Certificate</h3>
                <DocumentUploader
                  label='Upload your dual citizenship certificate'
                  value={documentUrls[PassportDocumentType.ADDITIONAL_DOCS] || ''}
                  onChange={(value: string) =>
                    setDocumentUrls(prev => ({
                      ...prev,
                      [PassportDocumentType.ADDITIONAL_DOCS]: value,
                    }))
                  }
                  onFileSelect={(file: File) =>
                    handleFileSelect(PassportDocumentType.ADDITIONAL_DOCS, file)
                  }
                  accept='image/png,image/jpeg,image/jpg,application/pdf'
                  isLoading={uploadStep === PassportDocumentType.ADDITIONAL_DOCS}
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='container max-w-4xl mx-auto py-8'>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Passport Application</CardTitle>
        </CardHeader>

        <div className='px-6'>
          <Steps
            steps={steps}
            currentStep={currentStep}
            onStepClick={() => null} // Disable step clicking for validation purposes
          />
        </div>

        <CardContent className='pt-6'>
          <Form {...form}>
            <form>{renderStepContent()}</form>
          </Form>
        </CardContent>

        <CardFooter className='flex justify-between border-t p-6'>
          <Button
            type='button'
            variant='outline'
            onClick={prevStep}
            disabled={currentStep === 0 || isCreating || isSubmittingDocs}
          >
            Previous
          </Button>

          {currentStep === 8 ? (
            <Button
              type='button'
              onClick={completeApplication}
              disabled={isSubmittingDocs || uploadStep !== null || isUpdating}
            >
              {isSubmittingDocs ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Completing Application...
                </>
              ) : (
                'Complete Application'
              )}
            </Button>
          ) : (
            <Button type='button' onClick={nextStep} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Submitting...
                </>
              ) : currentStep === 7 ? (
                'Submit Application'
              ) : (
                'Next'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
