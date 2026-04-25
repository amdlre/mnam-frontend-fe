import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Briefcase, Building2, Folder, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { fetchOwners } from '@/lib/api/dashboard/entities';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';
import { OwnersTable } from '@/components/dashboard/features/owners/owners-table';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardOwnersPage({ params }: Props) {
  const { locale } = await params;
  const [t, owners] = await Promise.all([
    getTranslations('dashboard.owners'),
    fetchOwners(),
  ]);

  const totalProjects = owners.reduce((sum, o) => sum + o.projectCount, 0);
  const totalUnits = owners.reduce((sum, o) => sum + o.unitCount, 0);
  const avgUnits = owners.length === 0 ? 0 : Math.round((totalUnits / owners.length) * 10) / 10;

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button
            href="/dashboard/owners/new"
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
          value={owners.length}
          icon={<Briefcase className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.projects')}
          value={totalProjects}
          icon={<Folder className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.units')}
          value={totalUnits}
          icon={<Building2 className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.avgUnits')}
          value={avgUnits}
          icon={<TrendingUp className="text-slate-300" />}
        />
      </div>

      <OwnersTable owners={owners} />
    </div>
  );
}
