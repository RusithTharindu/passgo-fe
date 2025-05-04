'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { DocumentType } from '@/types/application';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentUpload } from '@/hooks/useApplication';
import Image from 'next/image';

interface DocumentUploadProps {
  documentType: DocumentType;
  onUploadComplete?: (url: string) => void;
}

export function DocumentUpload({ documentType, onUploadComplete }: DocumentUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use the document upload mutation
  const { mutate: uploadDocument } = useDocumentUpload();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image or PDF file',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Call the actual API to upload the document and get the S3 presigned URL
      uploadDocument(
        { documentType, file },
        {
          onSuccess: data => {
            clearInterval(interval);
            setProgress(100);

            // Use the URL returned from the API
            setDocumentUrl(data.url);

            if (onUploadComplete) {
              onUploadComplete(data.url);
            }

            toast({
              title: 'Document uploaded successfully',
              description: `Your ${getDocumentLabel(documentType)} has been uploaded.`,
            });

            setIsUploading(false);
          },
          onError: () => {
            clearInterval(interval);
            setError('Failed to upload document. Please try again.');
            toast({
              title: 'Upload failed',
              description: 'Please try again later',
              variant: 'destructive',
            });
            setIsUploading(false);
          },
        },
      );
    } catch {
      setError('Failed to upload document. Please try again.');
      toast({
        title: 'Upload failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const removeDocument = () => {
    setDocumentUrl(null);
    if (onUploadComplete) {
      onUploadComplete('');
    }
  };

  const getDocumentLabel = (type: DocumentType): string => {
    const labels: Record<DocumentType, string> = {
      [DocumentType.NIC_FRONT]: 'NIC (Front)',
      [DocumentType.NIC_BACK]: 'NIC (Back)',
      [DocumentType.BIRTH_CERT_FRONT]: 'Birth Certificate (Front)',
      [DocumentType.BIRTH_CERT_BACK]: 'Birth Certificate (Back)',
      [DocumentType.USER_PHOTO]: 'Passport Photo',
      [DocumentType.DUAL_CITIZENSHIP]: 'Dual Citizenship Certificate',
    };
    return labels[type] || 'Document';
  };

  const isImage =
    documentUrl && (documentUrl.includes('image/') || /\.(jpg|jpeg|png)$/i.test(documentUrl));

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-6'>
        {documentUrl ? (
          <div className='relative w-full'>
            {isImage ? (
              <div className='relative aspect-video w-full bg-muted rounded-md overflow-hidden'>
                <div className='relative w-full h-full'>
                  <Image
                    src={documentUrl}
                    alt={getDocumentLabel(documentType)}
                    fill
                    className='object-contain'
                  />
                </div>
              </div>
            ) : (
              <div className='relative aspect-video w-full bg-muted rounded-md flex items-center justify-center'>
                <FileText className='h-16 w-16 text-muted-foreground' />
                <div className='mt-2 text-sm font-medium'>PDF Document</div>
              </div>
            )}
            <Button
              variant='destructive'
              size='icon'
              className='absolute top-2 right-2'
              onClick={removeDocument}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted',
            )}
          >
            <input {...getInputProps()} />
            <div className='space-y-2'>
              <Upload className='mx-auto h-8 w-8 text-muted-foreground' />
              <p className='text-sm font-medium'>Upload {getDocumentLabel(documentType)}</p>
              <p className='text-xs text-muted-foreground'>Drag and drop or click to select file</p>
              <p className='text-xs text-muted-foreground'>
                Supported formats: JPEG, PNG, PDF. Max size: 10MB
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className='mt-4 space-y-2'>
            <div className='flex justify-between text-xs'>
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className='h-2' />
          </div>
        )}

        {error && <p className='text-sm text-destructive mt-2'>{error}</p>}
      </CardContent>
    </Card>
  );
}
