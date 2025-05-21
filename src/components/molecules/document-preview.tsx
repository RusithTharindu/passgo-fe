'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useState } from 'react';
import Image from 'next/image';
import { FileText, Download, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRenewalDocument } from '@/hooks/usePassportRenewal';
import { PassportDocumentType } from '@/types/passportRenewalTypes';

type DocumentPreviewProps = {
  applicationId?: string;
  label: string;
  documentType: PassportDocumentType;
  isVerified?: boolean;
  isRequired?: boolean;
  className?: string;
};

export function DocumentPreview({
  applicationId,
  label,
  documentType,
  isVerified,
  isRequired = true,
  className,
}: DocumentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use the document URLs hook
  const {
    data,
    isError: isUrlError,
    isLoading,
  } = useRenewalDocument(applicationId || '', documentType);

  // Get the URL string from the response
  const url = typeof data === 'string' ? data : data?.url;

  // Determine if we have a valid image
  const isImage = !imageError && !isUrlError && !!url;

  const handleDownload = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.error('Failed to load image:', { url, documentType });
  };

  const renderErrorState = () => (
    <div className='flex flex-col items-center justify-center h-full'>
      <AlertTriangle className='h-8 w-8 text-destructive mb-2' />
      <p className='text-sm text-muted-foreground text-center'>
        {isUrlError ? 'Failed to get document URL' : 'Failed to load image'}
      </p>
      {url && (
        <Button variant='outline' size='sm' className='mt-4' onClick={handleDownload}>
          <Download className='h-4 w-4 mr-2' />
          Try Download
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn('border rounded-lg p-4 space-y-3', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='font-medium text-sm'>
            {label}
            {isRequired && <span className='text-destructive ml-1'>*</span>}
          </h3>
          {isVerified !== undefined && (
            <Badge variant={isVerified ? 'default' : 'secondary'} className='ml-2'>
              {isVerified ? 'Verified' : 'Pending'}
            </Badge>
          )}
        </div>
        <div className='flex gap-2'>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => setShowPreview(true)}
            className='h-8 w-8'
            disabled={!isImage}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            onClick={handleDownload}
            className='h-8 w-8'
            disabled={!url}
          >
            <Download className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='aspect-video relative bg-muted rounded-md overflow-hidden'>
        {isLoading ? (
          <div className='flex items-center justify-center h-full'>
            <div className='animate-pulse w-12 h-12 rounded-full bg-muted-foreground/20' />
          </div>
        ) : isImage ? (
          <Image
            src={url}
            alt={label}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            onError={handleImageError}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            {imageError || isUrlError ? (
              renderErrorState()
            ) : (
              <>
                <FileText className='h-8 w-8 text-muted-foreground' />
                <p className='text-sm text-muted-foreground mt-2'>
                  {isLoading ? 'Loading...' : 'No document uploaded'}
                </p>
                <p className='text-xs text-muted-foreground/80 mt-1'>
                  Upload {label.toLowerCase()} to continue
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {showPreview && isImage && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-hidden p-0'>
            <DialogHeader className='p-4 border-b'>
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>
            <div className='relative w-full h-full p-4'>
              <div className='relative aspect-auto w-full max-h-[70vh]'>
                <Image
                  src={url}
                  alt={label}
                  fill
                  className='object-contain'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
                  priority
                  onError={handleImageError}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
