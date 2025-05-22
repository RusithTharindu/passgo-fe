import { useMutation } from '@tanstack/react-query';

export enum DocumentType {
  BIRTH_CERT_FRONT = 'birth-certificate-front',
  BIRTH_CERT_BACK = 'birth-certificate-back',
  USER_PHOTO = 'user-photo',
  NIC_FRONT = 'nic-front',
  NIC_BACK = 'nic-back',
  ADDITIONAL_DOCS = 'additional-documents',
}

export interface UploadDocumentResponse {
  url: string;
}

export interface UploadDocumentVariables {
  documentType: DocumentType;
  file: File;
  applicationId: string;
}

async function uploadDocument({
  documentType,
  file,
  applicationId,
}: UploadDocumentVariables): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `/application/upload-document/${documentType}?applicationId=${applicationId}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload document');
  }

  return response.json();
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: uploadDocument,
  });
}
