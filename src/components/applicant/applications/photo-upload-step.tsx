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
  const photoUrl = form.watch('userPhoto');

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
    const img = new Image();
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
        const photoUrl = URL.createObjectURL(file);
        form.setValue('userPhoto', photoUrl);

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
    form.setValue('userPhoto', '');
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

      {/* <FormField
        control={form.control}
        name='userPhoto'
        render={() => (
          <FormItem>
            <FormLabel>Passport Photo</FormLabel>
            <FormControl>
              <Card className='overflow-hidden'>
                <CardContent className='p-6'>
                  {photoUrl ? (
                    <div className='relative aspect-[35/45] w-full max-w-[236px] mx-auto bg-muted'>
                      <Image src={photoUrl} alt='Passport photo' fill className='object-cover' />
                      <Button
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={removePhoto}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                      <div className='absolute bottom-0 left-0 right-0 bg-green-500 text-white py-1 px-2 flex items-center justify-center'>
                        <Check className='h-4 w-4 mr-1' />
                        <span className='text-xs'>Photo Uploaded</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className='space-y-3'>
                        <Upload className='mx-auto h-10 w-10 text-muted-foreground' />
                        <h3 className='text-base font-medium'>Upload Passport Photo</h3>
                        <p className='text-sm text-muted-foreground max-w-xs mx-auto'>
                          Drag and drop your photo here, or click to select a file
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Supported formats: JPEG, PNG. Max size: 5MB
                        </p>
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className='mt-4 space-y-2'>
                      <div className='flex justify-between text-xs'>
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className='h-2' />
                    </div>
                  )}
                </CardContent>
              </Card>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </div>
  );
}
