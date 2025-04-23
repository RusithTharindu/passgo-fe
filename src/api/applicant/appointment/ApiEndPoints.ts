export const APPOINTMENT_ENDPOINTS = {
  BASE: '/appointments',
  CREATE: '/appointments',
  GET_ALL: '/appointments',
  GET_MY_APPOINTMENTS: '/appointments/my-appointments',
  GET_ONE: (id: string) => `/appointments/${id}`,
  UPDATE: (id: string) => `/appointments/${id}`,
  DELETE: (id: string) => `/appointments/${id}`,
  AVAILABLE_SLOTS: '/appointments/available-slots',
} as const;
