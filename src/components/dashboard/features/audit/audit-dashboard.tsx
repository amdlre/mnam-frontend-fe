import { getTranslations } from 'next-intl/server';
import { BarChart3, ListChecks, Trash2, Users } from 'lucide-react';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';
import {
  fetchAuditActivityTypes,
  fetchAuditEntityTypes,
  fetchAuditLogs,
  fetchAuditStats,
  fetchDeletedRecords,
} from '@/lib/api/dashboard/audit';

import { AuditTable } from './audit-table';

export async function AuditDashboard() {
  const [t, page, stats, activityTypes, entityTypes, deletedRecords] = await Promise.all([
    getTranslations('dashboard.audit'),
    fetchAuditLogs({ page: 1, pageSize: 1000 }),
    fetchAuditStats(7),
    fetchAuditActivityTypes(),
    fetchAuditEntityTypes(),
    fetchDeletedRecords(),
  ]);

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          label={t('stats.total')}
          value={stats.totalActivities}
          icon={<BarChart3 className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.deleted')}
          value={stats.deletedRecordsCount}
          subtitle={t('stats.deletedSub')}
          icon={<Trash2 className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.types')}
          value={Object.keys(stats.byActivityType).length}
          icon={<ListChecks className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.users')}
          value={stats.topUsers.length}
          icon={<Users className="text-slate-300" />}
        />
      </div>

      <AuditTable
        logs={page.logs}
        activityTypes={activityTypes}
        entityTypes={entityTypes}
        deletedRecords={deletedRecords}
      />
    </div>
  );
}
