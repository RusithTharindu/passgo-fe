export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_VERIFIED = 'payment_verified',
  COUNTER_VERIFICATION = 'counter_verification',
  BIOMETRICS_PENDING = 'biometrics_pending',
  BIOMETRICS_COMPLETED = 'biometrics_completed',
  CONTROLLER_REVIEW = 'controller_review',
  SENIOR_OFFICER_REVIEW = 'senior_officer_review',
  DATA_ENTRY = 'data_entry',
  PRINTING_PENDING = 'printing_pending',
  PRINTING = 'printing',
  QUALITY_ASSURANCE = 'quality_assurance',
  READY_FOR_COLLECTION = 'ready_for_collection',
  COLLECTED = 'collected',
  REJECTED = 'rejected',
  ON_HOLD = 'on_hold',
}

export enum CollectionLocation {
  COLOMBO = 'Colombo',
  KANDY = 'Kandy',
  MATARA = 'Matara',
  VAVUNIYA = 'Vavuniya',
  REGIONAL_OFFICE = 'Regional Office',
}

export type DocumentVerification = {
  documentType: 'birth_certificate' | 'nic';
  verified: boolean;
  verificationDate?: Date;
};

export type StatusHistoryItem = {
  status: ApplicationStatus;
  timestamp: Date;
  comment?: string;
};

export interface Application {
  _id: string;
  typeOfService: 'normal' | 'oneDay';
  TypeofTravelDocument: 'all' | 'middleEast' | 'emergencyCertificate' | 'identityCertificate';
  presentTravelDocument?: string;
  nmrpNumber?: string;
  nationalIdentityCardNumber: string;
  surname: string;
  otherNames: string;
  permanentAddress: string;
  permenantAddressDistrict: string;
  birthdate: string;
  birthCertificateNumber: string;
  birthCertificateDistrict: string;
  placeOfBirth: string;
  sex: 'male' | 'female';
  profession: string;
  isDualCitizen: boolean;
  dualCitizeshipNumber?: string;
  mobileNumber: string;
  emailAddress: string;
  foreignNationality?: string;
  foreignPassportNumber?: string;
  isChild?: boolean;
  childFatherPassportNumber?: string;
  childMotherPassportNumber?: string;
  submittedBy: string;
  status: ApplicationStatus;
  statusHistory: StatusHistoryItem[];
  expectedCompletionDate?: Date;
  appointmentDate?: Date;
  appointmentTime?: string;
  rejectionReason?: string;
  paymentAmount?: number;
  paymentReference?: string;
  passportNumber?: string;
  collectionLocation: CollectionLocation;
  documentVerification: DocumentVerification[];
  biometricAppointmentDate?: Date;
  biometricAppointmentTime?: string;
  photoVerified: boolean;
  fingerprintVerified?: boolean;
  studioPhotoUrl: string;
  counterNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// For creating new applications
export type CreateApplicationPayload = Omit<
  Application,
  | '_id'
  | 'submittedBy'
  | 'status'
  | 'statusHistory'
  | 'createdAt'
  | 'updatedAt'
  | 'photoVerified'
  | 'expectedCompletionDate'
  | 'passportNumber'
  | 'rejectionReason'
>;

// For updating applications
export type UpdateApplicationPayload = Partial<CreateApplicationPayload>;

// Response type for listing applications
export type ApplicationResponse = {
  items: Application[];
  total: number;
  page: number;
  limit: number;
};
