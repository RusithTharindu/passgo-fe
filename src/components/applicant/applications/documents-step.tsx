'use client';

import { DocumentUpload } from './document-upload';
import { DocumentType } from '@/types/application';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DocumentsStepProps {}

export function DocumentsStep({}: DocumentsStepProps) {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='text-sm font-medium'>Birth Certificate (Front)</label>
          <DocumentUpload documentType={DocumentType.BIRTH_CERT_FRONT} />
        </div>

        <div>
          <label className='text-sm font-medium'>Birth Certificate (Back)</label>
          <DocumentUpload documentType={DocumentType.BIRTH_CERT_BACK} />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='text-sm font-medium'>NIC (Front)</label>
          <DocumentUpload documentType={DocumentType.NIC_FRONT} />
        </div>

        <div>
          <label className='text-sm font-medium'>NIC (Back)</label>
          <DocumentUpload documentType={DocumentType.NIC_BACK} />
        </div>
      </div>

      <div>
        <label className='text-sm font-medium'>Passport Photo</label>
        <DocumentUpload documentType={DocumentType.USER_PHOTO} />
      </div>
    </div>
  );
}
