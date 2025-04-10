import { z } from 'zod';

export const SignUpSchema = z
  .object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    confirmEmail: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    birthdate: z
      .string()
      .refine(
        date => {
          // Check if a date is provided
          if (!date) return false;

          // Check if it's a valid date
          const birthDate = new Date(date);
          if (isNaN(birthDate.getTime())) return false;

          // Check if birthdate is not in the future
          return birthDate <= new Date();
        },
        { message: 'Please enter a valid birthdate (not in the future)' },
      )
      .refine(
        date => {
          // Check age is at least 13 years
          const birthDate = new Date(date);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          // If the birth month is after the current month or
          // if birth month is the current month but the birth day is after today
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 13;
          }

          return age >= 13;
        },
        { message: 'You must be at least 13 years old to register' },
      ),
  })
  .refine(data => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ['confirmEmail'],
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
