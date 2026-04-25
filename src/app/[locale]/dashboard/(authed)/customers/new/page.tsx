import type { Metadata } from 'next';

import { CustomerCreateForm } from '@/components/dashboard/features/customers/customer-create-form';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardCustomerCreatePage() {
  return <CustomerCreateForm />;
}
