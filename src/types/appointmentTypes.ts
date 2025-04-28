// types/appointment.ts

// Enums
export enum AppointmentLocation {
  COLOMBO = 'Colombo',
  KANDY = 'Kandy',
  MATARA = 'Matara',
  VAVUNIYA = 'Vavuniya',
  REGIONAL_OFFICE = 'Regional Office',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// Create Appointment Request
export interface CreateAppointmentPayload {
  fullName: string;
  permanentAddress: string;
  nicNumber: string;
  contactNumber: string;
  preferredLocation: AppointmentLocation;
  preferredDate: string; // format: "YYYY-MM-DD"
  preferredTime: string; // format: "HH:mm" (24-hour)
  reason: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  location?: string;
  date?: string;
}

// Update Appointment Request (for Applicants)
export interface UpdateAppointmentApplicantPayload {
  preferredDate?: string;
  preferredTime?: string;
  preferredLocation?: AppointmentLocation;
  contactNumber?: string;
  reason?: string;
}

// Update Appointment Request (for Admin/Manager)
export interface UpdateAppointmentAdminPayload {
  status?: AppointmentStatus;
  adminNotes?: string;
  rejectionReason?: string;
  isTimeSlotConfirmed?: boolean;
}

// Full Appointment Response Type
export interface Appointment {
  id: string;
  appointmentId: string;
  fullName: string;
  permanentAddress: string;
  nicNumber: string;
  contactNumber: string;
  preferredLocation: AppointmentLocation;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  status: AppointmentStatus;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  adminNotes?: string;
  rejectionReason?: string;
  isTimeSlotConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAppointments {
  items: Appointment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type AvailableTimeSlots = string[];
