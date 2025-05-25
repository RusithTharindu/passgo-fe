import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Application, ApplicationStatus } from '@/types/applicationTypes';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationStatsProps {
  applications: Application[];
}

export function ApplicationStats({ applications }: ApplicationStatsProps) {
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length,
    approved: applications.filter(a => a.status === ApplicationStatus.COLLECTED).length,
    rejected: applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Applications</CardTitle>
          <FileText className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.total}</div>
          <p className='text-xs text-muted-foreground'>All passport applications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Pending Review</CardTitle>
          <Clock className='h-4 w-4 text-amber-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-amber-500'>{stats.pending}</div>
          <p className='text-xs text-muted-foreground'>Awaiting verification</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Approved</CardTitle>
          <CheckCircle className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-500'>{stats.approved}</div>
          <p className='text-xs text-muted-foreground'>Successfully processed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Rejected</CardTitle>
          <XCircle className='h-4 w-4 text-red-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-500'>{stats.rejected}</div>
          <p className='text-xs text-muted-foreground'>Rejected applications</p>
        </CardContent>
      </Card>
    </div>
  );
}
