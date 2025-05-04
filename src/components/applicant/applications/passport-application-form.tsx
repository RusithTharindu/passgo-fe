'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Steps } from '@/components/ui/steps';
import { useToast } from '@/hooks/use-toast';
import ServiceTypeStep from './steps/service-type-step';
import TravelDocumentStep from './steps/travel-document-step';
import PersonalInfoStep from './steps/personal-info-step';
import BirthInfoStep from './steps/birth-info-step';
import ContactInfoStep from './steps/contact-info-step';
import DualCitizenshipStep from './steps/dual-citizenship-step';
import ChildInfoStep from './steps/child-info-step';
import PhotoUploadStep from './steps/photo-upload-step';
import DeclarationStep from './steps/declaration-step';
import { useApplicationSubmit } from '@/hooks/useApplication';
import { CollectionLocation } from '@/types/application';

// Create schema for the entire form
export const applicationSchema = z.object({
  // Step 1: Service Type
  typeOfService: z.enum(['normal', 'oneDay']),
  // Step 2: Travel Document
  TypeofTravelDocument: z.enum([
    'all',
    'middleEast',
    'emergencyCertificate',
    'identityCertificate',
  ]),
  presentTravelDocument: z.string().optional(),
  nmrpNumber: z.string().optional(),
  // Step 3: Personal Information
  surname: z.string().min(1, 'Surname is required'),
  otherNames: z.string().min(1, 'Other names are required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
  permenantAddressDistrict: z.string().min(1, 'District is required'),
  nationalIdentityCardNumber: z.string().min(10).max(12),
  sex: z.enum(['male', 'female']),
  birthdate: z.string(),
  // NIC Document Uploads
  nicPhotos: z.object({
    front: z.string().optional(),
    back: z.string().optional(),
  }),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  // Step 4: Birth Certificate Details
  birthCertificateNumber: z.string().min(1, 'Birth certificate number is required'),
  birthCertificateDistrict: z.string().min(1, 'Birth certificate district is required'),
  birthCertificatePhotos: z.object({
    front: z.string().optional(),
    back: z.string().optional(),
  }),
  // Step 5: Contact Information
  profession: z.string().min(1, 'Profession is required'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  emailAddress: z.string().email('Invalid email address'),
  // Step 6: Dual Citizenship
  isDualCitizen: z.boolean().default(false),
  dualCitizeshipNumber: z.string().optional(),
  foreignNationality: z.string().optional(),
  foreignPassportNumber: z.string().optional(),
  // Step 7: Child Information
  isChild: z.boolean().default(false),
  childFatherPassportNumber: z.string().optional(),
  childMotherPassportNumber: z.string().optional(),
  // Step 8: Photo Upload
  userPhoto: z.string().optional(),
  // Step 9: Declaration
  declaration: z.boolean().default(false),
  // Additional fields needed for the application
  collectionLocation: z.nativeEnum(CollectionLocation).default(CollectionLocation.COLOMBO),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

const steps = [
  { id: 'service-type', title: 'Service Type' },
  { id: 'travel-document', title: 'Travel Document' },
  { id: 'personal-info', title: 'Personal Information' },
  { id: 'birth-info', title: 'Birth Information' },
  { id: 'contact-info', title: 'Contact Information' },
  { id: 'dual-citizenship', title: 'Dual Citizenship' },
  { id: 'child-info', title: 'Child Information' },
  { id: 'photo-upload', title: 'Photo Upload' },
  { id: 'declaration', title: 'Declaration' },
];

export default function PassportApplicationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: submitApplication, isPending } = useApplicationSubmit();

  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      typeOfService: 'normal',
      TypeofTravelDocument: 'all',
      presentTravelDocument: '',
      nmrpNumber: '',
      surname: '',
      otherNames: '',
      permanentAddress: '',
      permenantAddressDistrict: '',
      nationalIdentityCardNumber: '',
      sex: 'male',
      birthdate: '',
      placeOfBirth: '',
      birthCertificateNumber: '',
      birthCertificateDistrict: '',
      profession: '',
      mobileNumber: '',
      emailAddress: '',
      isDualCitizen: false,
      isChild: false,
      nicPhotos: {
        front: '',
        back: '',
      },
      birthCertificatePhotos: {
        front: '',
        back: '',
      },
      declaration: false,
      collectionLocation: CollectionLocation.COLOMBO,
    },
    mode: 'onChange',
  });

  const { trigger, getValues, watch } = methods;

  // Watch the isDualCitizen and isChild fields to conditionally enable/disable steps
  const isDualCitizen = watch('isDualCitizen');
  const isChild = watch('isChild');

  const validateStep = async () => {
    let fieldsToValidate: Array<keyof ApplicationFormData> = [];

    switch (currentStep) {
      case 0: // Service Type
        fieldsToValidate = ['typeOfService'];
        break;
      case 1: // Travel Document
        fieldsToValidate = ['TypeofTravelDocument'];
        break;
      case 2: // Personal Information
        fieldsToValidate = [
          'surname',
          'otherNames',
          'permanentAddress',
          'permenantAddressDistrict',
          'nationalIdentityCardNumber',
          'sex',
          'birthdate',
          'placeOfBirth',
        ];
        break;
      case 3: // Birth Certificate
        fieldsToValidate = ['birthCertificateNumber', 'birthCertificateDistrict'];
        break;
      case 4: // Contact Info
        fieldsToValidate = ['profession', 'mobileNumber', 'emailAddress'];
        break;
      case 5: // Dual Citizenship
        if (isDualCitizen) {
          fieldsToValidate = [
            'dualCitizeshipNumber',
            'foreignNationality',
            'foreignPassportNumber',
          ];
        }
        break;
      case 6: // Child Information
        if (isChild) {
          fieldsToValidate = ['childFatherPassportNumber', 'childMotherPassportNumber'];
        }
        break;
      case 7: // Photo Upload
        // No validation for photo upload as it's optional at form level
        // but we might want to enforce it in the UI
        break;
      case 8: // Declaration
        fieldsToValidate = ['declaration'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep();

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        // Form is complete, submit the application
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    const formData = getValues();
    setIsSubmitting(true);

    // Submit application data
    submitApplication(formData, {
      onSuccess: data => {
        setIsSubmitting(false);
        toast({
          title: 'Application Submitted Successfully',
          description: 'Your passport application has been submitted.',
        });
        // Redirect to application status page or confirmation page
        router.push(`/applicant/applications/${data._id}`);
      },
      onError: error => {
        setIsSubmitting(false);
        toast({
          title: 'Error Submitting Application',
          description: error.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ServiceTypeStep />;
      case 1:
        return <TravelDocumentStep />;
      case 2:
        return <PersonalInfoStep />;
      case 3:
        return <BirthInfoStep />;
      case 4:
        return <ContactInfoStep />;
      case 5:
        return <DualCitizenshipStep />;
      case 6:
        return <ChildInfoStep />;
      case 7:
        return <PhotoUploadStep />;
      case 8:
        return <DeclarationStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className='container max-w-5xl mx-auto py-8'>
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl'>Passport Application</CardTitle>
            <CardDescription>
              Complete all the required information to submit your passport application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-8'>
              <Steps
                steps={steps}
                currentStep={currentStep}
                onStepClick={() => null} // Disable step clicking for now
              />
            </div>

            <div className='mt-8'>{renderStep()}</div>
          </CardContent>
          <CardFooter className='flex justify-between border-t p-6'>
            <Button
              variant='outline'
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
            >
              Previous
            </Button>
            <Button onClick={nextStep} disabled={isSubmitting || isPending}>
              {isPending || isSubmitting
                ? 'Processing...'
                : currentStep === steps.length - 1
                  ? 'Submit Application'
                  : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </FormProvider>
  );
}
