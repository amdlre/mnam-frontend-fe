import type { Metadata } from 'next';

import { OwnerCreateForm } from '@/components/dashboard/features/owners/owner-create-form';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardOwnerCreatePage() {
  return <OwnerCreateForm />;
}
