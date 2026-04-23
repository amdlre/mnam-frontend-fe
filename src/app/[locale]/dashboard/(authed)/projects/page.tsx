import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Folder, Plus } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { fetchProjects } from '@/lib/api/dashboard/entities';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const CONTRACT_STATUS_STYLES: Record<string, string> = {
  ساري: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  منتهي: 'bg-red-50 text-red-700 border-red-200',
  'موقف مؤقتاً': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default async function DashboardProjectsPage({ params }: Props) {
  await params;
  const [t, projects] = await Promise.all([
    getTranslations('dashboard.projects'),
    fetchProjects(),
  ]);

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Link
            href="/dashboard/projects/new"
            className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t('add')}</span>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border p-12 text-center shadow-sm">
          <Folder className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-neutral-dashboard-muted text-sm">{t('empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => {
            const badge = p.contractStatus
              ? CONTRACT_STATUS_STYLES[p.contractStatus] ?? 'bg-slate-50 text-slate-600 border-slate-200'
              : 'bg-slate-50 text-slate-600 border-slate-200';
            return (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="bg-neutral-dashboard-card border-neutral-dashboard-border hover:border-dashboard-primary-300 block rounded-md border p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-neutral-dashboard-text truncate text-base font-bold">
                      {p.name}
                    </h3>
                    <p className="text-neutral-dashboard-muted mt-0.5 truncate text-xs">
                      {p.ownerName}
                    </p>
                  </div>
                  {p.contractStatus ? (
                    <span className={`rounded border px-2 py-0.5 text-[10px] ${badge}`}>
                      {p.contractStatus}
                    </span>
                  ) : null}
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-neutral-dashboard-muted">{t('city')}</dt>
                    <dd className="text-neutral-dashboard-text mt-0.5">{p.city || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-dashboard-muted">{t('district')}</dt>
                    <dd className="text-neutral-dashboard-text mt-0.5">{p.district || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-dashboard-muted">{t('units')}</dt>
                    <dd className="text-neutral-dashboard-text mt-0.5 font-semibold">
                      {p.unitCount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-dashboard-muted">{t('commission')}</dt>
                    <dd className="text-neutral-dashboard-text mt-0.5">
                      {p.commissionPercent != null ? `${p.commissionPercent}%` : '-'}
                    </dd>
                  </div>
                </dl>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
