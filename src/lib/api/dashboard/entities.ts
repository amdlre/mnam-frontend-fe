import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

import type {
  Booking,
  BookingStatus,
  Owner,
  PaginatedBookings,
  Project,
  ContractStatus,
} from '@/types/dashboard';

interface ApiOwner {
  id: string;
  owner_name: string;
  owner_mobile_phone: string;
  paypal_email?: string;
  note?: string;
  created_at?: string;
  project_count: number;
  unit_count: number;
}

function normalizeOwner(o: ApiOwner): Owner {
  return {
    id: o.id,
    ownerName: o.owner_name,
    ownerMobilePhone: o.owner_mobile_phone,
    paypalEmail: o.paypal_email,
    note: o.note,
    createdAt: o.created_at,
    projectCount: o.project_count,
    unitCount: o.unit_count,
  };
}

export async function fetchOwners(): Promise<Owner[]> {
  try {
    const data = await dashboardApi.get<ApiOwner[]>(DASHBOARD_ENDPOINTS.owners.list);
    return data.map(normalizeOwner);
  } catch {
    return [];
  }
}

export async function fetchOwnerById(ownerId: string): Promise<Owner | null> {
  try {
    const all = await fetchOwners();
    return all.find((o) => o.id === ownerId) ?? null;
  } catch {
    return null;
  }
}

export async function fetchOwnerProjects(
  ownerId: string,
): Promise<Array<{ projectName: string; city?: string; district?: string; unitCount: number }>> {
  try {
    const data = await dashboardApi.get<
      Array<{ project_name: string; city?: string; district?: string; unit_count: number }>
    >(DASHBOARD_ENDPOINTS.owners.projects(ownerId));
    return data.map((p) => ({
      projectName: p.project_name,
      city: p.city,
      district: p.district,
      unitCount: p.unit_count,
    }));
  } catch {
    return [];
  }
}

export interface SimpleOwner {
  id: string;
  name: string;
}

export async function fetchSimpleOwners(): Promise<SimpleOwner[]> {
  try {
    return await dashboardApi.get<SimpleOwner[]>(DASHBOARD_ENDPOINTS.owners.select);
  } catch {
    const all = await fetchOwners();
    return all.map((o) => ({ id: o.id, name: o.ownerName }));
  }
}

interface ApiProject {
  id: string;
  owner_id: string;
  owner_name: string;
  name: string;
  city?: string;
  district?: string;
  contract_no?: string;
  contract_status?: ContractStatus;
  commission_percent?: number;
  unit_count: number;
}

function normalizeProject(p: ApiProject): Project {
  return {
    id: p.id,
    ownerId: p.owner_id,
    ownerName: p.owner_name,
    name: p.name,
    city: p.city,
    district: p.district,
    contractNo: p.contract_no,
    contractStatus: p.contract_status,
    commissionPercent: p.commission_percent,
    unitCount: p.unit_count,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await dashboardApi.get<ApiProject[]>(DASHBOARD_ENDPOINTS.projects.list);
    return data.map(normalizeProject);
  } catch {
    return [];
  }
}

export async function fetchProjectById(projectId: string): Promise<Project | null> {
  try {
    const all = await fetchProjects();
    return all.find((p) => p.id === projectId) ?? null;
  } catch {
    return null;
  }
}

export interface SimpleProject {
  id: string;
  name: string;
}

export async function fetchSimpleProjects(): Promise<SimpleProject[]> {
  try {
    return await dashboardApi.get<SimpleProject[]>(DASHBOARD_ENDPOINTS.projects.select);
  } catch {
    const all = await fetchProjects();
    return all.map((p) => ({ id: p.id, name: p.name }));
  }
}

interface ApiBooking {
  id: string;
  project_id: string;
  unit_id: string;
  guest_name: string;
  guest_phone?: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: BookingStatus;
  notes?: string;
  project_name?: string;
  unit_name?: string;
  customer_name?: string;
  channel_source?: string;
  created_at?: string;
}

interface ApiBookingsResponse {
  items: ApiBooking[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

function mapBooking(b: ApiBooking): Booking {
  return {
    id: b.id,
    projectId: b.project_id,
    unitId: b.unit_id,
    guestName: b.guest_name,
    guestPhone: b.guest_phone,
    checkInDate: b.check_in_date,
    checkOutDate: b.check_out_date,
    totalPrice: b.total_price,
    status: b.status,
    notes: b.notes,
    projectName: b.project_name,
    unitName: b.unit_name,
    customerName: b.customer_name,
    channelSource: b.channel_source || 'direct',
    createdAt: b.created_at,
  };
}

export async function fetchBookingsPaginated(
  page = 1,
  pageSize = 20,
): Promise<PaginatedBookings> {
  try {
    const data = await dashboardApi.get<ApiBookingsResponse>(
      DASHBOARD_ENDPOINTS.bookings.paginated(page, pageSize),
    );
    return {
      items: data.items.map(mapBooking),
      total: data.total,
      page: data.page,
      pageSize: data.page_size,
      totalPages: data.total_pages,
      hasNext: data.has_next,
      hasPrevious: data.has_previous,
    };
  } catch {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
  }
}
