'use server';

import { revalidatePath } from 'next/cache';

import { DASHBOARD_ENDPOINTS } from '@/lib/api/dashboard/endpoints';
import { dashboardApi, DashboardApiException } from '@/lib/api/dashboard/fetcher';
import {
  fetchIntegrationAlerts,
  type ChannexPropertyPreview,
  type ChannexRatePlan,
  type ChannexRoomType,
  type IntegrationAlert,
  type IntegrationAlertStatus,
} from '@/lib/api/dashboard/integrations';

export interface IntegrationsActionResult<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

function mapException<T>(error: unknown): IntegrationsActionResult<T> {
  if (error instanceof DashboardApiException) {
    return { success: false, message: error.message };
  }
  return { success: false, message: 'unknownError' };
}

interface ApiRoomType {
  id: string;
  title: string;
  occ_adults?: number;
  occ_children?: number;
  occ_infants?: number;
}

interface ApiRatePlan {
  id: string;
  title: string;
  room_type_id?: string;
  currency?: string;
}

export async function fetchAlertsAction(
  status: IntegrationAlertStatus | 'all',
): Promise<IntegrationsActionResult<IntegrationAlert[]>> {
  try {
    const data = await fetchIntegrationAlerts(status);
    return { success: true, data };
  } catch (error) {
    return mapException<IntegrationAlert[]>(error);
  }
}

interface ChannexJsonApiProperty {
  id: string;
  attributes?: {
    title?: string;
    name?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

const CHANNEX_API_BASE_URL =
  process.env.CHANNEX_API_BASE_URL ?? 'https://staging.channex.io/api/v1';

export async function verifyChannexApiKeyAction(
  apiKey: string,
): Promise<IntegrationsActionResult<ChannexPropertyPreview[]>> {
  if (!apiKey.trim()) {
    return { success: false, message: 'apiKeyRequired' };
  }
  try {
    const res = await fetch(`${CHANNEX_API_BASE_URL}/properties`, {
      method: 'GET',
      headers: {
        'user-api-key': apiKey.trim(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (res.status === 401 || res.status === 403) {
      return { success: false, message: 'invalidApiKey' };
    }
    if (!res.ok) {
      return { success: false, message: `channex_${res.status}` };
    }
    const json = (await res.json()) as { data?: ChannexJsonApiProperty[] };
    const items = Array.isArray(json.data) ? json.data : [];
    return {
      success: true,
      data: items.map((p) => ({
        id: p.id,
        title: p.attributes?.title || p.attributes?.name || 'Untitled',
        address: p.attributes?.address,
        city: p.attributes?.city,
        country: p.attributes?.country,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'unknownError' };
  }
}

export async function fetchChannexRoomTypesAction(
  connectionId: string,
): Promise<IntegrationsActionResult<ChannexRoomType[]>> {
  try {
    const data = await dashboardApi.get<ApiRoomType[]>(
      DASHBOARD_ENDPOINTS.channex.roomTypes(connectionId),
    );
    return {
      success: true,
      data: data.map((rt) => ({
        id: rt.id,
        title: rt.title,
        occAdults: rt.occ_adults,
        occChildren: rt.occ_children,
        occInfants: rt.occ_infants,
      })),
    };
  } catch (error) {
    return mapException<ChannexRoomType[]>(error);
  }
}

export async function fetchChannexRatePlansAction(
  connectionId: string,
  roomTypeId: string,
): Promise<IntegrationsActionResult<ChannexRatePlan[]>> {
  try {
    const data = await dashboardApi.get<ApiRatePlan[]>(
      DASHBOARD_ENDPOINTS.channex.ratePlans(connectionId, roomTypeId),
    );
    return {
      success: true,
      data: data.map((rp) => ({
        id: rp.id,
        title: rp.title,
        roomTypeId: rp.room_type_id,
        currency: rp.currency,
      })),
    };
  } catch (error) {
    return mapException<ChannexRatePlan[]>(error);
  }
}

export async function createChannexConnectionAction(input: {
  projectId: string;
  apiKey: string;
  channexPropertyId: string;
  autoSync?: boolean;
}): Promise<IntegrationsActionResult<{ connectionId: string }>> {
  try {
    const res = await dashboardApi.post<{ connection_id: string; success: boolean; message?: string }>(
      DASHBOARD_ENDPOINTS.integrations.connections,
      {
        project_id: input.projectId,
        api_key: input.apiKey,
        channex_property_id: input.channexPropertyId,
      },
    );
    if (input.autoSync && res?.connection_id) {
      try {
        await dashboardApi.post(DASHBOARD_ENDPOINTS.integrations.syncConnection(res.connection_id), {
          auto_sync: true,
        });
      } catch {
        // Sync failure shouldn't fail the create
      }
    }
    revalidatePath('/[locale]/dashboard/integrations', 'page');
    return { success: true, data: { connectionId: res?.connection_id } };
  } catch (error) {
    return mapException<{ connectionId: string }>(error);
  }
}

export async function deleteChannexConnectionAction(
  connectionId: string,
): Promise<IntegrationsActionResult> {
  try {
    await dashboardApi.delete(DASHBOARD_ENDPOINTS.integrations.deleteConnection(connectionId));
    revalidatePath('/[locale]/dashboard/integrations', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function syncChannexConnectionAction(
  connectionId: string,
  autoSync = false,
): Promise<IntegrationsActionResult> {
  try {
    await dashboardApi.post(DASHBOARD_ENDPOINTS.integrations.syncConnection(connectionId), {
      auto_sync: autoSync,
    });
    revalidatePath('/[locale]/dashboard/integrations', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function createMappingAction(input: {
  connectionId: string;
  unitId: string;
  channexRoomTypeId: string;
  channexRatePlanId: string;
}): Promise<IntegrationsActionResult> {
  try {
    await dashboardApi.post(DASHBOARD_ENDPOINTS.integrations.mappings, {
      connection_id: input.connectionId,
      unit_id: input.unitId,
      channex_room_type_id: input.channexRoomTypeId,
      channex_rate_plan_id: input.channexRatePlanId,
    });
    revalidatePath('/[locale]/dashboard/integrations', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function deleteMappingAction(
  mappingId: string,
): Promise<IntegrationsActionResult> {
  try {
    await dashboardApi.delete(DASHBOARD_ENDPOINTS.integrations.deleteMapping(mappingId));
    revalidatePath('/[locale]/dashboard/integrations', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function acknowledgeAlertAction(
  alertId: string,
): Promise<IntegrationsActionResult> {
  try {
    await dashboardApi.patch(DASHBOARD_ENDPOINTS.integrations.acknowledgeAlert(alertId));
    revalidatePath('/[locale]/dashboard/integrations', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}

export async function resolveAlertAction(
  alertId: string,
  notes?: string,
): Promise<IntegrationsActionResult> {
  try {
    await dashboardApi.patch(DASHBOARD_ENDPOINTS.integrations.resolveAlert(alertId), {
      resolution_notes: notes ?? null,
    });
    revalidatePath('/[locale]/dashboard/integrations', 'page');
    return { success: true };
  } catch (error) {
    return mapException(error);
  }
}
