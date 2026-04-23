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

export async function fetchOwners(): Promise<Owner[]> {
  try {
    const data = await dashboardApi.get<ApiOwner[]>('/api/owners');
    return data.map((o) => ({
      id: o.id,
      ownerName: o.owner_name,
      ownerMobilePhone: o.owner_mobile_phone,
      paypalEmail: o.paypal_email,
      note: o.note,
      createdAt: o.created_at,
      projectCount: o.project_count,
      unitCount: o.unit_count,
    }));
  } catch {
    return [];
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

export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await dashboardApi.get<ApiProject[]>('/api/projects');
    return data.map((p) => ({
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
    }));
  } catch {
    return [];
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
      `/api/bookings?page=${page}&page_size=${pageSize}`,
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
