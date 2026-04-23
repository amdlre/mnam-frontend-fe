import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Building2, Plus } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { fetchUnits } from '@/lib/api/dashboard/units';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  متاحة: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  محجوزة: 'bg-blue-50 text-blue-700 border-blue-200',
  'تحتاج تنظيف': 'bg-amber-50 text-amber-700 border-amber-200',
  صيانة: 'bg-red-50 text-red-700 border-red-200',
  مخفية: 'bg-slate-50 text-slate-600 border-slate-200',
};

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardUnitsPage({ params }: Props) {
  const { locale } = await params;
  const [t, units] = await Promise.all([
    getTranslations('dashboard.units'),
    fetchUnits(),
  ]);

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Link
            href="/dashboard/units/new"
            className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t('add')}</span>
          </Link>
        }
      />

      {units.length === 0 ? (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-12 text-center shadow-sm">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-neutral-dashboard-muted text-sm">{t('empty')}</p>
        </div>
      ) : (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border overflow-hidden rounded-md border shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="text-neutral-dashboard-muted border-neutral-dashboard-border border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('cols.unit')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.project')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.type')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.rooms')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.priceWeekday')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.priceWeekend')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.status')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-dashboard-border divide-y">
                {units.map((u) => {
                  const badge = STATUS_STYLES[u.status] ?? 'bg-slate-50 text-slate-600 border-slate-200';
                  return (
                    <tr key={u.id} className="transition-colors hover:bg-slate-50">
                      <td className="text-neutral-dashboard-text px-4 py-3 font-medium">
                        {u.unitName}
                      </td>
                      <td className="text-neutral-dashboard-muted px-4 py-3">{u.projectName}</td>
                      <td className="text-neutral-dashboard-muted px-4 py-3">{u.unitType}</td>
                      <td className="text-neutral-dashboard-text px-4 py-3">{u.rooms}</td>
                      <td className="text-neutral-dashboard-text px-4 py-3">
                        {formatCurrency(u.priceDaysOfWeek, locale)}
                      </td>
                      <td className="text-neutral-dashboard-text px-4 py-3">
                        {formatCurrency(u.priceInWeekends, locale)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded border px-2 py-0.5 text-[10px] ${badge}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/units/${u.id}`}
                          className="text-dashboard-primary-600 text-xs font-medium hover:underline"
                        >
                          {t('cols.view')}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
