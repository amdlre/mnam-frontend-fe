import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Building2, Sparkles } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { fetchDashboardSummary } from '@/lib/api/dashboard/summary';
import {
  fetchCleaningRequests,
  fetchCleaningStats,
} from '@/lib/api/dashboard/cleaning';
import { fetchUnits } from '@/lib/api/dashboard/units';
import { CleaningCreateForm } from '@/components/dashboard/features/cleaning/create-form';
import { CleaningStatusSelect } from '@/components/dashboard/features/cleaning/status-select';
import {
  STATUS_BADGE_STYLES,
  TYPE_BADGE_STYLES,
} from '@/components/dashboard/features/cleaning/badges';

import type { CleaningRequestStatus } from '@/types/dashboard';

interface Props {
  params: Promise<{ locale: string }>;
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

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardHomePage({ params }: Props) {
  const { locale } = await params;
  const [t, tCleaning, summary, cleaningPreview, cleaningStats, units, activeRequests] =
    await Promise.all([
      getTranslations('dashboard.home'),
      getTranslations('dashboard.cleaning'),
      fetchDashboardSummary(),
      fetchCleaningRequests({ limit: 5, sort: 'createdAt', order: 'asc' }),
      fetchCleaningStats(),
      fetchUnits(),
      fetchCleaningRequests({ status: ['جديد', 'قيد التنفيذ'] }),
    ]);

  const kpis = summary?.kpis;
  const perf = summary?.employeePerformance;
  const arrivals = summary?.todayFocus.arrivals ?? [];
  const departures = summary?.todayFocus.departures ?? [];
  const upcoming = summary?.upcomingBookings ?? [];
  const activeUnitIds = activeRequests.map((r) => r.unitId);

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <section className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title={t('kpi.occupancy')}
          value={`${kpis?.occupancyRate ?? 0}%`}
          subtext={t('kpi.occupancySub', {
            booked: kpis?.bookedUnits ?? 0,
            total: kpis?.totalUnits ?? 0,
          })}
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          title={t('kpi.cleaning')}
          value={kpis?.cleaningUnits ?? 0}
          subtext={t('kpi.cleaningSub')}
        />
        <StatCard title={t('kpi.maintenance')} value={kpis?.maintenanceUnits ?? 0} />
        <StatCard
          title={t('kpi.dailyTarget')}
          value={`${perf?.dailyCompleted ?? 0} / ${perf?.dailyTarget ?? 0}`}
          subtext={t('kpi.dailyTargetSub')}
        />
      </section>

      <CleaningCreateForm units={units} activeUnitIds={activeUnitIds} />

      <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border shadow-sm">
        <div className="border-neutral-dashboard-border flex items-center justify-between border-b bg-slate-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-dashboard-primary-600 h-4 w-4" />
            <h3 className="text-neutral-dashboard-text text-sm font-semibold">
              {tCleaning('title')}
            </h3>
            <span className="bg-dashboard-primary-100 text-dashboard-primary-700 rounded-full px-2 py-0.5 text-xs font-bold">
              {t('cleaning.count', { count: cleaningStats.total })}
            </span>
          </div>
          <Link
            href="/dashboard/cleaning-maintenance"
            className="text-dashboard-primary-600 text-xs font-medium hover:underline"
          >
            {t('cleaning.viewAll')}
          </Link>
        </div>

        {cleaningPreview.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-dashboard-muted text-sm">{tCleaning('empty')}</p>
          </div>
        ) : (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-right text-sm">
              <thead className="text-neutral-dashboard-muted border-neutral-dashboard-border border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-2 font-medium">{tCleaning('cols.unit')}</th>
                  <th className="px-4 py-2 font-medium">{tCleaning('cols.project')}</th>
                  <th className="px-4 py-2 font-medium">{tCleaning('cols.type')}</th>
                  <th className="px-4 py-2 font-medium">{tCleaning('cols.date')}</th>
                  <th className="px-4 py-2 font-medium">{tCleaning('cols.status')}</th>
                  <th className="px-4 py-2 font-medium">{tCleaning('cols.change')}</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-dashboard-border divide-y">
                {cleaningPreview.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="text-neutral-dashboard-text px-4 py-2 font-medium">
                      {item.unitName}
                    </td>
                    <td className="text-neutral-dashboard-muted px-4 py-2">{item.projectName}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${TYPE_BADGE_STYLES[item.type] ?? ''}`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="text-neutral-dashboard-muted px-4 py-2">
                      {formatDate(item.createdAt, locale)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${STATUS_BADGE_STYLES[item.status] ?? ''}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
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
        )}
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FocusList
          title={t('todayFocus.arrivals')}
          emptyText={t('todayFocus.none')}
          items={arrivals.map((a) => ({
            id: a.bookingId,
            primary: a.guestName,
            secondary: `${a.projectName} • ${a.unitName}`,
          }))}
          tone="arrival"
        />
        <FocusList
          title={t('todayFocus.departures')}
          emptyText={t('todayFocus.none')}
          items={departures.map((d) => ({
            id: d.bookingId,
            primary: d.guestName,
            secondary: `${d.projectName} • ${d.unitName}`,
          }))}
          tone="departure"
        />
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-4 shadow-sm">
          <h3 className="text-neutral-dashboard-text mb-3 text-sm font-semibold">
            {t('upcoming.title')}
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-neutral-dashboard-muted text-sm">{t('upcoming.empty')}</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.slice(0, 6).map((b) => (
                <li
                  key={b.bookingId}
                  className="border-neutral-dashboard-border flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="text-neutral-dashboard-text text-sm font-semibold">{b.guestName}</p>
                    <p className="text-neutral-dashboard-muted text-xs">
                      {b.projectName} • {b.unitName}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-neutral-dashboard-text text-xs font-semibold">
                      {formatCurrency(b.totalPrice, locale)}
                    </p>
                    <p className="text-neutral-dashboard-muted text-[10px]">
                      {formatDate(b.checkInDate, locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {!summary ? (
        <p className="text-neutral-dashboard-muted text-center text-sm">
          {t('summaryUnavailable')}
        </p>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtext,
  icon,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-3 shadow-sm md:p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-dashboard-muted text-xs font-medium md:text-sm">{title}</p>
          <p className="text-neutral-dashboard-text mt-1 text-lg font-bold md:text-2xl">{value}</p>
          {subtext ? (
            <p className="text-neutral-dashboard-muted mt-1 text-[10px] md:text-xs">{subtext}</p>
          ) : null}
        </div>
        {icon ? <div className="text-neutral-dashboard-muted opacity-50">{icon}</div> : null}
      </div>
    </div>
  );
}

function FocusList({
  title,
  emptyText,
  items,
  tone,
}: {
  title: string;
  emptyText: string;
  items: { id: string; primary: string; secondary: string }[];
  tone: 'arrival' | 'departure';
}) {
  const dotColor = tone === 'arrival' ? 'bg-dashboard-primary-600' : 'bg-orange-500';
  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-4 shadow-sm">
      <h3 className="text-neutral-dashboard-text mb-3 text-sm font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="text-neutral-dashboard-muted text-sm">{emptyText}</p>
      ) : (
        <ul className="space-y-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-neutral-dashboard-border flex items-center gap-3 border-b py-2 last:border-0"
            >
              <div className={`h-2 w-2 rounded-full ${dotColor}`} />
              <div className="min-w-0">
                <p className="text-neutral-dashboard-text truncate text-sm font-semibold">
                  {item.primary}
                </p>
                <p className="text-neutral-dashboard-muted truncate text-xs">{item.secondary}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
