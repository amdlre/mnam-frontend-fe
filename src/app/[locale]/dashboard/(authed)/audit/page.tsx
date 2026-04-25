import type { Metadata } from 'next';

import { AuditDashboard } from '@/components/dashboard/features/audit/audit-dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardAuditPage() {
  return <AuditDashboard />;
}
