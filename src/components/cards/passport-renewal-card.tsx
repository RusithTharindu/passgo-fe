import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PassportRenewal, RenewalStatus } from '@/types/passportTypes';
import { Passport, Calendar, AlertCircle } from 'lucide-react';

interface PassportRenewalCardProps {
  renewal: PassportRenewal;
}

function getStatusColor(status: RenewalStatus): string {
  switch (status) {
    case RenewalStatus.APPROVED:
      return 'bg-green-500/10 text-green-500';
    case RenewalStatus.REJECTED:
      return 'bg-red-500/10 text-red-500';
    case RenewalStatus.PENDING:
      return 'bg-yellow-500/10 text-yellow-500';
    case RenewalStatus.PROCESSING:
      return 'bg-blue-500/10 text-blue-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}

export function PassportRenewalCard({ renewal }: PassportRenewalCardProps) {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='font-semibold'>#{renewal.renewalId}</div>
        <Badge className={getStatusColor(renewal.status)}>
          {renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1).toLowerCase()}
        </Badge>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center space-x-2 text-sm'>
          <Passport className='h-4 w-4 opacity-70' />
          <span>Passport Number: {renewal.passportNumber}</span>
        </div>
        <div className='flex items-center space-x-2 text-sm'>
          <Calendar className='h-4 w-4 opacity-70' />
          <span>Submitted on {format(new Date(renewal.submissionDate), 'PPP')}</span>
        </div>
        {renewal.expiryDate && (
          <div className='flex items-center space-x-2 text-sm'>
            <AlertCircle className='h-4 w-4 opacity-70' />
            <span>Expires on {format(new Date(renewal.expiryDate), 'PPP')}</span>
          </div>
        )}
        {renewal.processingNotes && (
          <div className='mt-2 text-sm text-muted-foreground'>
            <p className='font-medium'>Processing Notes:</p>
            <p>{renewal.processingNotes}</p>
          </div>
        )}
        {renewal.status === RenewalStatus.REJECTED && renewal.rejectionReason && (
          <div className='mt-2 text-sm text-red-500'>
            <p className='font-medium'>Rejection Reason:</p>
            <p>{renewal.rejectionReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
