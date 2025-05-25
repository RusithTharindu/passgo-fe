'use client';

import { Container } from '@/components/ui/container';
import { PassportRenewalForm } from '@/components/forms/passport-renewal-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewPassportRenewalPage() {
  return (
    <Container>
      <div className='py-8 space-y-6'>
        <div className='flex items-center mb-6'>
          <Button variant='outline' asChild className='mr-6'>
            <Link href='/applicant/passport-renewal'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Renewals
            </Link>
          </Button>
          <h1 className='text-2xl font-bold'>New Passport Renewal Request</h1>
        </div>

        <div className='bg-white rounded-lg border shadow-sm p-6'>
          <PassportRenewalForm />
        </div>
      </div>
    </Container>
  );
}
