import React from 'react';
import { Metadata } from 'next';
import HeaderNavigation from '@/components/layout/applicant/HeaderNavigation';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Applicant Portal',
  description: 'Portal for job applicants',
};

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='applicant-layout'>
      <HeaderNavigation />

      <main className='flex-grow py-6 applicant-main'>
        <Container>{children}</Container>
      </main>

      <footer className='py-6 bg-white border-t'>
        <Container>
          <div className='text-center text-sm text-gray-500'>
            <p>&copy; {new Date().getFullYear()} PassGo. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
