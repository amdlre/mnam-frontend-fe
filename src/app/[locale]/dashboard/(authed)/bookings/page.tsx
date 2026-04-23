import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ClipboardList, Plus } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { fetchBookingsPaginated } from '@/lib/api/dashboard/entities';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const BOOKING_STATUS_STYLES: Record<string, string> = {
  مؤكد: 'bg-blue-50 text-blue-700 border-blue-200',
  دخول: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  خروج: 'bg-amber-50 text-amber-700 border-amber-200',
  مكتمل: 'bg-slate-50 text-slate-600 border-slate-200',
  ملغي: 'bg-red-50 text-red-700 border-red-200',
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

export default async function DashboardBookingsPage({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = 20;

  const [t, result] = await Promise.all([
    getTranslations('dashboard.bookings'),
    fetchBookingsPaginated(page, pageSize),
  ]);

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle', { total: result.total })}
        actions={
          <Link
            href="/dashboard/bookings/new"
            className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t('add')}</span>
          </Link>
        }
      />

      {result.items.length === 0 ? (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-12 text-center shadow-sm">
          <ClipboardList className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-neutral-dashboard-muted text-sm">{t('empty')}</p>
        </div>
      ) : (
        <>
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border overflow-hidden rounded-md border shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-right text-sm">
                <thead className="text-neutral-dashboard-muted border-neutral-dashboard-border border-b bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t('cols.guest')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.unit')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.project')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.checkIn')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.checkOut')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.price')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.status')}</th>
                    <th className="px-4 py-3 font-medium">{t('cols.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-neutral-dashboard-border divide-y">
                  {result.items.map((b) => {
                    const badge = BOOKING_STATUS_STYLES[b.status] ?? 'bg-slate-50 text-slate-600 border-slate-200';
                    return (
                      <tr key={b.id} className="transition-colors hover:bg-slate-50">
                        <td className="text-neutral-dashboard-text px-4 py-3 font-medium">
                          {b.guestName}
                        </td>
                        <td className="text-neutral-dashboard-muted px-4 py-3">{b.unitName || '-'}</td>
                        <td className="text-neutral-dashboard-muted px-4 py-3">
                          {b.projectName || '-'}
                        </td>
                        <td className="text-neutral-dashboard-muted px-4 py-3">
                          {formatDate(b.checkInDate, locale)}
                        </td>
                        <td className="text-neutral-dashboard-muted px-4 py-3">
                          {formatDate(b.checkOutDate, locale)}
                        </td>
                        <td className="text-neutral-dashboard-text px-4 py-3 font-semibold">
                          {formatCurrency(b.totalPrice, locale)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded border px-2 py-0.5 text-[10px] ${badge}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/bookings/${b.id}`}
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

          {result.totalPages > 1 ? (
            <nav className="flex items-center justify-between gap-2 text-sm">
              <PagerLink
                disabled={!result.hasPrevious}
                page={page - 1}
                label={t('pager.prev')}
              />
              <span className="text-neutral-dashboard-muted">
                {t('pager.page', { page: result.page, total: result.totalPages })}
              </span>
              <PagerLink
                disabled={!result.hasNext}
                page={page + 1}
                label={t('pager.next')}
              />
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}

function PagerLink({
  page,
  label,
  disabled,
}: {
  page: number;
  label: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="border-neutral-dashboard-border text-neutral-dashboard-muted cursor-not-allowed rounded border px-3 py-1.5 text-xs opacity-50">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/dashboard/bookings?page=${page}`}
      className="border-neutral-dashboard-border text-neutral-dashboard-text hover:border-dashboard-primary-300 hover:text-dashboard-primary-600 rounded border px-3 py-1.5 text-xs transition-colors"
    >
      {label}
    </Link>
  );
}
