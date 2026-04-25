import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

import type {
  AssignableRole,
  EmployeeOnlineStatus,
  SystemUser,
  DashboardUserRole,
} from '@/types/dashboard';

interface ApiUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: DashboardUserRole;
  is_active: boolean;
  is_system_owner?: boolean;
  phone: string;
  last_login?: string;
}

function normalizeUser(u: ApiUser): SystemUser {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    firstName: u.first_name,
    lastName: u.last_name,
    role: u.role,
    isActive: u.is_active,
    isSystemOwner: u.is_system_owner || false,
    phone: u.phone,
    lastLogin: u.last_login,
  };
}

export async function fetchSystemUsers(): Promise<SystemUser[]> {
  try {
    const data = await dashboardApi.get<ApiUser[]>(DASHBOARD_ENDPOINTS.users.list);
    return data.map(normalizeUser);
  } catch {
    return [];
  }
}

export async function fetchUserById(userId: string): Promise<SystemUser | null> {
  try {
    const users = await fetchSystemUsers();
    return users.find((u) => u.id === userId) ?? null;
  } catch {
    return null;
  }
}

export async function fetchAssignableRoles(): Promise<AssignableRole[]> {
  try {
    return await dashboardApi.get<AssignableRole[]>(DASHBOARD_ENDPOINTS.users.rolesAssignable);
  } catch {
    return [
      { value: 'owners_agent', label: 'وكيل ملاك' },
      { value: 'customers_agent', label: 'وكيل عملاء' },
    ];
  }
}

export async function fetchEmployeesStatus(): Promise<EmployeeOnlineStatus[]> {
  try {
    return await dashboardApi.get<EmployeeOnlineStatus[]>(
      DASHBOARD_ENDPOINTS.employeePerformance.employeesStatus,
    );
  } catch {
    return [];
  }
}
