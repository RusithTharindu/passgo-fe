import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { GoogleAuth } from 'google-auth-library';
import credentials from '../config/google-cloud-credentials.json';

export function getDocumentAiClient() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us';
  const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID;

  if (!projectId || !processorId) {
    throw new Error('Missing required Google Cloud configuration');
  }

  return {
    client: new DocumentProcessorServiceClient({
      authClient: new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      }),
    }),
    name: `projects/${projectId}/locations/${location}/processors/${processorId}`,
  };
}
