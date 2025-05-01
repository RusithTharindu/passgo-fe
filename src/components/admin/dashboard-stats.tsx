{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RenewPassportStatus } from '@/types/passportRenewalTypes';
import { RenewPassportResponse } from '@/types/passportRenewalTypes';
import { FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardStatsProps {
  renewals: RenewPassportResponse[];
}

export function DashboardStats({ renewals }: DashboardStatsProps) {
  const stats = {
    total: renewals.length,
    pending: renewals.filter(r => r.status === RenewPassportStatus.PENDING).length,
    verified: renewals.filter(r => r.status === RenewPassportStatus.VERIFIED).length,
    rejected: renewals.filter(r => r.status === RenewPassportStatus.REJECTED).length,
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Requests</CardTitle>
          <FileText className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.total}</div>
          <p className='text-xs text-muted-foreground'>All passport renewal requests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Pending Review</CardTitle>
          <Clock className='h-4 w-4 text-amber-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-amber-500'>{stats.pending}</div>
          <p className='text-xs text-muted-foreground'>Awaiting admin verification</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Verified</CardTitle>
          <CheckCircle className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-500'>{stats.verified}</div>
          <p className='text-xs text-muted-foreground'>Successfully verified requests</p>
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
