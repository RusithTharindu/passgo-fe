import { AppointmentLocation } from '@/types/appointmentTypes';
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
  nicNumber: z.string().regex(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, 'Invalid NIC number'),
  contactNumber: z.string().regex(/^\+94[0-9]{9}$/, 'Invalid contact number format'),
  preferredLocation: z.nativeEnum(AppointmentLocation),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  preferredTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  reason: z.string().min(1, 'Reason is required'),
});
