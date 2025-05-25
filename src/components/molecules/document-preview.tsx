'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { FileText, Download, Eye, AlertTriangle } from 'lucide-react';
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
  photoURL = '/placeholder-image.jpg', // Default placeholder image
}: DocumentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [thumbImageError, setThumbImageError] = useState(false);
  const [popupImageError, setPopupImageError] = useState(false);

  const handleThumbImageError = () => {
    setThumbImageError(true);
    console.error('Failed to load thumbnail image:', { label, documentType, photoURL });
  };

  const handlePopupImageError = () => {
    setPopupImageError(true);
    console.error('Failed to load popup image:', { label, documentType, photoURL });
  };

  const isValidPhotoUrl = typeof photoURL === 'string' && photoURL.trim() !== '';

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
            disabled={!isValidPhotoUrl || thumbImageError}
          >
            <Eye className='h-4 w-4' />
          </Button>
          {/* <Button size='icon' variant='ghost' className='h-8 w-8'>
            <Download className='h-4 w-4' />
          </Button> */}
        </div>
      </div>

      <div className='aspect-video relative bg-muted rounded-md overflow-hidden'>
        {isValidPhotoUrl && !thumbImageError ? (
          <Image
            src={photoURL}
            alt={`${label} thumbnail`}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            onError={handleThumbImageError}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
            <FileText className='h-8 w-8' />
            <p className='text-sm mt-2 text-center'>
              {thumbImageError ? 'Error loading preview' : 'No preview available'}
            </p>
          </div>
        )}
      </div>

      {showPreview && isValidPhotoUrl && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className='max-w-3xl w-full'>
            <DialogHeader className='pb-2'>
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>
            <div className='relative aspect-video w-full bg-muted rounded-md overflow-hidden'>
              {!popupImageError ? (
                <Image
                  src={photoURL}
                  alt={label}
                  fill
                  className='object-contain'
                  sizes='(max-width: 768px) 100vw, 80vw'
                  onError={handlePopupImageError}
                />
              ) : (
                <div className='flex flex-col items-center justify-center h-full text-destructive'>
                  <AlertTriangle className='h-10 w-10 mb-2' />
                  <p className='text-sm font-medium'>Error loading image</p>
                  <p className='text-xs'>The image could not be displayed.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
