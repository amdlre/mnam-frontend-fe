import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectEditForm } from '@/components/dashboard/features/projects/project-edit-form';
import {
  fetchProjectById,
  fetchSimpleOwners,
} from '@/lib/api/dashboard/entities';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardProjectEditPage({ params }: Props) {
  const { id } = await params;
  const [project, owners] = await Promise.all([
    fetchProjectById(id),
    fetchSimpleOwners(),
  ]);
  if (!project) notFound();
  return <ProjectEditForm project={project} owners={owners} />;
}
