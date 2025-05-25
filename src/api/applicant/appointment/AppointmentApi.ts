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

export const appointmentApi = {
  create: (data: CreateAppointmentPayload) =>
    AxiosInstance.post<Appointment>(APPOINTMENT_ENDPOINTS.CREATE, data).then(res => res.data),

  getAll: (filters?: AppointmentFilters) =>
    AxiosInstance.get<PaginatedAppointments>(APPOINTMENT_ENDPOINTS.GET_ALL, {
      params: filters,
    }).then(res => res.data),

  getMyAppointments: (status?: AppointmentStatus) =>
    AxiosInstance.get<Appointment[]>(APPOINTMENT_ENDPOINTS.GET_MY_APPOINTMENTS, {
      params: { status },
    }).then(res => res.data),

  getOne: (id: string) =>
    AxiosInstance.get<Appointment>(APPOINTMENT_ENDPOINTS.GET_ONE(id)).then(res => res.data),

  updateAsApplicant: (id: string, data: UpdateAppointmentApplicantPayload) =>
    AxiosInstance.patch<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), data).then(res => res.data),

  updateAsAdmin: (id: string, data: UpdateAppointmentAdminPayload) =>
    AxiosInstance.patch<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), data).then(res => res.data),

  delete: (id: string) =>
    AxiosInstance.delete<{ message: string }>(APPOINTMENT_ENDPOINTS.DELETE(id)).then(
      res => res.data,
    ),

  getAvailableSlots: (date: string, location: AppointmentLocation) =>
    AxiosInstance.get<AvailableTimeSlots>(APPOINTMENT_ENDPOINTS.AVAILABLE_SLOTS, {
      params: { date, location },
    }).then(res => res.data),
};
