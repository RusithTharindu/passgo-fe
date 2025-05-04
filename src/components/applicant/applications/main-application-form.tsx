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
import { Loader2 } from 'lucide-react';
import { useApplicationSubmit } from '@/hooks/useApplication';

type FormData = z.infer<typeof applicationSchema>;

const steps = [
  { title: 'Service Type', description: 'Type of service' },
  { title: 'Personal Information', description: 'Your personal details' },
  { title: 'Birth Certificate', description: 'Birth certificate details' },
  { title: 'Contact Information', description: 'Your contact information' },
  { title: 'Dual Citizenship', description: 'Dual citizenship details' },
  { title: 'Child Information', description: 'Child details if applicable' },
  { title: 'Photo Upload', description: 'Upload your passport photo' },
  { title: 'Declaration', description: 'Terms and conditions' },
];

export function MainApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: submitApplication, isPending } = useApplicationSubmit();

  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      typeOfService: 'normal',
      TypeofTravelDocument: 'all',
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
        setCurrentStep(prev => prev + 2);
      } else if (currentStep === 5 && !isChild) {
        // Skip child information step if not applicable
        setCurrentStep(prev => prev + 2);
      } else if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep === 6 && !isChild) {
      // Skip back over child step if not applicable
      setCurrentStep(prev => prev - 2);
    } else if (currentStep === 6 && !isDualCitizen) {
      // Skip back over dual citizenship step if not applicable
      setCurrentStep(prev => prev - 2);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    const formData = form.getValues();

    submitApplication(formData, {
      onSuccess: data => {
        toast({
          title: 'Application Submitted',
          description: 'Your passport application has been submitted successfully.',
        });

        // Redirect to application details page
        router.push(`/applicant/applications/${data.id}`);
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: 'There was an error submitting your application. Please try again.',
        });
      },
    });
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
            disabled={currentStep === 0 || isPending}
          >
            Previous
          </Button>

          <Button type='button' onClick={nextStep} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Submitting...
              </>
            ) : currentStep === steps.length - 1 ? (
              'Submit Application'
            ) : (
              'Next'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
