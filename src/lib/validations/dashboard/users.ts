import { z } from 'zod';

export const userCreateSchema = z.object({
  first_name: z.string().min(1, { message: 'firstNameRequired' }),
  last_name: z.string(),
  username: z
    .string()
    .min(1, { message: 'usernameRequired' })
    .min(3, { message: 'usernameTooShort' }),
  email: z.string().min(1, { message: 'emailRequired' }).email({ message: 'emailInvalid' }),
  password: z
    .string()
    .min(1, { message: 'passwordRequired' })
    .min(6, { message: 'passwordTooShort' }),
  phone: z.string(),
  role: z.string().min(1, { message: 'roleRequired' }),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;

export const userEditSchema = z.object({
  first_name: z.string().min(1, { message: 'firstNameRequired' }),
  last_name: z.string(),
  email: z.string().min(1, { message: 'emailRequired' }).email({ message: 'emailInvalid' }),
  phone: z.string(),
  role: z.string().min(1, { message: 'roleRequired' }),
  is_active: z.boolean(),
});

export type UserEditFormData = z.infer<typeof userEditSchema>;
