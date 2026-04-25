import { getTranslations } from 'next-intl/server';
import { AlertTriangle, DollarSign, Plus, User, UserCheck } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';
import { fetchCustomers, fetchCustomerStats } from '@/lib/api/dashboard/customers';

import { CustomersTable } from './customers-table';

interface Props {
  locale: string;
}

export async function CustomersDashboard({ locale }: Props) {
  const [t, customers, stats] = await Promise.all([
    getTranslations('dashboard.customers'),
    fetchCustomers(),
    fetchCustomerStats(),
  ]);

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
        <StatCard
          label={t('stats.total')}
          value={stats.totalCustomers}
          icon={<User className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.vip')}
          value={stats.vipCustomers}
          subtitle={t('stats.vipSub')}
          icon={<UserCheck className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.incomplete')}
          value={stats.incompleteProfiles}
          subtitle={t('stats.incompleteSub')}
          valueTone="warning"
          icon={<AlertTriangle className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.revenue')}
          value={`${stats.totalRevenue.toLocaleString()} ر.س`}
          icon={<DollarSign className="text-slate-300" />}
        />
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
