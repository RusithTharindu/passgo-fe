'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { RenewPassportResponse } from '@/types/passportRenewalTypes';
import { StatusBadge } from '@/components/molecules/status-badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PassportRenewalCardProps {
  renewal: RenewPassportResponse;
}

export function PassportRenewalCard({ renewal }: PassportRenewalCardProps) {
  const createdDate = new Date(renewal.createdAt);

  // Calculate completeness percentage based on document uploads
  const requiredDocuments = 5; // 5 required documents, 1 optional
  const uploadedDocuments = Object.values(renewal.documents).filter(Boolean).length;
  const completionPercentage = Math.min(
    Math.round((uploadedDocuments / requiredDocuments) * 100),
    100,
  );

  // Determine if documents are complete
  const isDocumentsComplete = completionPercentage === 100;

  return (
    <div className='border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'>
      <div className='flex justify-between items-center p-4 border-b'>
        <div>
          <h3 className='font-medium'>{renewal.fullName}</h3>
          <p className='text-sm text-muted-foreground'>Passport: {renewal.currentPassportNumber}</p>
        </div>
        <StatusBadge status={renewal.status} />
      </div>

      <div className='p-4 space-y-4'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-muted-foreground'>Created On</p>
            <p>{format(createdDate, 'PPP')}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Documents</p>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden'>
                <div className='h-full bg-primary' style={{ width: `${completionPercentage}%` }} />
              </div>
              <span className='text-xs'>{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {renewal.status === 'REJECTED' && renewal.adminRemarks && (
          <div className='bg-red-50 p-3 rounded text-sm border border-red-100'>
            <p className='font-medium text-red-700'>Rejection Reason:</p>
            <p className='text-red-600'>{renewal.adminRemarks}</p>
          </div>
        )}

        <div className='flex justify-end pt-2'>
          <Button size='sm' asChild>
            <Link href={`/applicant/passport-renewal/${renewal._id}`}>
              View Details
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
