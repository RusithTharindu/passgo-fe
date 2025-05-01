import { FileText, Download, CheckCircle2, Eye } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface SubmittedDocumentViewProps {
  label: string;
  documentUrl: string;
  isRequired?: boolean;
}

export function SubmittedDocumentView({
  label,
  documentUrl,
  isRequired = true,
}: SubmittedDocumentViewProps) {
  const isImage = documentUrl?.match(/\.(jpeg|jpg|gif|png)$/i);
  const isPDF = documentUrl?.toLowerCase().endsWith('.pdf');

  return (
    <Card className='relative'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm font-medium'>
              {label}
              {isRequired && <span className='text-red-500 ml-1'>*</span>}
            </CardTitle>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          </div>
        </div>
      </CardHeader>
      <CardContent className='pb-2'>
        <div className='relative h-32 w-full bg-gray-50 rounded-md overflow-hidden'>
          {isImage ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  className='absolute inset-0 w-full h-full p-0 hover:bg-black/5'
                >
                  <div className='relative w-full h-full'>
                    <Image src={documentUrl} alt={label} fill className='object-contain' />
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-3xl h-[80vh]'>
                <div className='relative w-full h-full'>
                  <Image src={documentUrl} alt={label} fill className='object-contain' />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className='flex flex-col items-center justify-center h-full'>
              <FileText className={cn('h-10 w-10', isPDF ? 'text-red-500' : 'text-primary')} />
              <p className='mt-2 text-sm text-muted-foreground'>
                {isPDF ? 'PDF Document' : 'Document'} Uploaded
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        {isImage && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost' size='sm'>
                <Eye className='h-4 w-4 mr-2' />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-3xl h-[80vh]'>
              <div className='relative w-full h-full'>
                <Image src={documentUrl} alt={label} fill className='object-contain' />
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button variant='outline' size='sm' className='ml-auto' asChild>
          <a href={documentUrl} target='_blank' rel='noopener noreferrer'>
            <Download className='h-4 w-4 mr-2' />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
