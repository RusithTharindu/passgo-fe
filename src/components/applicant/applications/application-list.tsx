'use client';

import { Application } from '@/types/application';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationListProps {
  applications: Application[];
  isLoading: boolean;
}

export function ApplicationList({ applications, isLoading }: ApplicationListProps) {
  if (isLoading) {
    return <ApplicationListSkeleton />;
  }

  if (applications.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No applications found. Start by creating a new application.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>NIC Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => (
              <TableRow key={application._id}>
                <TableCell className='font-medium'>{application._id}</TableCell>
                <TableCell>{application.nationalIdentityCardNumber}</TableCell>
                <TableCell>{application.typeOfService}</TableCell>
                <TableCell>
                  <StatusBadge status={application.status} />
                </TableCell>
                <TableCell>
                  {application.createdAt
                    ? format(new Date(application.createdAt), 'PPP')
                    : 'Not available'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Application['status'] }) {
  const variants: Record<Application['status'], 'default' | 'secondary' | 'destructive'> = {
    pending: 'default',
    document_verification: 'secondary',
    biometric_pending: 'secondary',
    biometric_completed: 'secondary',
    payment_pending: 'default',
    payment_completed: 'default',
    processing: 'secondary',
    completed: 'default',
    rejected: 'destructive',
  };

  return <Badge variant={variants[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
}

function ApplicationListSkeleton() {
  return (
    <Card>
      <CardContent className='p-6 space-y-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex justify-between items-center'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[200px]' />
            </div>
            <Skeleton className='h-8 w-[100px]' />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
