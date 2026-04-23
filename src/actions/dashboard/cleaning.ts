'use server';

import { revalidatePath } from 'next/cache';

import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';

import type { CleaningRequestStatus, CleaningRequestType } from '@/types/dashboard';

export interface CleaningActionResult {
  success: boolean;
  message?: string;
}

export async function createCleaningRequestAction(
  unit: string,
  type: CleaningRequestType,
  notes?: string,
): Promise<CleaningActionResult> {
  if (!unit) return { success: false, message: 'unitRequired' };
  try {
    await dashboardApi.post('/api/requests', { unit, type, notes });
    revalidatePath('/[locale]/dashboard/cleaning-maintenance', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}

export async function updateCleaningRequestStatusAction(
  requestId: string,
  status: CleaningRequestStatus,
): Promise<CleaningActionResult> {
  try {
    await dashboardApi.patch(`/api/requests/${requestId}/status`, { status });
    revalidatePath('/[locale]/dashboard/cleaning-maintenance', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof DashboardApiException) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}
