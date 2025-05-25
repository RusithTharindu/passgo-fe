'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PassportDocumentType } from '@/types/passportRenewalTypes';

type DocumentPreviewProps = {
  label: string;
  documentType: PassportDocumentType;
  isVerified?: boolean;
  isRequired?: boolean;
  className?: string;
  photoURL?: string | StaticImageData;
};

export function DocumentPreview({
  label,
  documentType,
  isVerified,
  isRequired = true,
  className,
  photoURL = '/placeholder-image.jpg',
}: DocumentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    console.error('Failed to load image:', documentType);
  };

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
          >
            <Eye className='h-4 w-4' />
          </Button>
          {/* <Button size='icon' variant='ghost' className='h-8 w-8'>
            <Download className='h-4 w-4' />
          </Button> */}
        </div>
      </div>

      <div className='aspect-video relative bg-muted rounded-md overflow-hidden'>
        {!imageError ? (
          <Image
            src={photoURL}
            alt={label}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            onError={handleImageError}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <FileText className='h-8 w-8 text-muted-foreground' />
            <p className='text-sm text-muted-foreground mt-2'>No document available</p>
          </div>
        )}
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='sm:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div className='relative w-full aspect-[4/3]'>
            <Image
              src={photoURL}
              alt={label}
              fill
              className='object-contain rounded-md'
              sizes='(max-width: 768px) 100vw, 800px'
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
