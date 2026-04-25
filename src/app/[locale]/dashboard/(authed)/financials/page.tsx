import type { Metadata } from 'next';

import { FinancialsDashboard } from '@/components/dashboard/features/financials/financials-dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardFinancialsPage() {
  return <FinancialsDashboard />;
}
