import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { fetchDashboardCurrentUser } from '@/lib/api/dashboard/auth';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardProfilePage({ params }: Props) {
  await params;
  const [t, tRoles, user] = await Promise.all([
    getTranslations('dashboard.profile'),
    getTranslations('dashboard.roles'),
    fetchDashboardCurrentUser(),
  ]);

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-lg border p-6 shadow-sm">
        <dl className="divide-neutral-dashboard-border divide-y">
          <div className="flex items-center justify-between py-3">
            <dt className="text-neutral-dashboard-muted text-sm font-medium">{t('name')}</dt>
            <dd className="text-neutral-dashboard-text text-sm font-semibold">{user?.name ?? '—'}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-neutral-dashboard-muted text-sm font-medium">{t('username')}</dt>
            <dd className="text-neutral-dashboard-text text-sm font-semibold">{user?.username ?? '—'}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-neutral-dashboard-muted text-sm font-medium">{t('email')}</dt>
            <dd className="text-neutral-dashboard-text text-sm font-semibold">{user?.email ?? '—'}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-neutral-dashboard-muted text-sm font-medium">{t('role')}</dt>
            <dd className="text-neutral-dashboard-text text-sm font-semibold">
              {user ? tRoles(user.role) : '—'}
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-neutral-dashboard-muted text-center text-xs">{t('editHint')}</p>
    </div>
  );
}
