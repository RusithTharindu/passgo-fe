'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRenewalRequest } from '@/hooks/usePassportRenewal';
import { RenewalDetailView } from '@/components/forms/renewal-detail-view';
import { Container } from '@/components/ui/container';
import { Loader2 } from 'lucide-react';

export default function PassportRenewalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: renewalRequest, isLoading, isError } = useRenewalRequest(id);

  if (isLoading) {
    return (
      <Container>
        <div className='py-8 flex justify-center items-center min-h-[60vh]'>
          <div className='flex flex-col items-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <p className='mt-4'>Loading renewal request details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (isError || !renewalRequest) {
    return (
      <Container>
        <div className='py-8 flex justify-center items-center min-h-[60vh]'>
          <div className='text-center'>
            <h2 className='text-xl font-medium text-destructive'>Error Loading Renewal Request</h2>
            <p className='mt-2 text-muted-foreground'>
              The renewal request could not be found or there was an error loading it.
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className='py-8'>
        <RenewalDetailView renewal={renewalRequest} />
      </div>
    </Container>
  );
}
