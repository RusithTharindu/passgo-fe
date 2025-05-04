export enum RenewPassportStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  READY_TO_COLLECT = 'READY_TO_COLLECT',
}

export enum PassportDocumentType {
  CURRENT_PASSPORT = 'current_passport',
  NIC_FRONT = 'nic_front',
  NIC_BACK = 'nic_back',
  BIRTH_CERT = 'birth_certificate',
  PHOTO = 'passport_photo',
  ADDITIONAL_DOCS = 'additional_documents',
}

export interface PassportRenewalDocuments {
  [PassportDocumentType.CURRENT_PASSPORT]?: string;
  [PassportDocumentType.NIC_FRONT]?: string;
  [PassportDocumentType.NIC_BACK]?: string;
  [PassportDocumentType.BIRTH_CERT]?: string;
  [PassportDocumentType.PHOTO]?: string;
  [PassportDocumentType.ADDITIONAL_DOCS]?: string;
}

export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthdate: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  userId: UserInfo;
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
  __v: number;
}

export type RenewPassportList = RenewPassportResponse[];

export enum RenewalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  READY_TO_COLLECT = 'READY_TO_COLLECT',
  COMPLETED = 'completed',
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface RenewalRequest {
  _id: string;
  requestId: string;
  fullName: string;
  nicNumber: string;
  passportNumber: string;
  contactNumber: string;
  email: string;
  permanentAddress: string;
  documents: Document[];
  status: RenewalStatus;
  adminNotes?: string;
  rejectionReason?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRenewalAdminPayload {
  status?: RenewalStatus;
  adminNotes?: string;
  rejectionReason?: string;
}

export interface PaginatedRenewalRequests {
  items: RenewalRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface RenewalFilters {
  status?: RenewalStatus;
  search?: string;
  page?: number;
  limit?: number;
}
