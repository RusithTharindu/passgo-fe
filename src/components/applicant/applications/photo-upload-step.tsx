'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

type FormData = z.infer<typeof applicationSchema>;

interface PhotoUploadStepProps {
  form: UseFormReturn<FormData>;
}

export function PhotoUploadStep({ form }: PhotoUploadStepProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate image dimensions for passport photo
    const img = new window.Image();
    img.onload = async () => {
      if (img.width < 413 || img.height < 531) {
        toast({
          title: 'Image too small',
          description: 'Passport photo must be at least 413x531 pixels (35x45mm at 300 DPI)',
          variant: 'destructive',
        });
        return;
      }

      // Mock file upload with progress
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval);
              return 95;
            }
            return prev + 5;
          });
        }, 100);

        // Simulate API call to upload file
        await new Promise(resolve => setTimeout(resolve, 2000));

        clearInterval(interval);
        setUploadProgress(100);

        // Create a temporary URL for preview (in a real app, this would be the server URL)
        const tempPhotoUrl = URL.createObjectURL(file);
        setPhotoUrl(tempPhotoUrl);

        toast({
          title: 'Photo uploaded successfully',
          description: 'Your passport photo has been uploaded.',
        });
      } catch {
        toast({
          title: 'Upload failed',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    };

    img.src = URL.createObjectURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const removePhoto = () => {
    setPhotoUrl('');
  };

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Photo Upload Instructions</h2>
      </div>

      <Alert className='mb-6'>
        <AlertTitle>Photo Requirements</AlertTitle>
        <AlertDescription>
          <ul className='list-disc pl-5 mt-2 space-y-1 text-sm'>
            <li>Color photo with white background</li>
            <li>35mm x 45mm (minimum 413x531 pixels at 300 DPI)</li>
            <li>Taken within the last 6 months</li>
            <li>Neutral facial expression with both eyes open</li>
            <li>Face should take up 70-80% of the photo</li>
            <li>No hats or head coverings (except for religious purposes)</li>
            <li>No glasses or accessories that cover any part of the face</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
