import { getTranslations } from 'next-intl/server';
import { AlertTriangle, DollarSign, Plus, User, UserCheck } from 'lucide-react';
import { Button, Card, CardContent, Typography } from '@amdlre/design-system';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';

interface Props {
  locale: string;
}

export async function CustomersDashboard({ locale }: Props) {
  const t = await getTranslations('dashboard.customers');

  // Stats and rows will populate once /api/customers is wired on the backend.
  const stats = { total: 0, vip: 0, incomplete: 0, revenue: 0 };

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button
            href="/dashboard/customers/new"
            locale={locale}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {t('add')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard label={t('stats.total')} value={stats.total} icon={<User className="text-slate-300" />} />
        <StatCard
          label={t('stats.vip')}
          value={stats.vip}
          subtitle={t('stats.vipSub')}
          icon={<UserCheck className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.incomplete')}
          value={stats.incomplete}
          subtitle={t('stats.incompleteSub')}
          valueTone="warning"
          icon={<AlertTriangle className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.revenue')}
          value={`${stats.revenue.toLocaleString()} ر.س`}
          icon={<DollarSign className="text-slate-300" />}
        />
      </div>

      <Card className="border-neutral-dashboard-border">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <input
            type="text"
            placeholder={t('search')}
            className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 min-w-[200px] flex-grow rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            disabled
          />
          <select
            className="border-neutral-dashboard-border focus:ring-dashboard-primary-500 rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            disabled
          >
            <option>{t('filters.all')}</option>
            <option>{t('filters.incomplete')}</option>
            <option>{t('filters.vip')}</option>
            <option>{t('filters.new')}</option>
            <option>{t('filters.banned')}</option>
          </select>
        </CardContent>
      </Card>

      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-neutral-dashboard-border text-neutral-dashboard-muted border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('cols.customer')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.type')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.bookings')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.profile')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.actions')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <User className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                    <p className="text-neutral-dashboard-muted">{t('empty')}</p>
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
