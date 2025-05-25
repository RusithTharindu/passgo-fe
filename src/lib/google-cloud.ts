import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
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
      credentials,
      projectId,
    }),
    name: `projects/${projectId}/locations/${location}/processors/${processorId}`,
  };
}
