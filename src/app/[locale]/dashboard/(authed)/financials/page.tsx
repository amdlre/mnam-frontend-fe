import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DollarSign } from 'lucide-react';

import { ComingSoon } from '@/components/dashboard/features/coming-soon';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardFinancialsPage() {
  const [t, tStub] = await Promise.all([
    getTranslations('dashboard.nav'),
    getTranslations('dashboard.stub'),
  ]);
  return <ComingSoon title={t('financials')} subtitle={tStub('subtitle')} body={tStub('body')} icon={DollarSign} />;
}
