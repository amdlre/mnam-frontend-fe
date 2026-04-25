import { getTranslations } from 'next-intl/server';
import { BarChart3, ListChecks, Trash2, Users } from 'lucide-react';
import { Card, CardContent, Typography } from '@amdlre/design-system';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';

export async function AuditDashboard() {
  const t = await getTranslations('dashboard.audit');

  // Stats and rows will populate once /api/audit is wired on the backend.
  const stats = { total: 0, deleted: 0, types: 0, users: 0 };

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard label={t('stats.total')} value={stats.total} icon={<BarChart3 className="text-slate-300" />} />
        <StatCard
          label={t('stats.deleted')}
          value={stats.deleted}
          subtitle={t('stats.deletedSub')}
          icon={<Trash2 className="text-slate-300" />}
        />
        <StatCard label={t('stats.types')} value={stats.types} icon={<ListChecks className="text-slate-300" />} />
        <StatCard label={t('stats.users')} value={stats.users} icon={<Users className="text-slate-300" />} />
      </div>

      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-0">
          <nav className="border-neutral-dashboard-border flex gap-2 border-b px-4 pt-2">
            <button
              type="button"
              className="border-dashboard-primary-600 text-dashboard-primary-600 -mb-px border-b-2 px-3 py-2 text-sm font-medium"
            >
              {t('tabs.logs')}
            </button>
            <button
              type="button"
              className="text-neutral-dashboard-muted -mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium"
            >
              {t('tabs.deleted')}
            </button>
          </nav>

          <div className="border-neutral-dashboard-border flex flex-wrap items-center gap-3 border-b p-4">
            <input
              type="text"
              placeholder={t('search')}
              className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 min-w-[200px] flex-grow rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              disabled
            />
            <select
              className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 min-w-[140px] rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              disabled
            >
              <option>{t('allActivities')}</option>
            </select>
            <select
              className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 min-w-[140px] rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              disabled
            >
              <option>{t('allEntities')}</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-neutral-dashboard-border text-neutral-dashboard-muted border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('cols.time')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.user')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.activity')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.entity')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.details')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-neutral-dashboard-muted px-4 py-12 text-center">
                    {t('empty')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Typography as="p" variant="muted" className="text-xs">
        {t('comingSoon')}
      </Typography>
    </div>
  );
}
