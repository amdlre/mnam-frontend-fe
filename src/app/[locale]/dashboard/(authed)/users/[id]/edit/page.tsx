import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchAssignableRoles, fetchUserById } from '@/lib/api/dashboard/users';
import { UserEditForm } from '@/components/dashboard/features/users/user-edit-form';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardUserEditPage({ params }: Props) {
  const { locale, id } = await params;
  const [user, roles] = await Promise.all([
    fetchUserById(id),
    fetchAssignableRoles(),
  ]);
  if (!user) notFound();
  return <UserEditForm user={user} roles={roles} locale={locale} />;
}
