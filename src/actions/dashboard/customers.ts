'use server';

import { revalidatePath } from 'next/cache';

import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';
import {
  customerCreateSchema,
  type CustomerCreateFormData,
} from '@/lib/validations/dashboard/customers';

export interface CustomersActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function createCustomerAction(
  input: CustomerCreateFormData,
): Promise<CustomersActionResult> {
  const parsed = customerCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const payload: Record<string, unknown> = {
    name: parsed.data.name,
    phone: parsed.data.phone,
  };
  if (parsed.data.email) payload.email = parsed.data.email;
  if (parsed.data.gender) payload.gender = parsed.data.gender;
  if (parsed.data.notes) payload.notes = parsed.data.notes;

  try {
    await dashboardApi.post('/api/customers', payload);
    revalidatePath('/[locale]/dashboard/customers', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}
