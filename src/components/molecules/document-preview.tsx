'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface DocumentPreviewProps {
  label: string;
  url: string;
  type: string;
}

export function DocumentPreview({ label, url, type }: DocumentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = type.startsWith('image/');

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <>
      <div className='border rounded-lg p-4 space-y-3'>
        <div className='flex justify-between items-center'>
          <h3 className='font-medium text-sm'>{label}</h3>
          <div className='flex gap-2'>
            <Button size='icon' variant='ghost' onClick={() => setShowPreview(true)}>
              <Eye className='h-4 w-4' />
            </Button>
            <Button size='icon' variant='ghost' onClick={handleDownload}>
              <Download className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='aspect-video relative bg-muted rounded-md overflow-hidden'>
          {isImage ? (
            <Image src={url} alt={label} fill className='object-cover' />
          ) : (
            <div className='flex items-center justify-center h-full'>
              <FileText className='h-8 w-8 text-muted-foreground' />
            </div>
          )}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='max-w-4xl'>
          {isImage ? (
            <div className='relative aspect-video'>
              <Image src={url} alt={label} fill className='object-contain' />
            </div>
          ) : (
            <iframe src={url} title={label} className='w-full h-[80vh]' />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
