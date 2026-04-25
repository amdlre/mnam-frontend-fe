import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CustomerEditForm } from '@/components/dashboard/features/customers/customer-edit-form';
import { fetchCustomerById } from '@/lib/api/dashboard/customers';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardCustomerEditPage({ params }: Props) {
  const { id } = await params;
  const customer = await fetchCustomerById(id);
  if (!customer) {
    notFound();
  }
  return <CustomerEditForm customer={customer} />;
}
