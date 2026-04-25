'use server';

import { revalidatePath } from 'next/cache';

import { DASHBOARD_ENDPOINTS } from '@/lib/api/dashboard/endpoints';
import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';
import {
  bookingCreateSchema,
  ownerCreateSchema,
  ownerEditSchema,
  projectCreateSchema,
  projectEditSchema,
  unitCreateSchema,
  unitEditSchema,
  type BookingCreateFormData,
  type OwnerCreateFormData,
  type OwnerEditFormData,
  type ProjectCreateFormData,
  type ProjectEditFormData,
  type UnitCreateFormData,
  type UnitEditFormData,
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

export async function updateOwnerAction(
  ownerId: string,
  input: OwnerEditFormData,
): Promise<EntityActionResult> {
  const parsed = ownerEditSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    await dashboardApi.put(DASHBOARD_ENDPOINTS.owners.byId(ownerId), {
      ...parsed.data,
      paypal_email: parsed.data.paypal_email || null,
    });
    revalidatePath('/[locale]/dashboard/owners', 'page');
    return { success: true, id: ownerId };
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

export async function updateProjectAction(
  projectId: string,
  input: ProjectEditFormData,
): Promise<EntityActionResult> {
  const parsed = projectEditSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    await dashboardApi.put(DASHBOARD_ENDPOINTS.projects.byId(projectId), parsed.data);
    revalidatePath('/[locale]/dashboard/projects', 'page');
    return { success: true, id: projectId };
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
    const base = parsed.data.base_weekday_price;
    const markup = parsed.data.weekend_markup_percent;
    const payload = {
      project_id: parsed.data.project_id,
      unit_name: parsed.data.unit_name,
      unit_type: parsed.data.unit_type,
      rooms: parsed.data.rooms,
      floor_number: parsed.data.floor_number,
      unit_area: parsed.data.unit_area,
      status: parsed.data.status,
      price_days_of_week: base,
      price_in_weekends: Math.round(base * (1 + markup / 100) * 100) / 100,
      amenities: parsed.data.amenities,
      description: parsed.data.description || null,
      permit_no: parsed.data.permit_no || null,
      access_info: parsed.data.access_info || null,
      booking_links: parsed.data.booking_links,
      discount_16_percent: parsed.data.discount_16_percent,
      discount_21_percent: parsed.data.discount_21_percent,
      discount_23_percent: parsed.data.discount_23_percent,
    };
    const res = await dashboardApi.post<{ id: string }>(DASHBOARD_ENDPOINTS.units.create, payload);
    revalidatePath('/[locale]/dashboard/units', 'page');
    return { success: true, id: res?.id };
  } catch (error) {
    return mapException(error);
  }
}

export async function updateUnitAction(
  unitId: string,
  input: UnitEditFormData,
): Promise<EntityActionResult> {
  const parsed = unitEditSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    const base = parsed.data.base_weekday_price;
    const markup = parsed.data.weekend_markup_percent;
    const payload = {
      project_id: parsed.data.project_id,
      unit_name: parsed.data.unit_name,
      unit_type: parsed.data.unit_type,
      rooms: parsed.data.rooms,
      floor_number: parsed.data.floor_number,
      unit_area: parsed.data.unit_area,
      status: parsed.data.status,
      price_days_of_week: base,
      price_in_weekends: Math.round(base * (1 + markup / 100) * 100) / 100,
      amenities: parsed.data.amenities,
      description: parsed.data.description || null,
      permit_no: parsed.data.permit_no || null,
      access_info: parsed.data.access_info || null,
      booking_links: parsed.data.booking_links,
      discount_16_percent: parsed.data.discount_16_percent,
      discount_21_percent: parsed.data.discount_21_percent,
      discount_23_percent: parsed.data.discount_23_percent,
    };
    await dashboardApi.put(DASHBOARD_ENDPOINTS.units.byId(unitId), payload);
    revalidatePath('/[locale]/dashboard/units', 'page');
    return { success: true, id: unitId };
  } catch (error) {
    return mapException(error);
  }
}

export async function deleteUnitAction(unitId: string): Promise<EntityActionResult> {
  try {
    await dashboardApi.delete(DASHBOARD_ENDPOINTS.units.byId(unitId));
    revalidatePath('/[locale]/dashboard/units', 'page');
    return { success: true };
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
