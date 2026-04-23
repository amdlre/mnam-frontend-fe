'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Pencil, Phone, Trash2 } from 'lucide-react';

import { deleteUserAction } from '@/actions/dashboard/users';
import { USER_ROLE_BADGE_STYLES } from './role-badge';

import type { EmployeeOnlineStatus, SystemUser } from '@/types/dashboard';

interface Props {
  user: SystemUser;
  status?: EmployeeOnlineStatus;
  locale: string;
}

export function UserCard({ user, status, locale }: Props) {
  const t = useTranslations('dashboard.users');
  const tRoles = useTranslations('dashboard.roles');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initial = user.firstName?.charAt(0) || 'U';
  const isOnline = status?.isOnline ?? false;
  const duration = status?.formattedDuration ?? '0م';

  function onDelete() {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const confirmMessage = t('deleteConfirm', { name: fullName });
    if (typeof window !== 'undefined' && !window.confirm(confirmMessage)) return;
    startTransition(async () => {
      const result = await deleteUserAction(user.id);
      if (!result.success) {
        window.alert(result.message || t('deleteFailed'));
        return;
      }
      router.refresh();
    });
  }

  return (
    <div
      className={`bg-neutral-dashboard-card rounded-md border shadow-sm transition-all hover:shadow-md ${
        user.isSystemOwner
          ? 'border-amber-200 ring-1 ring-amber-50'
          : 'border-neutral-dashboard-border'
      }`}
    >
      <div className="border-neutral-dashboard-border flex items-start justify-between border-b p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <div className="border-neutral-dashboard-border flex h-8 w-8 items-center justify-center rounded border bg-slate-100 text-sm font-bold text-neutral-600 md:h-10 md:w-10 md:text-base">
              {initial}
            </div>
            {!user.isSystemOwner ? (
              <span className="absolute -bottom-1 -end-1 flex h-2.5 w-2.5 md:h-3 md:w-3">
                {isOnline ? (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                ) : null}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white md:h-3 md:w-3 ${
                    isOnline ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              </span>
            ) : null}
          </div>
          <div>
            <h3 className="text-neutral-dashboard-text text-xs font-bold md:text-sm">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-neutral-dashboard-muted text-[10px] md:text-xs">@{user.username}</p>
          </div>
        </div>
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] ${
            USER_ROLE_BADGE_STYLES[user.role] ?? 'border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          {tRoles(user.role)}
        </span>
      </div>

      <div className="space-y-2 p-3 md:space-y-3 md:p-4">
        {!user.isSystemOwner && status ? (
          <div className="border-neutral-dashboard-border flex items-center justify-between rounded border bg-slate-50 p-1.5 text-[10px] md:p-2 md:text-xs">
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="text-neutral-400">⏱️</span>
              <span className="text-neutral-600">
                {t('todayDuration')}: {duration}
              </span>
            </div>
            {status.lastActivity ? (
              <div className="text-neutral-400">
                {new Date(status.lastActivity).toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-600 md:gap-2 md:text-xs">
            <Mail className="h-3 w-3 text-neutral-400 md:h-3.5 md:w-3.5" />
            <span className="truncate">{user.email || '-'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-600 md:gap-2 md:text-xs">
            <Phone className="h-3 w-3 text-neutral-400 md:h-3.5 md:w-3.5" />
            <span>{user.phone || '-'}</span>
          </div>
        </div>

        <div className="border-neutral-dashboard-border mt-2 flex gap-1.5 border-t pt-2 md:gap-2">
          {user.isSystemOwner ? (
            <span className="w-full rounded border border-amber-100 bg-amber-50 py-1 text-center text-[10px] font-medium text-amber-600 md:py-1.5 md:text-xs">
              {t('protectedAccount')}
            </span>
          ) : (
            <>
              <Link
                href={`/${locale}/dashboard/users/${user.id}`}
                className="border-neutral-dashboard-border hover:text-dashboard-primary-600 flex-1 rounded border bg-white px-1.5 py-1 text-center text-[10px] text-neutral-600 transition-colors hover:bg-slate-50 md:text-xs"
              >
                {t('file')}
              </Link>
              <Link
                href={`/${locale}/dashboard/users/${user.id}/edit`}
                className="border-neutral-dashboard-border hover:text-dashboard-primary-600 rounded border bg-white px-1.5 py-1 text-neutral-600 transition-colors hover:bg-slate-50"
                aria-label={t('edit')}
              >
                <Pencil className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </Link>
              <button
                type="button"
                onClick={onDelete}
                disabled={isPending}
                className="border-neutral-dashboard-border rounded border bg-white px-1.5 py-1 text-neutral-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label={t('delete')}
              >
                <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
