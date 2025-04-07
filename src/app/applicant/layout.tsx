import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Applicant Portal',
  description: 'Portal for job applicants',
};

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='applicant-layout'>
      {/* Optional: Add applicant-specific navigation or sidebar */}
      <main className='applicant-main'>{children}</main>
    </div>
  );
}
