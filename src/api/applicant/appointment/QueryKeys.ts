import { AppointmentStatus } from '@/types/appointmentTypes';

export const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (filters: { status?: string; location?: string; date?: string }) =>
    [...APPOINTMENT_KEYS.lists(), filters] as const,
  myAppointments: (status?: AppointmentStatus | undefined) =>
    [...APPOINTMENT_KEYS.all, 'my-appointments', status] as const,
  details: (id: string) => [...APPOINTMENT_KEYS.all, 'details', id] as const,
  availableSlots: (date: string, location: string) =>
    [...APPOINTMENT_KEYS.all, 'available-slots', date, location] as const,
} as const;
