'use client';

import { useMemo, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteUnitAction } from '@/actions/dashboard/entities';
import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type { FetchedUnit } from '@/types/dashboard';

const STATUS_TONE: Record<string, string> = {
  متاحة: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  محجوزة: 'border-blue-200 bg-blue-50 text-blue-700',
  'تحتاج تنظيف': 'border-amber-200 bg-amber-50 text-amber-700',
  صيانة: 'border-red-200 bg-red-50 text-red-700',
  مخفية: 'border-slate-200 bg-slate-50 text-slate-600',
};

interface Props {
  units: FetchedUnit[];
}

export function UnitsTable({ units }: Props) {
  const t = useTranslations('dashboard.units');
  const tForm = useTranslations('dashboard.unitForm');
  const tTable = useTranslations('dashboard.dataTable');
  const router = useRouter();
  const confirm = useConfirm();
  const [, startTransition] = useTransition();

  async function handleDelete(unit: FetchedUnit) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: tTable('delete'),
      description: unit.unitName,
      confirmLabel: tTable('delete'),
      cancelLabel: tTable('clearSearch'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    const result = await deleteUnitAction(unit.id);
    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      await confirm({
        iconVariant: 'danger',
        title: tTable('delete'),
        description: result.message ?? tTable('delete'),
        confirmLabel: tTable('clearSearch'),
        cancelLabel: '',
      });
    }
  }

  const columns = useMemo<ColumnDef<FetchedUnit, unknown>[]>(
    () => [
      {
        accessorKey: 'unitName',
        header: t('cols.unit'),
        meta: { label: t('cols.unit') },
        cell: ({ row }) => <span className="font-medium">{row.original.unitName}</span>,
      },
      {
        accessorKey: 'projectName',
        header: t('cols.project'),
        meta: { label: t('cols.project') },
      },
      {
        accessorKey: 'unitType',
        header: t('cols.type'),
        meta: { label: t('cols.type') },
      },
      {
        accessorKey: 'rooms',
        header: t('cols.rooms'),
        meta: { label: t('cols.rooms') },
      },
      {
        accessorKey: 'priceDaysOfWeek',
        header: t('cols.priceWeekday'),
        meta: { label: t('cols.priceWeekday') },
        cell: ({ row }) => `${(row.original.priceDaysOfWeek ?? 0).toLocaleString()} ر.س`,
      },
      {
        accessorKey: 'priceInWeekends',
        header: t('cols.priceWeekend'),
        meta: { label: t('cols.priceWeekend') },
        cell: ({ row }) => `${(row.original.priceInWeekends ?? 0).toLocaleString()} ر.س`,
      },
      {
        accessorKey: 'status',
        header: t('cols.status'),
        meta: { label: t('cols.status') },
        cell: ({ row }) => (
          <span
            className={`rounded border px-2 py-0.5 text-[10px] ${STATUS_TONE[row.original.status] ?? 'border-slate-200 bg-slate-50 text-slate-600'}`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: 'actions',
        header: tTable('actions'),
        meta: { label: tTable('actions'), excludeFromExport: true },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/units/${row.original.id}`)}
              title={tTable('view')}
              className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/units/${row.original.id}/edit`)}
              title={tTable('edit')}
              className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row.original)}
              title={tTable('delete')}
              className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, tForm, tTable, router],
  );

  return (
    <EntityTable
      data={units}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['unitName', 'projectName', 'unitType', 'status', 'permit_no']}
      exportFilename="units"
    />
  );
}
