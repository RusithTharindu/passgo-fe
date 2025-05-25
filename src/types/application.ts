import { z } from 'zod';

export enum CollectionLocation {
  COLOMBO = 'Colombo',
  KANDY = 'Kandy',
  GALLE = 'Galle',
  JAFFNA = 'Jaffna',
  BATTICALOA = 'Batticaloa',
  KURUNEGALA = 'Kurunegala',
}

export const ApplicationStatus = {
  PENDING: 'pending',
  DOCUMENT_VERIFICATION: 'document_verification',
  BIOMETRIC_PENDING: 'biometric_pending',
  BIOMETRIC_COMPLETED: 'biometric_completed',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_COMPLETED: 'payment_completed',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const DocumentType = {
  NIC_FRONT: 'nic_front',
  NIC_BACK: 'nic_back',
  BIRTH_CERT_FRONT: 'birth_cert_front',
  BIRTH_CERT_BACK: 'birth_cert_back',
  USER_PHOTO: 'user_photo',
  DUAL_CITIZENSHIP: 'dual_citizenship',
} as const;

export type NewPassportDocumentType = {
  NIC_FRONT: 'nic-front';
  NIC_BACK: 'nic-back';
  BIRTH_CERTIFICATE: 'birth-certificate';
  PASSPORT_PHOTO: 'passport-photo';
  ADDITIONAL_DOCUMENTS: 'additional-documents';
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export interface DocumentVerification {
  documentType: DocumentType;
  verified: boolean;
  verificationDate?: Date;
}

export interface Application {
  id: string;
  _id: string;
  typeOfService: 'normal' | 'oneDay';
  TypeofTravelDocument: 'all' | 'middleEast' | 'emergencyCertificate' | 'identityCertificate';
  presentTravelDocument?: string;
  nmrpNumber?: string;
  nationalIdentityCardNumber: string;
  surname: string;
  otherNames: string;
  gender?: 'male' | 'female';
  birthdate?: string;
  permanentAddress: string;
  permenantAddressDistrict: string;
  birthCertificateNumber: string;
  birthCertificateDistrict: string;
  placeOfBirth: string;
  sex: 'male' | 'female';
  profession: string;
  isDualCitizen: boolean;
  dualCitizeshipNumber?: string;
  foreignNationality?: string;
  foreignPassportNumber?: string;
  isChild?: boolean;
  childFatherPassportNumber?: string;
  childMotherPassportNumber?: string;
  mobileNumber: string;
  emailAddress: string;
  landlineNumber?: string;
  collectionLocation: CollectionLocation;
  documentVerification?: DocumentVerification[];
  biometricAppointmentDate?: string;
  biometricAppointmentTime?: string;
  photoVerified?: boolean;
  fingerprintVerified?: boolean;
  counterNumber?: string;
  paymentAmount?: number;
  paymentReference?: string;
  studioPhotoUrl: string;
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: string;
  rejectionReason?: string;
  // documents: Array<{
  //   id: string;
  //   name: string;
  //   url: string;
  //   type: string;
  // }>;
  documents?: string[];
  nicPhotos: {
    front?: string;
    back?: string;
  };
  birthCertificatePhotos: {
    front?: string;
    back?: string;
  };
  userPhoto?: string;
  declaration?: boolean;
}

export const applicationSchema = z.object({
  typeOfService: z.enum(['normal', 'oneDay']),
  TypeofTravelDocument: z.enum([
    'all',
    'middleEast',
    'emergencyCertificate',
    'identityCertificate',
  ]),
  presentTravelDocument: z.string().optional(),
  nmrpNumber: z.string().optional(),
  nationalIdentityCardNumber: z.string().min(10).max(12),
  surname: z.string().min(1),
  otherNames: z.string().min(1),
  gender: z.enum(['male', 'female']).optional(),
  birthdate: z.string().optional(),
  permanentAddress: z.string().min(1),
  permenantAddressDistrict: z.string().min(1),
  birthCertificateNumber: z.string().min(1),
  birthCertificateDistrict: z.string().min(1),
  placeOfBirth: z.string().min(1),
  sex: z.enum(['male', 'female']),
  profession: z.string().min(1),
  isDualCitizen: z.boolean(),
  dualCitizeshipNumber: z.string().optional().nullable(),
  foreignNationality: z.string().optional().nullable(),
  foreignPassportNumber: z.string().optional().nullable(),
  isChild: z.boolean().default(false),
  childFatherPassportNumber: z.string().optional().nullable(),
  childMotherPassportNumber: z.string().optional().nullable(),
  mobileNumber: z.string().min(10),
  landlineNumber: z.string().optional(),
  emailAddress: z.string().email(),
  collectionLocation: z.nativeEnum(CollectionLocation),
  declaration: z.boolean().optional().default(false),
});
