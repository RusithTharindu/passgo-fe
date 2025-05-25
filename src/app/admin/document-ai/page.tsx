'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Upload,
  X,
  FileText,
  Loader2,
  AlertCircle,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AxiosInstance from '@/utils/helpers/axiosApi';

interface OcrResult {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ApplicationData {
  name: string;
  nicNumber: string;
  gender: string;
  dateOfBirth: string;
}

interface ValidationResult {
  field: string;
  ocrValue: string;
  appValue: string;
  isMatch: boolean;
}

export default function DocumentAiPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<OcrResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // New state variables
  const [applicationId, setApplicationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isApplicationFound, setIsApplicationFound] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setResults([]);
    setError(null);
    setValidationResults([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.pdf'],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: rejections => {
      const error = rejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'File is too large. Maximum size is 10MB.',
        });
      } else if (error?.code === 'file-invalid-type') {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Invalid file type. Please upload an image or PDF.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Error uploading file. Please try again.',
        });
      }
    },
  });

  const handleFetchApplication = async () => {
    if (!applicationId) {
      toast({
        variant: 'destructive',
        title: 'Input Error',
        description: 'Please enter an application ID',
      });
      return;
    }

    setIsLoading(true);
    setApplicationData(null);
    setIsApplicationFound(false);
    setValidationResults([]);

    try {
      const response = await AxiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}application/${applicationId}`,
      );

      if (response.data) {
        const data = response.data;

        // Safe date formatting
        let formattedDate = '';
        try {
          if (data.dateOfBirth) {
            const date = new Date(data.birthdate);
            if (!isNaN(date.getTime())) {
              formattedDate = date.toISOString().split('T')[0].replace(/-/g, '/');
            } else {
              formattedDate = 'Invalid date';
            }
          } else {
            formattedDate = 'N/A';
          }
        } catch (e) {
          console.error('Date parsing error:', e);
          formattedDate = 'Invalid date';
        }

        // Format and set application data
        setApplicationData({
          name: `${data.surname || ''} ${data.otherNames || ''}`.trim(),
          nicNumber: data.nationalIdentityCardNumber || '',
          gender: data.sex || '',
          dateOfBirth: data.birthdate,
        });

        setIsApplicationFound(true);

        toast({
          title: 'Success',
          description: 'Application data retrieved successfully',
        });

        // If OCR results are already available, run validation
        if (results.length > 0) {
          validateDataWithOcr(results, {
            name: `${data.surname || ''} ${data.otherNames || ''}`.trim(),
            nicNumber: data.nationalIdentityCardNumber || '',
            gender: data.sex || '',
            dateOfBirth: data.birthdate,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch application data. Please check the ID and try again.',
      });
      setIsApplicationFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const extractDataFromOcr = (ocrResults: OcrResult[]): Partial<ApplicationData> => {
    const extractedData: Partial<ApplicationData> = {};
    const fullText = ocrResults.map(r => r.text).join(' ');

    // Extract NIC number - typically in the format 123456789V or 198732403040
    const nicMatch = fullText.match(/\d{9}[Vv]|\d{12}/);
    if (nicMatch) {
      extractedData.nicNumber = nicMatch[0];
    }

    // Extract date of birth - try multiple date formats
    // Format: YYYY/MM/DD
    const dateRegex1 = /\b\d{4}\/\d{1,2}\/\d{1,2}\b/;
    // Format: Birth: YYYY/MM/DD
    const dateRegex2 = /Birth\s*:\s*(\d{4}\/\d{1,2}\/\d{1,2})/i;
    // Format: DD/MM/YYYY
    const dateRegex3 = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/;

    const dobMatch1 = fullText.match(dateRegex2);
    if (dobMatch1) {
      extractedData.dateOfBirth = dobMatch1[1];
    } else {
      const dobMatch2 = fullText.match(dateRegex1);
      if (dobMatch2) {
        extractedData.dateOfBirth = dobMatch2[0];
      } else {
        const dobMatch3 = fullText.match(dateRegex3);
        if (dobMatch3) {
          // Convert DD/MM/YYYY to YYYY/MM/DD
          const parts = dobMatch3[0].split('/');
          if (parts.length === 3) {
            extractedData.dateOfBirth = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        }
      }
    }

    // Extract gender - look for "Male" or "Female"
    if (fullText.includes('Male')) {
      extractedData.gender = 'Male';
    } else if (fullText.includes('Female')) {
      extractedData.gender = 'Female';
    }

    // Extract name - more complicated, look for "Name:" prefix
    const nameMatch = fullText.match(/Name\s*:\s*([A-Z\s]+)/i);
    if (nameMatch) {
      extractedData.name = nameMatch[1].trim();
    }

    console.log('Extracted data from OCR:', extractedData);
    return extractedData;
  };

  const validateDataWithOcr = (ocrResults: OcrResult[], appData: ApplicationData) => {
    const extractedData = extractDataFromOcr(ocrResults);
    const results: ValidationResult[] = [];

    // Validate name
    if (extractedData.name) {
      results.push({
        field: 'Name',
        ocrValue: extractedData.name,
        appValue: appData.name,
        isMatch:
          extractedData.name.toLowerCase().includes(appData.name.toLowerCase()) ||
          appData.name.toLowerCase().includes(extractedData.name.toLowerCase()),
      });
    }

    // Validate NIC
    if (extractedData.nicNumber) {
      results.push({
        field: 'NIC Number',
        ocrValue: extractedData.nicNumber,
        appValue: appData.nicNumber,
        isMatch: extractedData.nicNumber === appData.nicNumber,
      });
    }

    // Validate gender
    if (extractedData.gender) {
      results.push({
        field: 'Gender',
        ocrValue: extractedData.gender,
        appValue: appData.gender,
        isMatch: extractedData.gender.toLowerCase() === appData.gender.toLowerCase(),
      });
    }

    // Validate date of birth
    if (extractedData.dateOfBirth) {
      // Compare dates with flexible matching
      let isDateMatch = false;

      // Try exact match first
      if (extractedData.dateOfBirth === appData.dateOfBirth) {
        isDateMatch = true;
      } else {
        // Try to normalize and compare
        try {
          // Extract numbers from both dates
          const ocrDateNumbers = extractedData.dateOfBirth.match(/\d+/g) || [];
          const appDateNumbers = appData.dateOfBirth.match(/\d+/g) || [];

          // If we have exactly 3 numbers in each (year, month, day)
          if (ocrDateNumbers.length === 3 && appDateNumbers.length === 3) {
            // Check if at least 2 of the 3 numbers match
            let matchCount = 0;
            for (let i = 0; i < 3; i++) {
              if (ocrDateNumbers[i] === appDateNumbers[i]) {
                matchCount++;
              }
            }
            isDateMatch = matchCount >= 2;
          }
        } catch (e) {
          console.error('Error comparing dates:', e);
        }
      }

      results.push({
        field: 'Date of Birth',
        ocrValue: extractedData.dateOfBirth,
        appValue: appData.dateOfBirth,
        isMatch: isDateMatch,
      });
    }

    setValidationResults(results);
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setValidationResults([]);

    try {
      // First, request a fresh access token
      console.log('Generating access token...');
      const tokenResponse = await fetch('/api/document-ai/token');

      if (!tokenResponse.ok) {
        const tokenError = await tokenResponse.json();
        throw new Error(tokenError.error || 'Failed to authenticate with Google Cloud');
      }

      // Create FormData and upload the file
      const formData = new FormData();
      formData.append('file', file);

      console.log('Making request to Document AI endpoint...');

      // Make request to our Next.js API endpoint
      const response = await fetch('/api/document-ai/process', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to process document');
      }

      const data = await response.json();
      console.log('Document AI results:', data);

      // Safely handle the data
      if (data && data.results) {
        setResults(data.results);

        if (data.results.length === 0) {
          toast({
            variant: 'destructive',
            title: 'No Text Detected',
            description: 'No text was detected in the document.',
          });
        } else {
          toast({
            title: 'Success',
            description: `Successfully detected ${data.results.length} text elements`,
          });

          // If application data is already loaded, validate against OCR results
          if (applicationData) {
            validateDataWithOcr(data.results, applicationData);
          }
        }
      } else {
        // Handle unexpected response format
        console.error('Unexpected response format:', data);
        throw new Error('Received invalid response format from Document AI');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process document';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResults([]);
    setError(null);
    setValidationResults([]);
  };

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Document AI Validation</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-2'>
            <Input
              placeholder='Enter Application ID'
              value={applicationId}
              onChange={e => setApplicationId(e.target.value)}
              className='max-w-xs'
            />
            <Button onClick={handleFetchApplication} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Loading...
                </>
              ) : (
                <>
                  <Search className='h-4 w-4 mr-2' />
                  Fetch Data
                </>
              )}
            </Button>
          </div>

          {isApplicationFound && applicationData && (
            <div className='mt-4 p-4 border rounded-lg'>
              <h3 className='text-lg font-medium mb-2'>Application Details</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <p className='text-sm text-muted-foreground'>Full Name</p>
                  <p>{applicationData.name}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>NIC Number</p>
                  <p>{applicationData.nicNumber}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Gender</p>
                  <p>{applicationData.gender}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Date of Birth</p>
                  <p>{applicationData.dateOfBirth}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
                ${file ? 'bg-background' : 'hover:bg-accent hover:bg-opacity-5'}`}
            >
              <input {...getInputProps()} />
              {!file && (
                <div className='space-y-4'>
                  <Upload className='mx-auto h-12 w-12 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>
                      Drag & drop your document here, or click to select
                    </p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Supports: JPG, JPEG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                </div>
              )}
              {file && preview && (
                <div className='relative aspect-video w-full'>
                  <Image src={preview} alt='Preview' fill className='object-contain' />
                </div>
              )}
            </div>

            <div className='flex gap-2 justify-end'>
              {file && (
                <>
                  <Button variant='outline' size='sm' onClick={handleClear} disabled={isProcessing}>
                    <X className='h-4 w-4 mr-2' />
                    Clear
                  </Button>
                  <Button size='sm' onClick={handleProcess} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className='h-4 w-4 mr-2' />
                        Process Document
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>OCR Results</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className='flex items-center gap-2 text-destructive p-4 rounded-lg border border-destructive/20 bg-destructive/10'>
                  <AlertCircle className='h-4 w-4' />
                  <p className='text-sm'>{error}</p>
                </div>
              ) : results.length === 0 ? (
                <div className='text-center text-muted-foreground py-8'>
                  {isProcessing ? (
                    <div className='flex items-center justify-center gap-2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Processing document...
                    </div>
                  ) : (
                    'Upload and process a document to see results'
                  )}
                </div>
              ) : (
                <div className='space-y-4 max-h-[300px] overflow-y-auto'>
                  {results.map((result, index) => (
                    <div key={index} className='p-4 rounded-lg border bg-card text-card-foreground'>
                      <p className='font-medium'>{result.text}</p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Confidence: {(result.confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {validationResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {validationResults.map((result, index) => (
                    <div key={index} className='flex items-start gap-2 p-3 border rounded-lg'>
                      {result.isMatch ? (
                        <CheckCircle2 className='h-5 w-5 text-green-500 flex-shrink-0 mt-1' />
                      ) : (
                        <XCircle className='h-5 w-5 text-red-500 flex-shrink-0 mt-1' />
                      )}
                      <div className='flex-1'>
                        <p className='font-medium'>{result.field}</p>
                        <div className='grid grid-cols-2 gap-2 mt-1'>
                          <div>
                            <p className='text-xs text-muted-foreground'>OCR Value</p>
                            <p className='text-sm'>{result.ocrValue}</p>
                          </div>
                          <div>
                            <p className='text-xs text-muted-foreground'>Application Value</p>
                            <p className='text-sm'>{result.appValue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className='p-3 border rounded-lg bg-muted/50'>
                    <p className='font-medium mb-1'>Summary</p>
                    <p className='text-sm'>
                      {validationResults.every(r => r.isMatch) ? (
                        <span className='text-green-600'>All fields match! Document is valid.</span>
                      ) : (
                        <span className='text-red-600'>
                          {validationResults.filter(r => r.isMatch).length} of{' '}
                          {validationResults.length} fields match. Some document fields don&apos;t
                          match the application data.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
