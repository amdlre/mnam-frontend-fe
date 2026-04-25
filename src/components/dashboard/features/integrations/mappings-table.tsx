'use client';

import { useMemo, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Trash2 } from 'lucide-react';

import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteMappingAction } from '@/actions/dashboard/integrations';
import { useRouter } from '@/i18n/navigation';
import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type { ChannexConnection, ExternalMapping } from '@/lib/api/dashboard/integrations';
import type { FetchedUnit } from '@/types/dashboard';

interface Props {
  mappings: ExternalMapping[];
  units: FetchedUnit[];
  connections: ChannexConnection[];
  onAddMapping: () => void;
  hasConnections: boolean;
}

interface MappingRow extends ExternalMapping {
  unitName: string;
  propertyName: string;
}

export function MappingsTable({
  mappings,
  units,
  connections,
  onAddMapping,
  hasConnections,
}: Props) {
  const t = useTranslations('dashboard.integrations');
  const tTable = useTranslations('dashboard.dataTable');
  const confirm = useConfirm();
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function handleDelete(mapping: ExternalMapping) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: t('deleteMapping'),
      description: t('deleteMappingConfirm'),
      confirmLabel: t('yesDelete'),
      cancelLabel: t('cancel'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    const result = await deleteMappingAction(mapping.id);
    if (!result.success) {
      await confirm({
        iconVariant: 'danger',
        title: t('actionFailed'),
        description: result.message ?? t('actionFailed'),
        confirmLabel: t('cancel'),
        cancelLabel: '',
      });
      return;
    }
    startTransition(() => router.refresh());
  }

  const rows = useMemo<MappingRow[]>(
    () =>
      mappings.map((m) => {
        const unit = m.unitId ? units.find((u) => u.id === m.unitId) : undefined;
        const conn = connections.find((c) => c.id === m.connectionId);
        return {
          ...m,
          unitName: unit?.unitName ?? (m.unitId ? m.unitId.substring(0, 8) : '-'),
          propertyName: conn?.channexPropertyId ?? 'Unknown',
        };
      }),
    [mappings, units, connections],
  );

  const columns = useMemo<ColumnDef<MappingRow, unknown>[]>(
    () => [
      {
        accessorKey: 'unitName',
        header: t('mappingCols.unit'),
        meta: { label: t('mappingCols.unit') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-text font-medium">{row.original.unitName}</span>
        ),
      },
      {
        accessorKey: 'propertyName',
        header: t('mappingCols.property'),
        meta: { label: t('mappingCols.property') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-muted font-mono text-xs">
            {row.original.propertyName.length > 15
              ? `${row.original.propertyName.substring(0, 15)}...`
              : row.original.propertyName}
          </span>
        ),
      },
      {
        accessorKey: 'channexRoomTypeId',
        header: t('mappingCols.roomType'),
        meta: { label: t('mappingCols.roomType') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-muted font-mono text-xs">
            {row.original.channexRoomTypeId}
          </span>
        ),
      },
      {
        accessorKey: 'channexRatePlanId',
        header: t('mappingCols.ratePlan'),
        meta: { label: t('mappingCols.ratePlan') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-muted font-mono text-xs">
            {row.original.channexRatePlanId}
          </span>
        ),
      },
      {
        accessorKey: 'isActive',
        header: t('mappingCols.status'),
        meta: { label: t('mappingCols.status') },
        cell: ({ row }) => (
          <span
            className={`rounded px-2 py-0.5 text-[10px] ${
              row.original.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {row.original.isActive ? t('mappingActive') : t('mappingInactive')}
          </span>
        ),
      },
      {
        id: 'lastSync',
        header: t('mappingCols.lastSync'),
        meta: { label: t('mappingCols.lastSync') },
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-neutral-dashboard-muted text-xs">
            <div>
              {t('syncPrice')}{' '}
              {row.original.lastPriceSyncAt
                ? new Date(row.original.lastPriceSyncAt).toLocaleDateString('ar-SA')
                : '-'}
            </div>
            <div>
              {t('syncAvail')}{' '}
              {row.original.lastAvailSyncAt
                ? new Date(row.original.lastAvailSyncAt).toLocaleDateString('ar-SA')
                : '-'}
            </div>
          </div>
        ),
      },
      {
        id: 'actions',
        header: tTable('actions'),
        meta: { label: tTable('actions'), excludeFromExport: true },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleDelete(row.original)}
            title={t('deleteMapping')}
            className="rounded p-1 text-slate-400 transition-colors hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, tTable],
  );

  if (mappings.length === 0) {
    return (
      <div className="border-neutral-dashboard-border bg-neutral-dashboard-card overflow-hidden rounded-md border shadow-sm">
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
            <Building2 className="text-neutral-dashboard-muted h-6 w-6" />
          </div>
          <h3 className="text-neutral-dashboard-text mb-1 font-medium">{t('mappingsEmpty')}</h3>
          <p className="text-neutral-dashboard-muted mb-4 text-sm">{t('mappingsEmptyHint')}</p>
          <button
            type="button"
            onClick={onAddMapping}
            disabled={!hasConnections}
            className="text-dashboard-primary-600 hover:text-dashboard-primary-700 text-sm font-medium disabled:opacity-50"
          >
            {t('linkUnitNow')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <EntityTable
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['unitName', 'propertyName', 'channexRoomTypeId', 'channexRatePlanId']}
      exportFilename="mappings"
    />
  );
}
