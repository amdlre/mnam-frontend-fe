'use client';

import { useMemo, useState, useTransition } from 'react';
import { Ban, Check, Loader2, Pencil, Trash2, User } from 'lucide-react';
import { Card, CardContent, CustomCombobox, CustomInput } from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { banCustomerAction, deleteCustomerAction } from '@/actions/dashboard/customers';

import type { Customer } from '@/lib/api/dashboard/customers';

type CustomerFilter = 'all' | 'incomplete' | 'vip' | 'new' | 'banned';

interface Labels {
  search: string;
  filters: Record<CustomerFilter, string>;
  cols: {
    customer: string;
    type: string;
    bookings: string;
    profile: string;
    actions: string;
  };
  empty: string;
  visitorTypeLabels: Record<'مميز' | 'عادي', string>;
  profileComplete: string;
  profileIncomplete: string;
  banned: string;
  edit: string;
  delete: string;
  ban: string;
  unban: string;
  deleteConfirmTitle: string;
  deleteConfirmBody: (name: string) => string;
  deleteConfirmYes: string;
  banConfirmTitle: string;
  banConfirmBody: (name: string) => string;
  unbanConfirmTitle: string;
  unbanConfirmBody: (name: string) => string;
  cancel: string;
  actionFailed: string;
}

interface Props {
  customers: Customer[];
  labels: Labels;
}

export function CustomersTable({ customers, labels }: Props) {
  const router = useRouter();
  const confirm = useConfirm();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CustomerFilter>('all');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (q) {
        const haystack = `${c.name} ${c.phone} ${c.email ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      switch (filter) {
        case 'incomplete':
          return !c.isProfileComplete;
        case 'vip':
          return c.visitorType === 'مميز';
        case 'new':
          return c.customerStatus === 'new';
        case 'banned':
          return c.isBanned;
        default:
          return true;
      }
    });
  }, [customers, filter, search]);

  async function handleEdit(customer: Customer) {
    router.push(`/dashboard/customers/${customer.id}/edit`);
  }

  async function handleDelete(customer: Customer) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: labels.deleteConfirmTitle,
      description: labels.deleteConfirmBody(customer.name),
      confirmLabel: labels.deleteConfirmYes,
      cancelLabel: labels.cancel,
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
        title: labels.actionFailed,
        description: result.message ?? labels.actionFailed,
        confirmLabel: labels.cancel,
        cancelLabel: '',
      });
    }
  }

  async function handleBanToggle(customer: Customer) {
    const willBan = !customer.isBanned;
    const ok = await confirm({
      iconVariant: willBan ? 'warning' : 'info',
      title: willBan ? labels.banConfirmTitle : labels.unbanConfirmTitle,
      description: willBan
        ? labels.banConfirmBody(customer.name)
        : labels.unbanConfirmBody(customer.name),
      confirmLabel: willBan ? labels.ban : labels.unban,
      cancelLabel: labels.cancel,
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
        title: labels.actionFailed,
        description: result.message ?? labels.actionFailed,
        confirmLabel: labels.cancel,
        cancelLabel: '',
      });
    }
  }

  return (
    <>
      <Card className="border-neutral-dashboard-border">
        <CardContent className="grid grid-cols-1 gap-x-6 p-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <CustomInput
              type="search"
              placeholder={labels.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CustomCombobox
            options={(['all', 'incomplete', 'vip', 'new', 'banned'] as const).map((v) => ({
              value: v,
              label: labels.filters[v],
            }))}
            value={filter}
            onValueChange={(v) => setFilter((v || 'all') as CustomerFilter)}
            placeholder={labels.filters.all}
          />
        </CardContent>
      </Card>

      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-neutral-dashboard-border text-neutral-dashboard-muted border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">{labels.cols.customer}</th>
                  <th className="px-4 py-3 font-medium">{labels.cols.type}</th>
                  <th className="px-4 py-3 font-medium">{labels.cols.bookings}</th>
                  <th className="px-4 py-3 font-medium">{labels.cols.profile}</th>
                  <th className="px-4 py-3 font-medium">{labels.cols.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-dashboard-border divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <User className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                      <p className="text-neutral-dashboard-muted">{labels.empty}</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => {
                    const isPending = pendingId === c.id;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="text-neutral-dashboard-text block font-medium">
                            {c.name}
                          </span>
                          <span className="text-neutral-dashboard-muted block text-xs" dir="ltr">
                            {c.phone}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-block w-fit rounded border px-2 py-0.5 text-[10px] font-medium ${
                                c.visitorType === 'مميز'
                                  ? 'border-violet-200 bg-violet-50 text-violet-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-600'
                              }`}
                            >
                              {labels.visitorTypeLabels[c.visitorType]}
                            </span>
                            {c.isBanned ? (
                              <span className="inline-block w-fit rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                                {labels.banned}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="text-neutral-dashboard-text px-4 py-3">
                          <span className="font-bold">{c.completedBookingCount}</span>
                          <span className="text-neutral-dashboard-muted text-xs">
                            {' '}({c.totalRevenue.toLocaleString()})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.isProfileComplete ? (
                            <span className="text-xs text-emerald-600">{labels.profileComplete}</span>
                          ) : (
                            <span className="text-xs font-bold text-orange-600">
                              {labels.profileIncomplete}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(c)}
                              disabled={isPending}
                              title={labels.edit}
                              className="hover:bg-dashboard-primary-50 hover:text-dashboard-primary-600 rounded p-1.5 text-slate-500 transition-colors disabled:opacity-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBanToggle(c)}
                              disabled={isPending}
                              title={c.isBanned ? labels.unban : labels.ban}
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
                              title={labels.delete}
                              className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                            >
                              {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
