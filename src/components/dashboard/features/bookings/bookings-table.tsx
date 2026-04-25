'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Eye } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { EntityTable } from '@/components/dashboard/shared/entity-table';

import type { ColumnDef } from '@tanstack/react-table';
import type { Booking } from '@/types/dashboard';

const STATUS_TONE: Record<string, string> = {
  مؤكد: 'border-blue-200 bg-blue-50 text-blue-700',
  دخول: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  خروج: 'border-amber-200 bg-amber-50 text-amber-700',
  مكتمل: 'border-slate-200 bg-slate-50 text-slate-600',
  ملغي: 'border-red-200 bg-red-50 text-red-700',
};

interface Props {
  bookings: Booking[];
}

export function BookingsTable({ bookings }: Props) {
  const t = useTranslations('dashboard.bookings');
  const tTable = useTranslations('dashboard.dataTable');
  const router = useRouter();

  const columns = useMemo<ColumnDef<Booking, unknown>[]>(
    () => [
      {
        accessorKey: 'guestName',
        header: t('cols.guest'),
        meta: { label: t('cols.guest') },
        cell: ({ row }) => (
          <div>
            <span className="text-neutral-dashboard-text block font-medium">
              {row.original.guestName}
            </span>
            {row.original.guestPhone ? (
              <span className="text-neutral-dashboard-muted block text-xs" dir="ltr">
                {row.original.guestPhone}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'unitName',
        header: t('cols.unit'),
        meta: { label: t('cols.unit') },
      },
      {
        accessorKey: 'projectName',
        header: t('cols.project'),
        meta: { label: t('cols.project') },
      },
      {
        accessorKey: 'checkInDate',
        header: t('cols.checkIn'),
        meta: { label: t('cols.checkIn') },
        cell: ({ row }) => row.original.checkInDate,
      },
      {
        accessorKey: 'checkOutDate',
        header: t('cols.checkOut'),
        meta: { label: t('cols.checkOut') },
        cell: ({ row }) => row.original.checkOutDate,
      },
      {
        accessorKey: 'totalPrice',
        header: t('cols.price'),
        meta: { label: t('cols.price') },
        cell: ({ row }) => `${row.original.totalPrice.toLocaleString()} ر.س`,
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
          <button
            type="button"
            onClick={() => router.push(`/dashboard/bookings/${row.original.id}`)}
            title={tTable('view')}
            className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, tTable, router],
  );

  return (
    <EntityTable
      data={bookings}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['guestName', 'guestPhone', 'unitName', 'projectName', 'status']}
      exportFilename="bookings"
    />
  );
}
