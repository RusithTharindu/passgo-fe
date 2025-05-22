import { Metadata } from 'next';
import { ApplicationDashboard } from '@/components/applicant/applications/application-dashboard';

export const metadata: Metadata = {
  title: 'Applications | PassGo',
  description: 'View and manage your passport applications',
};

export default function ApplicationsPage() {
  return <ApplicationDashboard />;
}
