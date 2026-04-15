import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, { message: 'الاسم مطلوب' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  phone: z.string().optional(),
  message: z
    .string()
    .min(1, { message: 'الرسالة مطلوبة' })
    .min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل' }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
