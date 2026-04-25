import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

export type CustomerGender = 'male' | 'female' | null;
export type CustomerVisitorType = 'مميز' | 'عادي';
export type CustomerStatus = 'new' | 'old';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  gender: CustomerGender;
  notes: string | null;
  bookingCount: number;
  completedBookingCount: number;
  totalRevenue: number;
  isBanned: boolean;
  banReason: string | null;
  isProfileComplete: boolean;
  visitorType: CustomerVisitorType;
  customerStatus: CustomerStatus;
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  oldCustomers: number;
  vipCustomers: number;
  regularCustomers: number;
  completeProfiles: number;
  incompleteProfiles: number;
  totalRevenue: number;
}

interface ApiCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  gender: CustomerGender;
  notes: string | null;
  booking_count?: number;
  completed_booking_count?: number;
  total_revenue?: number;
  is_banned?: boolean;
  ban_reason?: string | null;
  is_profile_complete?: boolean;
  visitor_type?: CustomerVisitorType;
  customer_status?: CustomerStatus;
}

interface ApiCustomerStats {
  total_customers?: number;
  new_customers?: number;
  old_customers?: number;
  vip_customers?: number;
  regular_customers?: number;
  complete_profiles?: number;
  incomplete_profiles?: number;
  total_revenue?: number;
}

const ZERO_STATS: CustomerStats = {
  totalCustomers: 0,
  newCustomers: 0,
  oldCustomers: 0,
  vipCustomers: 0,
  regularCustomers: 0,
  completeProfiles: 0,
  incompleteProfiles: 0,
  totalRevenue: 0,
};

function normalize(c: ApiCustomer): Customer {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    gender: c.gender,
    notes: c.notes,
    bookingCount: c.booking_count ?? 0,
    completedBookingCount: c.completed_booking_count ?? 0,
    totalRevenue: c.total_revenue ?? 0,
    isBanned: c.is_banned ?? false,
    banReason: c.ban_reason ?? null,
    isProfileComplete: c.is_profile_complete ?? false,
    visitorType: c.visitor_type ?? 'عادي',
    customerStatus: c.customer_status ?? 'new',
  };
}

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const data = await dashboardApi.get<ApiCustomer[]>(DASHBOARD_ENDPOINTS.customers.list);
    return data.map(normalize);
  } catch {
    return [];
  }
}

export async function fetchCustomerById(customerId: string): Promise<Customer | null> {
  try {
    const data = await dashboardApi.get<ApiCustomer>(DASHBOARD_ENDPOINTS.customers.byId(customerId));
    return normalize(data);
  } catch {
    return null;
  }
}

export async function fetchCustomerStats(): Promise<CustomerStats> {
  try {
    const data = await dashboardApi.get<ApiCustomerStats>(DASHBOARD_ENDPOINTS.customers.stats);
    return {
      totalCustomers: data.total_customers ?? 0,
      newCustomers: data.new_customers ?? 0,
      oldCustomers: data.old_customers ?? 0,
      vipCustomers: data.vip_customers ?? 0,
      regularCustomers: data.regular_customers ?? 0,
      completeProfiles: data.complete_profiles ?? 0,
      incompleteProfiles: data.incomplete_profiles ?? 0,
      totalRevenue: data.total_revenue ?? 0,
    };
  } catch {
    return ZERO_STATS;
  }
}
