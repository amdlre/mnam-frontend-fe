'use client';

import { useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Ban, Check, Loader2, Pencil, Trash2 } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { banCustomerAction, deleteCustomerAction } from '@/actions/dashboard/customers';
import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type { Customer } from '@/lib/api/dashboard/customers';

interface Props {
  customers: Customer[];
}

export function CustomersTable({ customers }: Props) {
  const t = useTranslations('dashboard.customers');
  const tTable = useTranslations('dashboard.dataTable');
  const router = useRouter();
  const confirm = useConfirm();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleDelete(customer: Customer) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: t('deleteConfirmTitle'),
      description: t('deleteConfirmBody', { name: customer.name }),
      confirmLabel: t('deleteConfirmYes'),
      cancelLabel: t('cancel'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    setPendingId(customer.id);
    const result = await deleteCustomerAction(customer.id);
    setPendingId(null);
    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      await confirm({
        iconVariant: 'danger',
        title: t('actionFailed'),
        description: result.message ?? t('actionFailed'),
        confirmLabel: t('cancel'),
        cancelLabel: '',
      });
    }
  }

  async function handleBanToggle(customer: Customer) {
    const willBan = !customer.isBanned;
    const ok = await confirm({
      iconVariant: willBan ? 'warning' : 'info',
      title: willBan ? t('banConfirmTitle') : t('unbanConfirmTitle'),
      description: willBan
        ? t('banConfirmBody', { name: customer.name })
        : t('unbanConfirmBody', { name: customer.name }),
      confirmLabel: willBan ? t('ban') : t('unban'),
      cancelLabel: t('cancel'),
      confirmVariant: willBan ? 'destructive' : 'default',
    });
    if (!ok) return;
    setPendingId(customer.id);
    const result = await banCustomerAction(customer.id, willBan);
    setPendingId(null);
    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      await confirm({
        iconVariant: 'danger',
        title: t('actionFailed'),
        description: result.message ?? t('actionFailed'),
        confirmLabel: t('cancel'),
        cancelLabel: '',
      });
    }
  }

  const columns = useMemo<ColumnDef<Customer, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('cols.customer'),
        meta: { label: t('cols.customer') },
        cell: ({ row }) => (
          <div>
            <span className="text-neutral-dashboard-text block font-medium">
              {row.original.name}
            </span>
            <span className="text-neutral-dashboard-muted block text-xs" dir="ltr">
              {row.original.phone}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'visitorType',
        header: t('cols.type'),
        meta: { label: t('cols.type') },
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-block w-fit rounded border px-2 py-0.5 text-[10px] font-medium ${
                row.original.visitorType === 'مميز'
                  ? 'border-violet-200 bg-violet-50 text-violet-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              {row.original.visitorType === 'مميز' ? t('visitor.vip') : t('visitor.regular')}
            </span>
            {row.original.isBanned ? (
              <span className="inline-block w-fit rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                {t('banned')}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'completedBookingCount',
        header: t('cols.bookings'),
        meta: { label: t('cols.bookings') },
        cell: ({ row }) => (
          <span className="text-neutral-dashboard-text">
            <span className="font-bold">{row.original.completedBookingCount}</span>
            <span className="text-neutral-dashboard-muted text-xs">
              {' '}
              ({row.original.totalRevenue.toLocaleString()})
            </span>
          </span>
        ),
      },
      {
        accessorKey: 'isProfileComplete',
        header: t('cols.profile'),
        meta: { label: t('cols.profile') },
        cell: ({ row }) =>
          row.original.isProfileComplete ? (
            <span className="text-xs text-emerald-600">{t('profileComplete')}</span>
          ) : (
            <span className="text-xs font-bold text-orange-600">{t('profileIncomplete')}</span>
          ),
      },
      {
        id: 'actions',
        header: tTable('actions'),
        meta: { label: tTable('actions'), excludeFromExport: true },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const c = row.original;
          const isPending = pendingId === c.id;
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/customers/${c.id}/edit`)}
                disabled={isPending}
                title={t('edit')}
                className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors disabled:opacity-50"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleBanToggle(c)}
                disabled={isPending}
                title={c.isBanned ? t('unban') : t('ban')}
                className={`rounded p-1.5 transition-colors disabled:opacity-50 ${
                  c.isBanned
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                {c.isBanned ? <Check className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c)}
                disabled={isPending}
                title={t('delete')}
                className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, tTable, router, pendingId],
  );

  const filterConfigs = useMemo(
    () => [
      {
        key: 'visitorType',
        label: t('cols.type'),
        options: [
          { value: 'مميز', label: t('visitor.vip') },
          { value: 'عادي', label: t('visitor.regular') },
        ],
      },
      {
        key: 'customerStatus',
        label: t('filters.new'),
        options: [
          { value: 'new', label: t('filters.new') },
          { value: 'old', label: t('filters.all') },
        ],
      },
      {
        key: 'isBanned',
        label: t('banned'),
        options: [
          { value: 'true', label: t('banned') },
          { value: 'false', label: t('filters.all') },
        ],
      },
      {
        key: 'isProfileComplete',
        label: t('cols.profile'),
        options: [
          { value: 'false', label: t('profileIncomplete') },
          { value: 'true', label: t('profileComplete') },
        ],
      },
    ],
    [t],
  );

  return (
    <EntityTable
      data={customers}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['name', 'phone', 'email']}
      filterConfigs={filterConfigs}
      exportFilename="customers"
    />
  );
}
