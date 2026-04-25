import { getTranslations } from 'next-intl/server';
import { Typography } from '@amdlre/design-system';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';

import { FinancialsTabs } from './financials-tabs';

const ZERO = { income: 0, occupancy: 0, nights: 0, cancellations: 0 };

export async function FinancialsDashboard() {
  const t = await getTranslations('dashboard.financials');

  // Real numbers will plug in once the backend exposes /api/dashboard/team-achievement.
  const data = { daily: ZERO, weekly: ZERO, monthly: ZERO };

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <FinancialsTabs
        data={data}
        labels={{
          tabs: {
            daily: t('tabs.daily'),
            weekly: t('tabs.weekly'),
            monthly: t('tabs.monthly'),
          },
          income: t('stats.income'),
          occupiedUnits: t('stats.occupiedUnits'),
          occupancy: t('stats.occupancy'),
          nights: t('stats.nights'),
          cancellations: t('stats.cancellations'),
          currency: t('currency'),
          exportTitle: t('exportTitle'),
          exportFormat: t('exportFormat'),
          exportLabels: {
            daily: t('exportDaily'),
            weekly: t('exportWeekly'),
            monthly: t('exportMonthly'),
          },
        }}
      />

      <Typography as="p" variant="muted" className="text-xs">
        {t('comingSoon')}
      </Typography>
    </div>
  );
}
