import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Building2, CalendarCheck, CheckCircle2, Plus, Wrench } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { fetchUnits } from '@/lib/api/dashboard/units';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';
import { UnitsTable } from '@/components/dashboard/features/units/units-table';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardUnitsPage({ params }: Props) {
  const { locale } = await params;
  const [t, units] = await Promise.all([
    getTranslations('dashboard.units'),
    fetchUnits(),
  ]);

  const availableUnits = units.filter((u) => u.status === 'متاحة').length;
  const bookedUnits = units.filter((u) => u.status === 'محجوزة').length;
  const maintenanceUnits = units.filter((u) => u.status === 'صيانة').length;

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button
            href="/dashboard/units/new"
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
          value={units.length}
          icon={<Building2 className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.available')}
          value={availableUnits}
          valueTone="success"
          icon={<CheckCircle2 className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.booked')}
          value={bookedUnits}
          valueTone="info"
          icon={<CalendarCheck className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.maintenance')}
          value={maintenanceUnits}
          valueTone="danger"
          icon={<Wrench className="text-slate-300" />}
        />
      </div>

      <UnitsTable units={units} />
    </div>
  );
}
