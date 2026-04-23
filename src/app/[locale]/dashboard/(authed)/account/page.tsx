import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardAccountPage({ params }: Props) {
  await params;
  const t = await getTranslations('dashboard.account');

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-lg border p-6 shadow-sm">
        <p className="text-neutral-dashboard-muted text-sm">{t('comingSoon')}</p>
      </div>
    </div>
  );
}
