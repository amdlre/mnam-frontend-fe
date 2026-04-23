'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { CLEANING_REQUEST_STATUSES, CLEANING_REQUEST_TYPES } from '@/types/dashboard';

export function CleaningFilters() {
  const t = useTranslations('dashboard.cleaning');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) params.delete(key);
    else params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const currentType = searchParams.get('type') || 'all';
  const currentStatus = searchParams.get('status') || 'all';

  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <label className="text-neutral-dashboard-muted mb-1 block text-xs font-medium">
          {t('type')}
        </label>
        <select
          value={currentType}
          onChange={(e) => update('type', e.target.value)}
          className="border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-text focus:ring-dashboard-primary-500 focus:border-dashboard-primary-500 rounded-md border px-3 py-1.5 text-xs outline-none focus:ring-1"
        >
          <option value="all">{t('all')}</option>
          {CLEANING_REQUEST_TYPES.map((tt) => (
            <option key={tt} value={tt}>
              {tt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-neutral-dashboard-muted mb-1 block text-xs font-medium">
          {t('status')}
        </label>
        <select
          value={currentStatus}
          onChange={(e) => update('status', e.target.value)}
          className="border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-text focus:ring-dashboard-primary-500 focus:border-dashboard-primary-500 rounded-md border px-3 py-1.5 text-xs outline-none focus:ring-1"
        >
          <option value="all">{t('all')}</option>
          {CLEANING_REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
