'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, UserPlus } from 'lucide-react';

interface Props {
  locale: string;
}

export function UsersFilters({ locale }: Props) {
  const t = useTranslations('dashboard.users');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all' || value === 'grid') params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const currentSearch = searchParams.get('q') || '';
  const currentRole = searchParams.get('role') || 'all';
  const currentStatus = searchParams.get('status') || 'all';
  const currentView = searchParams.get('view') || 'grid';

  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border flex flex-wrap items-center gap-4 rounded-md border p-4 shadow-sm">
      <div className="relative min-w-[200px] flex-grow">
        <Search className="text-neutral-dashboard-muted absolute top-2.5 end-3 h-4 w-4" />
        <input
          type="search"
          value={currentSearch}
          onChange={(e) => update('q', e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 focus:border-dashboard-primary-500 w-full rounded-md border py-2 ps-3 pe-9 text-sm focus:ring-1"
        />
      </div>

      <select
        value={currentRole}
        onChange={(e) => update('role', e.target.value)}
        className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 min-w-[140px] rounded-md border px-3 py-2 text-sm focus:ring-1"
      >
        <option value="all">{t('allRoles')}</option>
        <option value="admin">{t('roleAdmin')}</option>
        <option value="customers_agent">{t('roleCustomersAgent')}</option>
        <option value="owners_agent">{t('roleOwnersAgent')}</option>
      </select>

      <select
        value={currentStatus}
        onChange={(e) => update('status', e.target.value)}
        className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 min-w-[140px] rounded-md border px-3 py-2 text-sm focus:ring-1"
      >
        <option value="all">{t('allStatuses')}</option>
        <option value="active">{t('active')}</option>
        <option value="inactive">{t('inactive')}</option>
      </select>

      <div className="border-neutral-dashboard-border flex rounded border bg-slate-100 p-0.5">
        <button
          type="button"
          onClick={() => update('view', 'grid')}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${currentView === 'grid'
            ? 'text-dashboard-primary-600 bg-white shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
            }`}
        >
          {t('grid')}
        </button>
        <button
          type="button"
          onClick={() => update('view', 'table')}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${currentView === 'table'
            ? 'text-dashboard-primary-600 bg-white shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
            }`}
        >
          {t('table')}
        </button>
      </div>
    </div>
  );
}
