export enum RenewPassportStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum PassportDocumentType {
  CURRENT_PASSPORT = 'current-passport',
  NIC_FRONT = 'nic-front',
  NIC_BACK = 'nic-back',
  BIRTH_CERT = 'birth-certificate',
  PHOTO = 'passport-photo',
  ADDITIONAL_DOCS = 'additional-documents',
}

export interface PassportRenewalDocuments {
  [PassportDocumentType.CURRENT_PASSPORT]?: string;
  [PassportDocumentType.NIC_FRONT]?: string;
  [PassportDocumentType.NIC_BACK]?: string;
  [PassportDocumentType.BIRTH_CERT]?: string;
  [PassportDocumentType.PHOTO]?: string;
  [PassportDocumentType.ADDITIONAL_DOCS]?: string;
}

export interface RenewPassportRequest {
  fullName: string;
  dateOfBirth: string;
  nicNumber: string;
  currentPassportNumber: string;
  currentPassportExpiryDate: string;
  address: string;
  contactNumber: string;
  email: string;
  documents: PassportRenewalDocuments;
}

export interface RenewPassportResponse {
  _id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  nicNumber: string;
  currentPassportNumber: string;
  currentPassportExpiryDate: string;
  address: string;
  contactNumber: string;
  email: string;
  documents: PassportRenewalDocuments;
  status: RenewPassportStatus;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export type RenewPassportList = RenewPassportResponse[];
