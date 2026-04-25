import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Building2, CheckCircle2, Folder, Plus, XCircle } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { fetchProjects } from '@/lib/api/dashboard/entities';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';
import { ProjectsTable } from '@/components/dashboard/features/projects/projects-table';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardProjectsPage({ params }: Props) {
  const { locale } = await params;
  const [t, projects] = await Promise.all([
    getTranslations('dashboard.projects'),
    fetchProjects(),
  ]);

  const activeContracts = projects.filter((p) => p.contractStatus === 'ساري').length;
  const expiredContracts = projects.filter((p) => p.contractStatus === 'منتهي').length;
  const totalUnits = projects.reduce((sum, p) => sum + p.unitCount, 0);

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button
            href="/dashboard/projects/new"
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
          value={projects.length}
          icon={<Folder className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.active')}
          value={activeContracts}
          valueTone="success"
          icon={<CheckCircle2 className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.expired')}
          value={expiredContracts}
          valueTone="danger"
          icon={<XCircle className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.totalUnits')}
          value={totalUnits}
          icon={<Building2 className="text-slate-300" />}
        />
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
