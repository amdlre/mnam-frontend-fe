'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@amdlre/design-system';

import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type {
  AuditLogEntry,
  AuditTypeOption,
  DeletedRecord,
} from '@/lib/api/dashboard/audit';

type Tab = 'logs' | 'deleted';

interface Props {
  logs: AuditLogEntry[];
  activityTypes: AuditTypeOption[];
  entityTypes: AuditTypeOption[];
  deletedRecords: DeletedRecord[];
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export function AuditTable({ logs, activityTypes, entityTypes, deletedRecords }: Props) {
  const t = useTranslations('dashboard.audit');
  const [tab, setTab] = useState<Tab>('logs');

  const logColumns = useMemo<ColumnDef<AuditLogEntry, unknown>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: t('cols.time'),
        meta: { label: t('cols.time') },
        cell: ({ row }) => (
          <span className="text-xs">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        accessorKey: 'userName',
        header: t('cols.user'),
        meta: { label: t('cols.user') },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="border-neutral-dashboard-border flex h-6 w-6 items-center justify-center rounded border bg-slate-100 text-xs font-bold text-slate-500">
              {row.original.userName?.charAt(0) ?? '?'}
            </div>
            <span className="text-sm font-medium">{row.original.userName ?? '—'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'activityType',
        header: t('cols.activity'),
        meta: { label: t('cols.activity') },
        cell: ({ row }) => (
          <span className="border-neutral-dashboard-border inline-block rounded border bg-slate-50 px-2 py-0.5 text-[10px]">
            {row.original.activityLabel}
          </span>
        ),
      },
      {
        accessorKey: 'entityType',
        header: t('cols.entity'),
        meta: { label: t('cols.entity') },
        cell: ({ row }) => (
          <div>
            <span className="border-neutral-dashboard-border inline-block rounded border bg-slate-50 px-1.5 py-0.5 text-xs">
              {row.original.entityLabel}
            </span>
            {row.original.entityName ? (
              <div className="mt-1 max-w-[150px] truncate text-xs font-medium">
                {row.original.entityName}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: t('cols.details'),
        meta: { label: t('cols.details') },
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <p className="text-neutral-dashboard-muted max-w-xs truncate text-xs">
              {row.original.description ?? '-'}
            </p>
            {row.original.ipAddress ? (
              <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                IP: {row.original.ipAddress}
              </p>
            ) : null}
          </div>
        ),
      },
    ],
    [t],
  );

  const deletedColumns = useMemo<ColumnDef<DeletedRecord, unknown>[]>(
    () => [
      {
        accessorKey: 'entityType',
        header: t('cols.entity'),
        meta: { label: t('cols.entity') },
        cell: ({ row }) => (
          <span className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] text-red-700">
            {row.original.entityLabel}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: t('cols.name'),
        meta: { label: t('cols.name') },
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: 'deletedAt',
        header: t('cols.deletedAt'),
        meta: { label: t('cols.deletedAt') },
        cell: ({ row }) => (
          <span className="text-xs">
            {row.original.deletedAt ? formatDate(row.original.deletedAt) : '-'}
          </span>
        ),
      },
      {
        accessorKey: 'deletedBy',
        header: t('cols.deletedBy'),
        meta: { label: t('cols.deletedBy') },
        cell: ({ row }) => <span className="text-xs">{row.original.deletedBy ?? '-'}</span>,
      },
    ],
    [t],
  );

  const logFilterConfigs = useMemo(
    () => [
      {
        key: 'activityType',
        label: t('allActivities'),
        options: activityTypes.map((a) => ({ value: a.value, label: a.label })),
      },
      {
        key: 'entityType',
        label: t('allEntities'),
        options: entityTypes.map((e) => ({ value: e.value, label: e.label })),
      },
    ],
    [t, activityTypes, entityTypes],
  );

  return (
    <Card className="border-neutral-dashboard-border">
      <CardContent className="p-0">
        <nav className="border-neutral-dashboard-border flex gap-2 border-b px-4 pt-2">
          <button
            type="button"
            onClick={() => setTab('logs')}
            className={
              tab === 'logs'
                ? 'border-dashboard-primary-600 text-dashboard-primary-600 -mb-px border-b-2 px-3 py-2 text-sm font-medium'
                : 'text-neutral-dashboard-muted -mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium'
            }
          >
            {t('tabs.logs')} ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('deleted')}
            className={
              tab === 'deleted'
                ? 'border-dashboard-primary-600 text-dashboard-primary-600 -mb-px border-b-2 px-3 py-2 text-sm font-medium'
                : 'text-neutral-dashboard-muted -mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium'
            }
          >
            {t('tabs.deleted')} ({deletedRecords.length})
          </button>
        </nav>

        <div className="p-4">
          {tab === 'logs' ? (
            <EntityTable
              data={logs}
              columns={logColumns}
              getRowId={(row) => row.id}
              searchableKeys={['userName', 'entityName', 'description', 'activityLabel', 'entityLabel']}
              filterConfigs={logFilterConfigs}
              exportFilename="audit-logs"
            />
          ) : (
            <EntityTable
              data={deletedRecords}
              columns={deletedColumns}
              getRowId={(row) => `${row.entityType}-${row.id}`}
              searchableKeys={['name', 'entityLabel', 'deletedBy']}
              exportFilename="deleted-records"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
