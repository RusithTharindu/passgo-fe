'use client';

import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '@/api/application';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Application, ApplicationStatus } from '@/types/application';
import { useState } from 'react';
import { ApplicationList } from './application-list';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

export function ApplicationDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: applicationApi.getById,
  });

  const filteredApplications = applications.filter((app: Application) => {
    if (!app) return false;

    const matchesSearch =
      searchTerm === '' ||
      (app.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.nationalIdentityCardNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className='container mx-auto py-8 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>My Applications</h1>
        <Button onClick={() => router.push('/applicant/passport/pre-apply')}>
          New Application
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by ID or NIC number'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-9'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                {Object.values(ApplicationStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <ApplicationList applications={filteredApplications} isLoading={isLoading} />
    </div>
  );
}
