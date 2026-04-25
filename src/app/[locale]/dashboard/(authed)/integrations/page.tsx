import type { Metadata } from 'next';

import { IntegrationsDashboard } from '@/components/dashboard/features/integrations/integrations-dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardIntegrationsPage() {
  return <IntegrationsDashboard />;
}
