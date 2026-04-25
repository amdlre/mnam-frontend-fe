import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UnitEditForm } from '@/components/dashboard/features/units/unit-edit-form';
import { fetchSimpleProjects } from '@/lib/api/dashboard/entities';
import { fetchUnitById } from '@/lib/api/dashboard/units';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardUnitEditPage({ params }: Props) {
  const { id } = await params;
  const [unit, projects] = await Promise.all([
    fetchUnitById(id),
    fetchSimpleProjects(),
  ]);
  if (!unit) notFound();
  return <UnitEditForm unit={unit} projects={projects} />;
}
