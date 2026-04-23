import type { DashboardUserRole } from '@/types/dashboard';

export const USER_ROLE_BADGE_STYLES: Record<DashboardUserRole, string> = {
  system_owner: 'bg-amber-50 text-amber-700 border-amber-200',
  admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  owners_agent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  customers_agent: 'bg-sky-50 text-sky-700 border-sky-200',
};
