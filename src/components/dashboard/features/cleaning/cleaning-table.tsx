'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { EntityTable } from '@/components/dashboard/shared/entity-table';
import {
  STATUS_BADGE_STYLES,
  TYPE_BADGE_STYLES,
} from '@/components/dashboard/features/cleaning/badges';
import { CleaningStatusSelect } from '@/components/dashboard/features/cleaning/status-select';

import type { ColumnDef } from '@tanstack/react-table';
import type {
  CleaningMaintenanceRequest,
  CleaningRequestStatus,
  CleaningRequestType,
} from '@/types/dashboard';

interface Props {
  requests: CleaningMaintenanceRequest[];
  locale: string;
}

const TYPES: CleaningRequestType[] = ['تنظيف', 'صيانة'];
const STATUSES: CleaningRequestStatus[] = ['جديد', 'قيد التنفيذ', 'مكتمل', 'ملغي'];

function formatDate(value: string, locale: string) {
  try {
    return new Date(value).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US');
  } catch {
    return value;
  }
}

export function CleaningTable({ requests, locale }: Props) {
  const t = useTranslations('dashboard.cleaning');

  const columns = useMemo<ColumnDef<CleaningMaintenanceRequest, unknown>[]>(
    () => [
      {
        accessorKey: 'unitName',
        header: t('cols.unit'),
        meta: { label: t('cols.unit') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-text font-medium">{row.original.unitName}</span>
        ),
      },
      {
        accessorKey: 'projectName',
        header: t('cols.project'),
        meta: { label: t('cols.project') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-muted">{row.original.projectName}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: t('cols.type'),
        meta: { label: t('cols.type') },
        cell: ({ row }) => (
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold ${TYPE_BADGE_STYLES[row.original.type]}`}
          >
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('cols.date'),
        meta: { label: t('cols.date') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-muted">
            {formatDate(row.original.createdAt, locale)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('cols.status'),
        meta: { label: t('cols.status') },
        cell: ({ row }) => (
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold ${STATUS_BADGE_STYLES[row.original.status]}`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: 'change',
        header: t('cols.change'),
        meta: { label: t('cols.change'), excludeFromExport: true },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <CleaningStatusSelect
            requestId={row.original.id}
            currentStatus={row.original.status as CleaningRequestStatus}
          />
        ),
      },
    ],
    [t, locale],
  );

  const filterConfigs = useMemo(
    () => [
      {
        key: 'type',
        label: t('cols.type'),
        options: TYPES.map((v) => ({ value: v, label: v })),
      },
      {
        key: 'status',
        label: t('cols.status'),
        options: STATUSES.map((v) => ({ value: v, label: v })),
      },
    ],
    [t],
  );

  return (
    <EntityTable
      data={requests}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['unitName', 'projectName', 'type', 'status']}
      filterConfigs={filterConfigs}
      exportFilename="cleaning-maintenance"
    />
  );
}
