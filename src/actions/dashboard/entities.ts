'use server';

import { revalidatePath } from 'next/cache';

import { DASHBOARD_ENDPOINTS } from '@/lib/api/dashboard/endpoints';
import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';
import {
  bookingCreateSchema,
  ownerCreateSchema,
  projectCreateSchema,
  unitCreateSchema,
  type BookingCreateFormData,
  type OwnerCreateFormData,
  type ProjectCreateFormData,
  type UnitCreateFormData,
} from '@/lib/validations/dashboard/entities';

export interface EntityActionResult {
  success: boolean;
  id?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

function mapException(error: unknown): EntityActionResult {
  if (error instanceof DashboardApiException) {
    return { success: false, message: error.message };
  }
  return { success: false, message: 'unknownError' };
}

// ─── Owner ──────────────────────────────────────────────────
export async function createOwnerAction(
  input: OwnerCreateFormData,
): Promise<EntityActionResult> {
  const parsed = ownerCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    const res = await dashboardApi.post<{ id: string }>(DASHBOARD_ENDPOINTS.owners.create, {
      ...parsed.data,
      paypal_email: parsed.data.paypal_email || null,
    });
    revalidatePath('/[locale]/dashboard/owners', 'page');
    return { success: true, id: res?.id };
  } catch (error) {
    return mapException(error);
  }
}

export async function deleteOwnerAction(ownerId: string): Promise<EntityActionResult> {
  try {
    await dashboardApi.delete(DASHBOARD_ENDPOINTS.owners.delete(ownerId));
    revalidatePath('/[locale]/dashboard/owners', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

// ─── Project ────────────────────────────────────────────────
export async function createProjectAction(
  input: ProjectCreateFormData,
): Promise<EntityActionResult> {
  const parsed = projectCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    const res = await dashboardApi.post<{ id: string }>(DASHBOARD_ENDPOINTS.projects.create, parsed.data);
    revalidatePath('/[locale]/dashboard/projects', 'page');
    return { success: true, id: res?.id };
  } catch (error) {
    return mapException(error);
  }
}

export async function deleteProjectAction(projectId: string): Promise<EntityActionResult> {
  try {
    await dashboardApi.delete(DASHBOARD_ENDPOINTS.projects.delete(projectId));
    revalidatePath('/[locale]/dashboard/projects', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

// ─── Unit ───────────────────────────────────────────────────
export async function createUnitAction(
  input: UnitCreateFormData,
): Promise<EntityActionResult> {
  const parsed = unitCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    const res = await dashboardApi.post<{ id: string }>(DASHBOARD_ENDPOINTS.units.create, parsed.data);
    revalidatePath('/[locale]/dashboard/units', 'page');
    return { success: true, id: res?.id };
  } catch (error) {
    return mapException(error);
  }
}

// ─── Booking ────────────────────────────────────────────────
export async function createBookingAction(
  input: BookingCreateFormData,
): Promise<EntityActionResult> {
  const parsed = bookingCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    const res = await dashboardApi.post<{ id: string }>(DASHBOARD_ENDPOINTS.bookings.create, parsed.data);
    revalidatePath('/[locale]/dashboard/bookings', 'page');
    return { success: true, id: res?.id };
  } catch (error) {
    return mapException(error);
  }
}
