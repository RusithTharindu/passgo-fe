/* eslint-disable @typescript-eslint/no-explicit-any */

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
import axios from 'axios';
import { useUserEmail } from '@/store/useUserStore';

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

async function sendAppointmentEmail(appointment: any, recipientEmail: string) {
  try {
    await axios.post('/api/appointment/send', {
      appointment,
      recipientEmail,
    });
  } catch (error) {
    console.error('Failed to send appointment email:', error);
  }
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const userEmail = useUserEmail();

  return useMutation({
    mutationFn: (data: CreateAppointmentPayload) => appointmentApi.create(data),
    onSuccess: appointment => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.myAppointments() });

      if (userEmail) {
        sendAppointmentEmail(appointment, userEmail);
      }
    },
  });
};

export const useUpdateAppointment = (isAdmin: boolean = false) => {
  const queryClient = useQueryClient();
  const userEmail = useUserEmail();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAppointmentAdminPayload | UpdateAppointmentApplicantPayload;
    }) =>
      isAdmin
        ? appointmentApi.updateAsAdmin(id, data as UpdateAppointmentAdminPayload)
        : appointmentApi.updateAsApplicant(id, data as UpdateAppointmentApplicantPayload),
    onSuccess: (appointment, { id }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.details(id) });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.myAppointments() });

      if (userEmail) {
        console.log('Sending appointment email to:', userEmail);
        sendAppointmentEmail(appointment, userEmail);
      }
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
