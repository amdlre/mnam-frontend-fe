import type { Metadata } from 'next';

import { CustomersDashboard } from '@/components/dashboard/features/customers/customers-dashboard';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardCustomersPage({ params }: Props) {
  const { locale } = await params;
  return <CustomersDashboard locale={locale} />;
}
