import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { OwnerEditForm } from '@/components/dashboard/features/owners/owner-edit-form';
import { fetchOwnerById } from '@/lib/api/dashboard/entities';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardOwnerEditPage({ params }: Props) {
  const { id } = await params;
  const owner = await fetchOwnerById(id);
  if (!owner) notFound();
  return <OwnerEditForm owner={owner} />;
}
