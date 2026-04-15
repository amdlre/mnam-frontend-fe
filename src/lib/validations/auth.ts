import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'البريد الإلكتروني مطلوب' })
    .email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z
    .string()
    .min(1, { message: 'كلمة المرور مطلوبة' })
    .min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'الاسم مطلوب' })
      .min(2, { message: 'الاسم يجب أن يكون حرفين على الأقل' }),
    email: z
      .string()
      .min(1, { message: 'البريد الإلكتروني مطلوب' })
      .email({ message: 'البريد الإلكتروني غير صالح' }),
    password: z
      .string()
      .min(1, { message: 'كلمة المرور مطلوبة' })
      .min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }),
    password_confirmation: z.string().min(1, { message: 'تأكيد كلمة المرور مطلوب' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'كلمة المرور غير متطابقة',
    path: ['password_confirmation'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
