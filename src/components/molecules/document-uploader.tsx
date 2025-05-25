'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface DocumentUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  accept?: string;
  error?: string;
  onFileSelect?: (file: File) => void;
  isLoading?: boolean;
  previewType?: 'image' | 'document';
}

export function DocumentUploader({
  value,
  onChange,
  label,
  accept = 'image/*,.pdf',
  error,
  onFileSelect,
  isLoading = false,
  previewType = 'image',
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [currentPreviewType, setCurrentPreviewType] = useState(previewType);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onChange(result);
      };
      reader.readAsDataURL(file);

      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-2'>
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer h-40 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300',
          error ? 'border-destructive' : '',
          isLoading ? 'opacity-50 pointer-events-none' : '',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {isLoading ? (
          <div className='flex flex-col items-center text-muted-foreground'>
            <div className='animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent' />
            <span className='text-sm mt-2'>Uploading...</span>
          </div>
        ) : previewUrl ? (
          <div className='relative w-full h-full'>
            {currentPreviewType === 'image' ? (
              <div className='relative w-full h-full'>
                <Image
                  src={previewUrl}
                  alt={label}
                  fill
                  className='object-contain'
                  onError={() => {
                    // Handle image load errors
                    setCurrentPreviewType('document');
                  }}
                />
                <Button
                  type='button'
                  size='icon'
                  variant='destructive'
                  className='absolute -top-2 -right-2 h-6 w-6'
                  onClick={handleRemove}
                >
                  <X className='w-3 h-3' />
                </Button>
                <div className='absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-tl-md'>
                  <Check className='w-3 h-3' />
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center w-full h-full'>
                <FileText className='w-12 h-12 text-primary' />
                <span className='text-sm mt-2 font-medium'>Document Uploaded</span>
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  className='absolute top-0 right-0 h-6 w-6'
                  onClick={handleRemove}
                >
                  <X className='w-3 h-3' />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className='w-8 h-8 text-muted-foreground' />
            <div className='text-sm text-center'>
              <span className='font-medium text-primary'>Click to upload</span> or drag and drop
              <p className='text-xs text-muted-foreground mt-1'>{label}</p>
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type='file'
          className='hidden'
          accept={accept}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>
      {error && <p className='text-destructive text-xs'>{error}</p>}
    </div>
  );
}
