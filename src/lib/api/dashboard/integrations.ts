import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

export interface ChannexConnection {
  id: string;
  projectId: string;
  provider: string;
  channexPropertyId?: string;
  status: string;
  lastSyncAt?: string;
  lastError?: string;
}

export interface ChannexRoomType {
  id: string;
  title: string;
  occAdults?: number;
  occChildren?: number;
  occInfants?: number;
}

export interface ChannexRatePlan {
  id: string;
  title: string;
  roomTypeId?: string;
  currency?: string;
}

export interface ChannexPropertyPreview {
  id: string;
  title: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface ExternalMapping {
  id: string;
  connectionId: string;
  unitId?: string;
  channexRoomTypeId?: string;
  channexRatePlanId?: string;
  mappingType: string;
  isActive: boolean;
  lastPriceSyncAt?: string;
  lastAvailSyncAt?: string;
  createdAt: string;
  syncStatus: 'synced' | 'pending' | 'error';
}

export type IntegrationAlertSeverity = 'critical' | 'warning' | 'info' | 'success';
export type IntegrationAlertStatus = 'open' | 'acknowledged' | 'resolved';

export interface IntegrationAlert {
  id: string;
  type: string;
  severity: IntegrationAlertSeverity;
  message: string;
  propertyId?: string;
  status: IntegrationAlertStatus;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

interface ApiConnection {
  id: string;
  project_id: string;
  provider: string;
  channex_property_id?: string;
  status: string;
  last_sync_at?: string;
  last_error?: string;
}

interface ApiMapping {
  id: string;
  connection_id: string;
  unit_id?: string;
  channex_room_type_id?: string;
  channex_rate_plan_id?: string;
  mapping_type?: string;
  is_active?: boolean;
  last_price_sync_at?: string;
  last_avail_sync_at?: string;
  created_at?: string;
  sync_status?: 'synced' | 'pending' | 'error';
}

interface ApiAlert {
  id: string;
  type: string;
  severity: IntegrationAlertSeverity;
  message: string;
  property_id?: string;
  status: IntegrationAlertStatus;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
}

function normalizeConnection(c: ApiConnection): ChannexConnection {
  return {
    id: c.id,
    projectId: c.project_id,
    provider: c.provider,
    channexPropertyId: c.channex_property_id,
    status: c.status,
    lastSyncAt: c.last_sync_at,
    lastError: c.last_error,
  };
}

function normalizeMapping(m: ApiMapping): ExternalMapping {
  return {
    id: m.id,
    connectionId: m.connection_id,
    unitId: m.unit_id,
    channexRoomTypeId: m.channex_room_type_id,
    channexRatePlanId: m.channex_rate_plan_id,
    mappingType: m.mapping_type ?? 'unit',
    isActive: m.is_active ?? true,
    lastPriceSyncAt: m.last_price_sync_at,
    lastAvailSyncAt: m.last_avail_sync_at,
    createdAt: m.created_at ?? '',
    syncStatus: m.sync_status ?? 'pending',
  };
}

function normalizeAlert(a: ApiAlert): IntegrationAlert {
  return {
    id: a.id,
    type: a.type,
    severity: a.severity,
    message: a.message,
    propertyId: a.property_id,
    status: a.status,
    createdAt: a.created_at,
    acknowledgedAt: a.acknowledged_at,
    resolvedAt: a.resolved_at,
    resolutionNotes: a.resolution_notes,
  };
}

export async function fetchChannexConnections(): Promise<ChannexConnection[]> {
  try {
    const data = await dashboardApi.get<ApiConnection[]>(DASHBOARD_ENDPOINTS.integrations.connections);
    return data.map(normalizeConnection);
  } catch {
    return [];
  }
}

export async function fetchMappings(): Promise<ExternalMapping[]> {
  try {
    const data = await dashboardApi.get<ApiMapping[]>(DASHBOARD_ENDPOINTS.integrations.mappings);
    return data.map(normalizeMapping);
  } catch {
    return [];
  }
}

export async function fetchIntegrationAlerts(
  status?: IntegrationAlertStatus | 'all',
): Promise<IntegrationAlert[]> {
  try {
    const path =
      status && status !== 'all'
        ? `${DASHBOARD_ENDPOINTS.integrations.alerts}?status=${status}`
        : DASHBOARD_ENDPOINTS.integrations.alerts;
    const data = await dashboardApi.get<{ alerts?: ApiAlert[] } | ApiAlert[]>(path);
    const items: ApiAlert[] = Array.isArray(data) ? data : (data.alerts ?? []);
    return items.map(normalizeAlert);
  } catch {
    return [];
  }
}
