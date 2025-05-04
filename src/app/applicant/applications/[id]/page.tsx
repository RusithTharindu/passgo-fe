import { Metadata } from 'next';
import { ApplicationDetails } from '@/components/applicant/applications/application-details';

export const metadata: Metadata = {
  title: 'Application Details | PassGo',
  description: 'View application details and status',
};

interface ApplicationDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  return (
    <div className='container mx-auto py-8'>
      <ApplicationDetails applicationId={params.id} />
    </div>
  );
}
