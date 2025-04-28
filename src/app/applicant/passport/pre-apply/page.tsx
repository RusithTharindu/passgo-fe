'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PreApplyPage() {
  const [agreed, setAgreed] = useState(false);
  const [pdfViewed, setPdfViewed] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const router = useRouter();

  const handleProceed = () => {
    if (!agreed) {
      toast({
        title: 'Agreement Required',
        description: 'Please agree to the terms and conditions to proceed.',
        variant: 'destructive',
      });
      return;
    }
    router.push('/applicant/passport/apply');
  };

  const handlePdfError = () => {
    setPdfError(true);
    toast({
      title: 'PDF Loading Error',
      description: 'Unable to load the instructions PDF. Please try again later.',
      variant: 'destructive',
    });
  };

  return (
    <div className='container mx-auto py-8'>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>Passport Application Instructions</CardTitle>
          <CardDescription>
            Please review the application process and requirements before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* PDF Viewer Dialog */}
          <Dialog
            onOpenChange={(open: boolean) => {
              if (!open && !pdfViewed) setPdfViewed(true);
            }}
          >
            <DialogTrigger asChild>
              <Button variant='outline' className='w-full'>
                <FileText className='mr-2 h-4 w-4' />
                View Instructions and Requirements
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-4xl p-0'>
              <DialogHeader className='p-6 pb-0'>
                <DialogTitle>Passport Application Guidelines</DialogTitle>
                <DialogDescription>
                  Please read the following instructions carefully
                </DialogDescription>
              </DialogHeader>
              <div className='p-6 pt-0'>
                {!pdfError ? (
                  <iframe
                    src='/assets/pdfs/instructions.pdf'
                    className='w-full h-[70vh] rounded-md border'
                    title='Passport Application Guidelines'
                    onError={handlePdfError}
                  />
                ) : (
                  <div className='flex items-center justify-center h-[70vh] text-muted-foreground'>
                    Unable to load PDF. Please try again later.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Agreement Section */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='terms'
              checked={agreed}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                setAgreed(checked as boolean)
              }
            />
            <label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              I have read and agree to the terms and conditions
            </label>
          </div>

          {/* Proceed Button */}
          <Button className='w-full' onClick={handleProceed}>
            Proceed to Application
          </Button>

          {/* Need More Information */}
          <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
            <HelpCircle className='h-4 w-4' />
            <span>Need more information?</span>
            <Link href='/applicant/support' className='text-primary hover:underline'>
              Visit our help center
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
