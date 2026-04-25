'use client';

import { useMemo, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteOwnerAction } from '@/actions/dashboard/entities';
import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type { Owner } from '@/types/dashboard';

interface Props {
  owners: Owner[];
}

export function OwnersTable({ owners }: Props) {
  const t = useTranslations('dashboard.owners');
  const tTable = useTranslations('dashboard.dataTable');
  const router = useRouter();
  const confirm = useConfirm();
  const [, startTransition] = useTransition();

  async function handleDelete(owner: Owner) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: tTable('delete'),
      description: `${t('cols.name')}: ${owner.ownerName}`,
      confirmLabel: tTable('delete'),
      cancelLabel: tTable('clearSearch'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    const result = await deleteOwnerAction(owner.id);
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

  const columns = useMemo<ColumnDef<Owner, unknown>[]>(
    () => [
      {
        accessorKey: 'ownerName',
        header: t('cols.name'),
        meta: { label: t('cols.name') },
        cell: ({ row }) => (
          <span className="font-medium">{row.original.ownerName}</span>
        ),
      },
      {
        accessorKey: 'ownerMobilePhone',
        header: t('cols.phone'),
        meta: { label: t('cols.phone') },
        cell: ({ row }) => (
          <span className="font-mono text-xs" dir="ltr">
            {row.original.ownerMobilePhone}
          </span>
        ),
      },
      {
        accessorKey: 'paypalEmail',
        header: t('cols.email'),
        meta: { label: t('cols.email') },
        cell: ({ row }) => row.original.paypalEmail || '—',
      },
      {
        accessorKey: 'projectCount',
        header: t('cols.projects'),
        meta: { label: t('cols.projects') },
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.projectCount}</span>
        ),
      },
      {
        accessorKey: 'unitCount',
        header: t('cols.units'),
        meta: { label: t('cols.units') },
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.unitCount}</span>
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
              onClick={() => router.push(`/dashboard/owners/${row.original.id}`)}
              title={tTable('view')}
              className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/owners/${row.original.id}/edit`)}
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
    [t, tTable, router],
  );

  return (
    <EntityTable
      data={owners}
      columns={columns}
      getRowId={(row) => row.id}
      exportFilename="owners"
    />
  );
}
