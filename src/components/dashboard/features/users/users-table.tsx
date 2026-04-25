'use client';

import { useMemo, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteUserAction } from '@/actions/dashboard/users';
import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type { SystemUser } from '@/types/dashboard';

interface UserRow extends SystemUser {
  fullName: string;
  isActiveLabel: string;
}

interface Props {
  users: SystemUser[];
}

export function UsersTable({ users }: Props) {
  const t = useTranslations('dashboard.users');
  const tRoles = useTranslations('dashboard.roles');
  const tTable = useTranslations('dashboard.dataTable');
  const router = useRouter();
  const confirm = useConfirm();
  const [, startTransition] = useTransition();

  async function handleDelete(user: UserRow) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: t('deleteTitle'),
      description: t('deleteConfirm', { name: user.fullName || user.username }),
      confirmLabel: t('deleteConfirmLabel'),
      cancelLabel: t('deleteCancelLabel'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    const result = await deleteUserAction(user.id);
    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      await confirm({
        iconVariant: 'danger',
        title: t('deleteFailed'),
        description: result.message ?? t('deleteFailed'),
        confirmLabel: t('deleteCancelLabel'),
        cancelLabel: '',
      });
    }
  }

  const rows = useMemo<UserRow[]>(
    () =>
      users.map((u) => ({
        ...u,
        fullName: `${u.firstName} ${u.lastName}`.trim(),
        isActiveLabel: u.isActive ? t('active') : t('inactive'),
      })),
    [users, t],
  );

  const columns = useMemo<ColumnDef<UserRow, unknown>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: t('cols.user'),
        meta: { label: t('cols.user') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-text font-medium">{row.original.fullName}</span>
        ),
      },
      {
        accessorKey: 'username',
        header: t('cols.username'),
        meta: { label: t('cols.username') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-text font-mono text-xs">
            @{row.original.username}
          </span>
        ),
      },
      {
        accessorKey: 'role',
        header: t('cols.role'),
        meta: { label: t('cols.role') },
        cell: ({ row }) => (
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600">
            {tRoles(row.original.role)}
          </span>
        ),
      },
      {
        accessorKey: 'isActive',
        header: t('cols.status'),
        meta: { label: t('cols.status') },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                row.original.isActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span
              className={`text-xs ${
                row.original.isActive ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {row.original.isActiveLabel}
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: t('cols.actions'),
        meta: { label: t('cols.actions'), excludeFromExport: true },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) =>
          row.original.isSystemOwner ? null : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/users/${row.original.id}`)}
                title={tTable('view')}
                className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/users/${row.original.id}/edit`)}
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
    [t, tRoles, tTable, router],
  );

  const filterConfigs = useMemo(
    () => [
      {
        key: 'role',
        label: t('allRoles'),
        options: [
          { value: 'admin', label: t('roleAdmin') },
          { value: 'customers_agent', label: t('roleCustomersAgent') },
          { value: 'owners_agent', label: t('roleOwnersAgent') },
        ],
      },
      {
        key: 'isActive',
        label: t('allStatuses'),
        options: [
          { value: 'true', label: t('active') },
          { value: 'false', label: t('inactive') },
        ],
      },
    ],
    [t],
  );

  return (
    <EntityTable
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['fullName', 'username', 'email', 'phone']}
      filterConfigs={filterConfigs}
      exportFilename="users"
    />
  );
}
