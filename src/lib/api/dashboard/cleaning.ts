import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

import type {
  CleaningMaintenanceRequest,
  CleaningMaintenanceStats,
  CleaningRequestStatus,
  CleaningRequestType,
} from '@/types/dashboard';

interface ApiRequest {
  id?: string;
  _id?: string;
  unit?: { _id?: string; id?: string; unit_name?: string; project_name?: string } | string;
  unit_name?: string;
  project_name?: string;
  type: CleaningRequestType;
  status: CleaningRequestStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeRequest(r: ApiRequest): CleaningMaintenanceRequest {
  const unit = typeof r.unit === 'string' ? undefined : r.unit;
  return {
    id: (r.id || r._id) as string,
    unitId: (unit?._id || unit?.id || (typeof r.unit === 'string' ? r.unit : '')) as string,
    unitName: unit?.unit_name || r.unit_name || '',
    projectName: unit?.project_name || r.project_name || '',
    type: r.type,
    status: r.status,
    notes: r.notes,
    createdAt: (r.created_at || r.createdAt) as string,
    updatedAt: r.updated_at || r.updatedAt,
  };
}

export interface CleaningRequestFilters {
  status?: CleaningRequestStatus[];
  type?: CleaningRequestType;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export async function fetchCleaningRequests(
  filters?: CleaningRequestFilters,
): Promise<CleaningMaintenanceRequest[]> {
  const qs = new URLSearchParams();
  filters?.status?.forEach((s) => qs.append('status', s));
  if (filters?.type) qs.set('type', filters.type);
  if (filters?.limit) qs.set('limit', String(filters.limit));
  if (filters?.sort) qs.set('sort', filters.sort);
  if (filters?.order) qs.set('order', filters.order);
  const path = `${DASHBOARD_ENDPOINTS.requests.list}${qs.toString() ? `?${qs.toString()}` : ''}`;

  try {
    const data = await dashboardApi.get<unknown>(path);
    const items: ApiRequest[] = Array.isArray(data)
      ? (data as ApiRequest[])
      : ((data as { data?: ApiRequest[]; requests?: ApiRequest[] })?.data ??
        (data as { requests?: ApiRequest[] })?.requests ??
        []);
    return items.map(normalizeRequest);
  } catch {
    return [];
  }
}

export async function fetchCleaningStats(): Promise<CleaningMaintenanceStats> {
  try {
    return await dashboardApi.get<CleaningMaintenanceStats>(DASHBOARD_ENDPOINTS.requests.stats);
  } catch {
    return { total: 0, cleaning: 0, maintenance: 0 };
  }
}
