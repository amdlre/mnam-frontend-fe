'use server';

import { api, ApiException } from '@/lib/api/fetcher';
import { contactSchema } from '@/lib/validations/common';

import type { ActionResult } from './auth';

export async function submitContactForm(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    message: formData.get('message') as string,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await api.post('/contact', parsed.data, { noAuth: true });
    return { success: true, message: 'تم إرسال رسالتك بنجاح' };
  } catch (error) {
    if (error instanceof ApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}
