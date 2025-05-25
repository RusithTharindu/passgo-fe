import * as z from 'zod';
import { PassportDocumentType } from '@/types/passportRenewalTypes';

export const passportRenewalDocumentsSchema = z.object({
  [PassportDocumentType.CURRENT_PASSPORT]: z.string().optional(),
  [PassportDocumentType.NIC_FRONT]: z.string().optional(),
  [PassportDocumentType.NIC_BACK]: z.string().optional(),
  [PassportDocumentType.BIRTH_CERT]: z.string().optional(),
  [PassportDocumentType.PHOTO]: z.string().optional(),
  [PassportDocumentType.ADDITIONAL_DOCS]: z.string().optional(),
});

export const passportRenewalSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  nicNumber: z
    .string()
    .min(1, { message: 'NIC number is required' })
    .regex(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, {
      message: 'Invalid NIC format (e.g., 123456789V or 12 digits)',
    }),
  currentPassportNumber: z.string().min(1, { message: 'Current passport number is required' }),
  currentPassportExpiryDate: z.string().min(1, { message: 'Passport expiry date is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  contactNumber: z
    .string()
    .min(1, { message: 'Contact number is required' })
    .regex(/^\+?[0-9]{10,15}$/, {
      message: 'Invalid phone number format (e.g., +94XXXXXXXXX)',
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  documents: passportRenewalDocumentsSchema,
});

export type PassportRenewalFormValues = z.infer<typeof passportRenewalSchema>;

// Schema for the final step validation (documents)
export const documentValidationSchema = z.object({
  documents: z.object({
    [PassportDocumentType.CURRENT_PASSPORT]: z.string().min(1, {
      message: 'Current passport scan is required',
    }),
    [PassportDocumentType.NIC_FRONT]: z.string().min(1, {
      message: 'NIC front scan is required',
    }),
    [PassportDocumentType.NIC_BACK]: z.string().min(1, {
      message: 'NIC back scan is required',
    }),
    [PassportDocumentType.BIRTH_CERT]: z.string().min(1, {
      message: 'Birth certificate scan is required',
    }),
    [PassportDocumentType.PHOTO]: z.string().min(1, {
      message: 'Passport photo is required',
    }),
    [PassportDocumentType.ADDITIONAL_DOCS]: z.string().optional(),
  }),
});
