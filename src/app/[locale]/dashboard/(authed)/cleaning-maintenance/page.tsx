import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import {
  fetchCleaningRequests,
  fetchCleaningStats,
} from '@/lib/api/dashboard/cleaning';
import { fetchUnits } from '@/lib/api/dashboard/units';
import { CleaningCreateForm } from '@/components/dashboard/features/cleaning/create-form';
import { CleaningTable } from '@/components/dashboard/features/cleaning/cleaning-table';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardCleaningMaintenancePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('dashboard.cleaning');

  const [requests, stats, units, activeRequests] = await Promise.all([
    fetchCleaningRequests({ sort: 'createdAt', order: 'asc' }),
    fetchCleaningStats(),
    fetchUnits(),
    fetchCleaningRequests({ status: ['جديد', 'قيد التنفيذ'] }),
  ]);

  const activeUnitIds = activeRequests.map((r) => r.unitId);

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label={t('stats.total')} value={stats.total} tone="default" />
        <StatCard label={t('stats.cleaning')} value={stats.cleaning} tone="amber" dot />
        <StatCard label={t('stats.maintenance')} value={stats.maintenance} tone="red" dot />
      </section>

      <CleaningCreateForm units={units} activeUnitIds={activeUnitIds} />

      <CleaningTable requests={requests} locale={locale} />
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  dot,
}: {
  label: string;
  value: number;
  tone: 'default' | 'amber' | 'red';
  dot?: boolean;
}) {
  const valueColor =
    tone === 'amber'
      ? 'text-amber-600'
      : tone === 'red'
        ? 'text-red-600'
        : 'text-neutral-dashboard-text';
  const dotColor = tone === 'amber' ? 'bg-amber-400' : tone === 'red' ? 'bg-red-400' : '';

  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-3 shadow-sm md:p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-dashboard-muted text-xs font-medium md:text-sm">{label}</p>
          <p className={`mt-1 text-lg font-bold md:text-2xl ${valueColor}`}>{value}</p>
        </div>
        {dot ? <div className={`mt-1 h-2 w-2 rounded-full ${dotColor}`} /> : null}
      </div>
    </div>
  );
}
