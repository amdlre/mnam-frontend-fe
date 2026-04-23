import type { Metadata } from 'next';

import { fetchAssignableRoles } from '@/lib/api/dashboard/users';
import { UserCreateForm } from '@/components/dashboard/features/users/user-create-form';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardUserCreatePage({ params }: Props) {
  const { locale } = await params;
  const roles = await fetchAssignableRoles();
  return <UserCreateForm roles={roles} locale={locale} />;
}
