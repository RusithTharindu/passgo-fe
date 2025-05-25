import { Metadata } from 'next';
import { MainApplicationForm } from '@/components/applicant/applications/main-application-form';

export const metadata: Metadata = {
  title: 'New Passport Application | PassGo',
  description: 'Create a new passport application',
};

export default function NewApplicationPage() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>New Passport Application</h1>
      <MainApplicationForm />
    </div>
  );
}
