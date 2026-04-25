'use client';

import { useMemo, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteProjectAction } from '@/actions/dashboard/entities';
import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type { Project } from '@/types/dashboard';

const STATUS_TONE: Record<string, string> = {
  ساري: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  منتهي: 'border-red-200 bg-red-50 text-red-700',
  'موقف مؤقتاً': 'border-amber-200 bg-amber-50 text-amber-700',
};

interface Props {
  projects: Project[];
}

export function ProjectsTable({ projects }: Props) {
  const t = useTranslations('dashboard.projects');
  const tForm = useTranslations('dashboard.projectForm');
  const tTable = useTranslations('dashboard.dataTable');
  const router = useRouter();
  const confirm = useConfirm();
  const [, startTransition] = useTransition();

  async function handleDelete(project: Project) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: tTable('delete'),
      description: project.name,
      confirmLabel: tTable('delete'),
      cancelLabel: tTable('clearSearch'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    const result = await deleteProjectAction(project.id);
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

  const columns = useMemo<ColumnDef<Project, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: tForm('name'),
        meta: { label: tForm('name') },
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: 'ownerName',
        header: tForm('owner'),
        meta: { label: tForm('owner') },
      },
      {
        accessorKey: 'city',
        header: t('city'),
        meta: { label: t('city') },
        cell: ({ row }) => row.original.city ?? '—',
      },
      {
        accessorKey: 'unitCount',
        header: t('units'),
        meta: { label: t('units') },
        cell: ({ row }) => <span className="font-semibold">{row.original.unitCount}</span>,
      },
      {
        accessorKey: 'contractStatus',
        header: tForm('contractStatus'),
        meta: { label: tForm('contractStatus') },
        cell: ({ row }) => {
          const s = row.original.contractStatus;
          if (!s) return '—';
          return (
            <span
              className={`rounded border px-2 py-0.5 text-[10px] ${STATUS_TONE[s] ?? 'border-slate-200 bg-slate-50 text-slate-600'}`}
            >
              {s}
            </span>
          );
        },
      },
      {
        accessorKey: 'commissionPercent',
        header: t('commission'),
        meta: { label: t('commission') },
        cell: ({ row }) => `${row.original.commissionPercent ?? 0}%`,
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
              onClick={() => router.push(`/dashboard/projects/${row.original.id}`)}
              title={tTable('view')}
              className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/projects/${row.original.id}/edit`)}
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
      data={projects}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['name', 'ownerName', 'city', 'district', 'contractNo']}
      exportFilename="projects"
    />
  );
}
