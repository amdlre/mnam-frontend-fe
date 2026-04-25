import { z } from 'zod';

export const customerCreateSchema = z.object({
  name: z.string().min(2, { message: 'nameTooShort' }),
  phone: z
    .string()
    .min(1, { message: 'required' })
    .regex(/^\d{9,15}$/, { message: 'phoneInvalid' }),
  email: z.string().email({ message: 'emailInvalid' }).optional().or(z.literal('')),
  gender: z.enum(['male', 'female']).optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type CustomerCreateFormData = z.infer<typeof customerCreateSchema>;

export const customerEditSchema = customerCreateSchema;
export type CustomerEditFormData = z.infer<typeof customerEditSchema>;
