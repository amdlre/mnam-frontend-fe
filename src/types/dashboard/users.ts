import type { DashboardUserRole } from './auth';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: DashboardUserRole;
  isActive: boolean;
  isSystemOwner: boolean;
  phone: string;
  lastLogin?: string;
}

export interface AssignableRole {
  value: string;
  label: string;
}

export interface EmployeeOnlineStatus {
  employeeId: string;
  employeeName: string;
  isOnline: boolean;
  todayDuration: number;
  formattedDuration: string;
  lastActivity?: string;
  currentSessionStart?: string;
}
