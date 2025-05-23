'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { applicationApi } from '@/api/application';
import { useToast } from '@/hooks/use-toast';

export default function ApplicationStatusPage() {
  const [applicationId, setApplicationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicationId.trim()) {
      toast({
        title: 'Application ID Required',
        description: 'Please enter your application ID to check status',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await applicationApi.getById(applicationId);
      router.push(`/applicant/application/status/${applicationId}`);
    } catch (error: unknown) {
      const appError = error as {
        response?: { status: number };
        message?: string;
      };

      if (
        appError?.response?.status === 429 ||
        (appError.message && appError.message.includes('Too Many Requests'))
      ) {
        toast({
          title: 'Too Many Requests',
          description: 'Please wait a moment before trying again',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Application Not Found',
          description: 'Could not find an application with the provided ID',
          variant: 'destructive',
        });
      }
      console.error('Error fetching application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto py-12'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>Track Your Application</CardTitle>
            <CardDescription>
              Enter your application ID to check the current status of your passport application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='applicationId' className='text-sm font-medium'>
                  Application ID
                </label>
                <Input
                  id='applicationId'
                  placeholder='Enter your application ID'
                  value={applicationId}
                  onChange={e => setApplicationId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className='mr-2 h-4 w-4' />
                    Track Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
