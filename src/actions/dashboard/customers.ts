'use server';

import { revalidatePath } from 'next/cache';

import { DASHBOARD_ENDPOINTS } from '@/lib/api/dashboard/endpoints';
import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';
import {
  customerCreateSchema,
  customerEditSchema,
  type CustomerCreateFormData,
  type CustomerEditFormData,
} from '@/lib/validations/dashboard/customers';

export interface CustomersActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

function buildPayload(input: CustomerCreateFormData | CustomerEditFormData) {
  const payload: Record<string, unknown> = {
    name: input.name,
    phone: input.phone,
  };
  if (input.email) payload.email = input.email;
  if (input.gender) payload.gender = input.gender;
  if (input.notes) payload.notes = input.notes;
  return payload;
}

function mapException(error: unknown): CustomersActionResult {
  if (error instanceof DashboardApiException) {
    return { success: false, message: error.message };
  }
  return { success: false, message: 'unknownError' };
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
  try {
    await dashboardApi.post(DASHBOARD_ENDPOINTS.customers.create, buildPayload(parsed.data));
    revalidatePath('/[locale]/dashboard/customers', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function updateCustomerAction(
  customerId: string,
  input: CustomerEditFormData,
): Promise<CustomersActionResult> {
  const parsed = customerEditSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    await dashboardApi.put(DASHBOARD_ENDPOINTS.customers.update(customerId), buildPayload(parsed.data));
    revalidatePath('/[locale]/dashboard/customers', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function deleteCustomerAction(
  customerId: string,
): Promise<CustomersActionResult> {
  try {
    await dashboardApi.delete(DASHBOARD_ENDPOINTS.customers.delete(customerId));
    revalidatePath('/[locale]/dashboard/customers', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function banCustomerAction(
  customerId: string,
  isBanned: boolean,
  banReason?: string,
): Promise<CustomersActionResult> {
  try {
    await dashboardApi.patch(DASHBOARD_ENDPOINTS.customers.ban(customerId), {
      is_banned: isBanned,
      ban_reason: banReason ?? null,
    });
    revalidatePath('/[locale]/dashboard/customers', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}
