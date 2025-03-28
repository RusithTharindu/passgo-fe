import { LoginSchema } from '@/utils/validation/LoginSchema';
import { SignUpSchema } from '@/utils/validation/SignUpSchema';
import { z } from 'zod';

export type LoginFormValues = z.infer<typeof LoginSchema>;

export type SignUpFormValues = z.infer<typeof SignUpSchema>;
