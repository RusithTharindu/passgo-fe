import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Application, ApplicationStatus, StatusHistoryItem } from '@/types/applicationTypes';
import { FileText, Calendar } from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
}

function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.COLLECTED:
      return 'bg-green-500/10 text-green-500';
    case ApplicationStatus.REJECTED:
      return 'bg-red-500/10 text-red-500';
    case ApplicationStatus.PAYMENT_PENDING:
      return 'bg-yellow-500/10 text-yellow-500';
    case ApplicationStatus.ON_HOLD:
      return 'bg-orange-500/10 text-orange-500';
    case ApplicationStatus.QUALITY_ASSURANCE:
    case ApplicationStatus.SENIOR_OFFICER_REVIEW:
    case ApplicationStatus.CONTROLLER_REVIEW:
      return 'bg-blue-500/10 text-blue-500';
    case ApplicationStatus.PRINTING:
    case ApplicationStatus.PRINTING_PENDING:
      return 'bg-purple-500/10 text-purple-500';
    case ApplicationStatus.READY_FOR_COLLECTION:
      return 'bg-emerald-500/10 text-emerald-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const currentStatus = application.statusHistory?.length
    ? application.statusHistory[application.statusHistory.length - 1]
    : ({ status: application.status, timestamp: new Date() } as StatusHistoryItem);

  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='font-semibold'>#{application._id}</div>
        <Badge className={getStatusColor(currentStatus.status)}>
          {currentStatus.status
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')}
        </Badge>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center space-x-2 text-sm'>
          <FileText className='h-4 w-4 opacity-70' />
          <span className='capitalize'>{application.typeOfService} Service</span>
        </div>
        <div className='flex items-center space-x-2 text-sm'>
          <Calendar className='h-4 w-4 opacity-70' />
          <span>Submitted on {format(new Date(application.createdAt), 'PPP')}</span>
        </div>
        {currentStatus.comment && (
          <div className='mt-2 text-sm text-muted-foreground'>
            <p className='font-medium'>Status Comment:</p>
            <p>{currentStatus.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
