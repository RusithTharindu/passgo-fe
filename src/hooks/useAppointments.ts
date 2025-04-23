import { appointmentApi } from '@/api/applicant/appointment/AppointmentApi';
import { APPOINTMENT_KEYS } from '@/api/applicant/appointment/QueryKeys';
import {
  AppointmentFilters,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentAdminPayload,
  UpdateAppointmentApplicantPayload,
  AppointmentLocation,
} from '@/types/appointmentTypes';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.list(filters || {}),
    queryFn: () => appointmentApi.getAll(filters || {}),
  });
};

export const useMyAppointments = (status?: AppointmentStatus) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.myAppointments(status),
    queryFn: () => appointmentApi.getMyAppointments(status),
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.details(id),
    queryFn: () => appointmentApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentPayload) => appointmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.myAppointments() });
    },
  });
};

export const useUpdateAppointment = (isAdmin: boolean = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof isAdmin extends true
        ? UpdateAppointmentAdminPayload
        : UpdateAppointmentApplicantPayload;
    }) =>
      isAdmin
        ? appointmentApi.updateAsAdmin(id, data as UpdateAppointmentAdminPayload)
        : appointmentApi.updateAsApplicant(id, data as UpdateAppointmentApplicantPayload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.details(id) });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.myAppointments() });
    },
  });
};

export const useAvailableSlots = (date: string, location: AppointmentLocation) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.availableSlots(date, location),
    queryFn: () => appointmentApi.getAvailableSlots(date, location),
    enabled: !!date && !!location,
  });
};
