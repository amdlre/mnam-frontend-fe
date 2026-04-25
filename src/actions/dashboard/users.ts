'use server';

import { revalidatePath } from 'next/cache';

import { DASHBOARD_ENDPOINTS } from '@/lib/api/dashboard/endpoints';
import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';
import {
  userCreateSchema,
  userEditSchema,
  type UserCreateFormData,
  type UserEditFormData,
} from '@/lib/validations/dashboard/users';

export interface UsersActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function createUserAction(
  input: UserCreateFormData,
): Promise<UsersActionResult> {
  const parsed = userCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await dashboardApi.post(DASHBOARD_ENDPOINTS.users.create, parsed.data);
    revalidatePath('/[locale]/dashboard/users', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}

export async function updateUserAction(
  userId: string,
  input: UserEditFormData,
): Promise<UsersActionResult> {
  const parsed = userEditSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    await dashboardApi.put(DASHBOARD_ENDPOINTS.users.update(userId), parsed.data);
    revalidatePath('/[locale]/dashboard/users', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}

export async function deleteUserAction(
  userId: string,
  permanent = false,
): Promise<UsersActionResult> {
  try {
    await dashboardApi.delete(DASHBOARD_ENDPOINTS.users.delete(userId, permanent));
    revalidatePath('/[locale]/dashboard/users', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}

export async function toggleUserActiveAction(userId: string): Promise<UsersActionResult> {
  try {
    await dashboardApi.patch(DASHBOARD_ENDPOINTS.users.toggleActive(userId));
    revalidatePath('/[locale]/dashboard/users', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}
