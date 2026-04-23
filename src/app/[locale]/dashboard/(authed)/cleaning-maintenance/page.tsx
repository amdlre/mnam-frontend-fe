import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Sparkles } from 'lucide-react';

import {
  fetchCleaningRequests,
  fetchCleaningStats,
} from '@/lib/api/dashboard/cleaning';
import { fetchUnits } from '@/lib/api/dashboard/units';
import { CleaningCreateForm } from '@/components/dashboard/features/cleaning/create-form';
import { CleaningFilters } from '@/components/dashboard/features/cleaning/filters';
import { CleaningStatusSelect } from '@/components/dashboard/features/cleaning/status-select';
import {
  STATUS_BADGE_STYLES,
  TYPE_BADGE_STYLES,
} from '@/components/dashboard/features/cleaning/badges';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

import type {
  CleaningMaintenanceRequest,
  CleaningRequestStatus,
  CleaningRequestType,
} from '@/types/dashboard';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; status?: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function formatDate(value: string, locale: string) {
  try {
    return new Date(value).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US');
  } catch {
    return value;
  }
}

function filterRequests(
  requests: CleaningMaintenanceRequest[],
  type?: string,
  status?: string,
): CleaningMaintenanceRequest[] {
  return requests.filter((r) => {
    if (type && type !== 'all' && r.type !== type) return false;
    if (status && status !== 'all' && r.status !== status) return false;
    return true;
  });
}

export default async function DashboardCleaningMaintenancePage({
  params,
  searchParams,
}: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const t = await getTranslations('dashboard.cleaning');

  const [requests, stats, units, activeRequests] = await Promise.all([
    fetchCleaningRequests({ sort: 'createdAt', order: 'asc' }),
    fetchCleaningStats(),
    fetchUnits(),
    fetchCleaningRequests({ status: ['جديد', 'قيد التنفيذ'] }),
  ]);

  const activeUnitIds = activeRequests.map((r) => r.unitId);
  const filtered = filterRequests(requests, sp.type, sp.status);

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label={t('stats.total')} value={stats.total} tone="default" />
        <StatCard label={t('stats.cleaning')} value={stats.cleaning} tone="amber" dot />
        <StatCard label={t('stats.maintenance')} value={stats.maintenance} tone="red" dot />
      </section>

      <CleaningCreateForm units={units} activeUnitIds={activeUnitIds} />

      <CleaningFilters />

      {filtered.length === 0 ? (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-12 text-center shadow-sm">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-neutral-dashboard-muted text-sm font-medium">{t('empty')}</p>
        </div>
      ) : (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-right text-sm">
              <thead className="text-neutral-dashboard-muted border-neutral-dashboard-border border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('cols.unit')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.project')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.type')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.date')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.status')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.change')}</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-dashboard-border divide-y">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50">
                    <td className="text-neutral-dashboard-text px-4 py-3 font-medium">
                      {item.unitName}
                    </td>
                    <td className="text-neutral-dashboard-muted px-4 py-3">{item.projectName}</td>
                    <td className="px-4 py-3">
                      <Badge label={item.type} className={TYPE_BADGE_STYLES[item.type]} />
                    </td>
                    <td className="text-neutral-dashboard-muted px-4 py-3">
                      {formatDate(item.createdAt, locale)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={item.status} className={STATUS_BADGE_STYLES[item.status]} />
                    </td>
                    <td className="px-4 py-3">
                      <CleaningStatusSelect
                        requestId={item.id}
                        currentStatus={item.status as CleaningRequestStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-neutral-dashboard-border divide-y md:hidden">
            {filtered.map((item) => (
              <div key={item.id} className="space-y-3 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-dashboard-text text-sm font-bold">{item.unitName}</p>
                    <p className="text-neutral-dashboard-muted mt-0.5 text-xs">{item.projectName}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge
                      label={item.type as CleaningRequestType}
                      className={TYPE_BADGE_STYLES[item.type]}
                    />
                    <Badge label={item.status} className={STATUS_BADGE_STYLES[item.status]} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-neutral-400">{formatDate(item.createdAt, locale)}</p>
                  <CleaningStatusSelect
                    requestId={item.id}
                    currentStatus={item.status as CleaningRequestStatus}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-bold ${className ?? ''}`}>{label}</span>
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
