// utils/statusTransitions.ts
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
  ON_HOLD = 'on_hold',
  REJECTED = 'rejected',
}

export const StatusTransitionMap: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.SUBMITTED]: [ApplicationStatus.PAYMENT_PENDING, ApplicationStatus.REJECTED],
  [ApplicationStatus.PAYMENT_PENDING]: [
    ApplicationStatus.PAYMENT_VERIFIED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.PAYMENT_VERIFIED]: [
    ApplicationStatus.COUNTER_VERIFICATION,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.COUNTER_VERIFICATION]: [
    ApplicationStatus.BIOMETRICS_PENDING,
    ApplicationStatus.ON_HOLD,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.BIOMETRICS_PENDING]: [
    ApplicationStatus.BIOMETRICS_COMPLETED,
    ApplicationStatus.ON_HOLD,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.BIOMETRICS_COMPLETED]: [
    ApplicationStatus.CONTROLLER_REVIEW,
    ApplicationStatus.ON_HOLD,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.CONTROLLER_REVIEW]: [
    ApplicationStatus.SENIOR_OFFICER_REVIEW,
    ApplicationStatus.ON_HOLD,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.SENIOR_OFFICER_REVIEW]: [
    ApplicationStatus.DATA_ENTRY,
    ApplicationStatus.ON_HOLD,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.DATA_ENTRY]: [
    ApplicationStatus.PRINTING_PENDING,
    ApplicationStatus.ON_HOLD,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.PRINTING_PENDING]: [ApplicationStatus.PRINTING, ApplicationStatus.ON_HOLD],
  [ApplicationStatus.PRINTING]: [ApplicationStatus.QUALITY_ASSURANCE],
  [ApplicationStatus.QUALITY_ASSURANCE]: [
    ApplicationStatus.READY_FOR_COLLECTION,
    ApplicationStatus.PRINTING,
  ],
  [ApplicationStatus.READY_FOR_COLLECTION]: [ApplicationStatus.COLLECTED],
  [ApplicationStatus.ON_HOLD]: [
    ApplicationStatus.COUNTER_VERIFICATION,
    ApplicationStatus.BIOMETRICS_PENDING,
    ApplicationStatus.CONTROLLER_REVIEW,
    ApplicationStatus.SENIOR_OFFICER_REVIEW,
    ApplicationStatus.DATA_ENTRY,
    ApplicationStatus.PRINTING_PENDING,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.COLLECTED]: [],
  [ApplicationStatus.REJECTED]: [],
};

// Helper function to get valid next statuses
export function getValidNextStatuses(currentStatus: ApplicationStatus): ApplicationStatus[] {
  return StatusTransitionMap[currentStatus] || [];
}

// Helper function to check if a status transition is valid
export function isValidStatusTransition(
  currentStatus: ApplicationStatus,
  newStatus: ApplicationStatus,
): boolean {
  return getValidNextStatuses(currentStatus).includes(newStatus);
}

// Format status for display
export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Get application status description
export function getStatusDescription(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.SUBMITTED:
      return 'Application has been submitted';
    case ApplicationStatus.PAYMENT_PENDING:
      return 'Payment is pending';
    case ApplicationStatus.PAYMENT_VERIFIED:
      return 'Payment has been verified';
    case ApplicationStatus.COUNTER_VERIFICATION:
      return 'Application is being verified at the counter';
    case ApplicationStatus.BIOMETRICS_PENDING:
      return 'Biometric data collection is pending';
    case ApplicationStatus.BIOMETRICS_COMPLETED:
      return 'Biometric data has been collected';
    case ApplicationStatus.CONTROLLER_REVIEW:
      return 'Application is under controller review';
    case ApplicationStatus.SENIOR_OFFICER_REVIEW:
      return 'Application is under senior officer review';
    case ApplicationStatus.DATA_ENTRY:
      return 'Application data is being entered';
    case ApplicationStatus.PRINTING_PENDING:
      return 'Passport is pending printing';
    case ApplicationStatus.PRINTING:
      return 'Passport is being printed';
    case ApplicationStatus.QUALITY_ASSURANCE:
      return 'Passport is undergoing quality assurance';
    case ApplicationStatus.READY_FOR_COLLECTION:
      return 'Passport is ready for collection';
    case ApplicationStatus.COLLECTED:
      return 'Passport has been collected';
    case ApplicationStatus.ON_HOLD:
      return 'Application is on hold';
    case ApplicationStatus.REJECTED:
      return 'Application has been rejected';
    default:
      return 'Unknown status';
  }
}
