import {
  CreateAppointmentPayload,
  Appointment,
  AppointmentStatus,
  UpdateAppointmentApplicantPayload,
  UpdateAppointmentAdminPayload,
  AppointmentLocation,
  AppointmentFilters,
  PaginatedAppointments,
  AvailableTimeSlots,
} from '@/types/appointmentTypes';
import AxiosInstance from '@/utils/helpers/axiosApi';
import { APPOINTMENT_ENDPOINTS } from './ApiEndPoints';

// Create new appointment
export const appointmentApi = {
  create: (data: CreateAppointmentPayload) =>
    AxiosInstance.post<Appointment>(APPOINTMENT_ENDPOINTS.CREATE, data).then(res => res.data),

  // Get all appointments (admin/manager)
  getAll: (filters?: AppointmentFilters) =>
    AxiosInstance.get<PaginatedAppointments>(APPOINTMENT_ENDPOINTS.GET_ALL, {
      params: filters,
    }).then(res => res.data),

  // Get logged-in user's appointments
  getMyAppointments: (status?: AppointmentStatus) =>
    AxiosInstance.get<Appointment[]>(APPOINTMENT_ENDPOINTS.GET_MY_APPOINTMENTS, {
      params: { status },
    }).then(res => res.data),

  // Get single appointment details
  getOne: (id: string) =>
    AxiosInstance.get<Appointment>(APPOINTMENT_ENDPOINTS.GET_ONE(id)).then(res => res.data),

  // Update appointment (for applicants)
  updateAsApplicant: (id: string, data: UpdateAppointmentApplicantPayload) =>
    AxiosInstance.patch<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), data).then(res => res.data),

  // Update appointment (for admin/manager)
  updateAsAdmin: (id: string, data: UpdateAppointmentAdminPayload) =>
    AxiosInstance.patch<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), data).then(res => res.data),

  // Delete appointment
  delete: (id: string) =>
    AxiosInstance.delete<{ message: string }>(APPOINTMENT_ENDPOINTS.DELETE(id)).then(
      res => res.data,
    ),

  // Get available time slots
  getAvailableSlots: (date: string, location: AppointmentLocation) =>
    AxiosInstance.get<AvailableTimeSlots>(APPOINTMENT_ENDPOINTS.AVAILABLE_SLOTS, {
      params: { date, location },
    }).then(res => res.data),
};
