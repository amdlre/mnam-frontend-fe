'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ChevronRight, Loader2, Save } from 'lucide-react';

import { toggleUserActiveAction, updateUserAction } from '@/actions/dashboard/users';
import {
  userEditSchema,
  type UserEditFormData,
} from '@/lib/validations/dashboard/users';

import type { AssignableRole, SystemUser } from '@/types/dashboard';

interface Props {
  user: SystemUser;
  roles: AssignableRole[];
  locale: string;
}

export function UserEditForm({ user, roles, locale }: Props) {
  const t = useTranslations('dashboard.userForm');
  const tErrors = useTranslations('dashboard.userForm.errors');
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isToggling, startToggleTransition] = useTransition();
  const [isActive, setIsActive] = useState(user.isActive);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.isActive,
    },
  });

  function onSubmit(data: UserEditFormData) {
    setSubmitError(null);
    startTransition(async () => {
      const result = await updateUserAction(user.id, { ...data, is_active: isActive });
      if (!result.success) {
        setSubmitError(result.message || t('updateFailed'));
        return;
      }
      router.push(`/${locale}/dashboard/users`);
      router.refresh();
    });
  }

  function onToggleActive() {
    const msg = isActive ? t('confirmDeactivate') : t('confirmActivate');
    if (typeof window !== 'undefined' && !window.confirm(msg)) return;
    startToggleTransition(async () => {
      const result = await toggleUserActiveAction(user.id);
      if (result.success) {
        setIsActive((prev) => !prev);
      } else {
        window.alert(result.message || t('updateFailed'));
      }
    });
  }

  const errorText = (key?: string) => (key ? tErrors(key) : '');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard/users`}
            className="text-neutral-dashboard-muted hover:text-neutral-dashboard-text rounded-full border border-transparent p-2 transition-colors hover:border-neutral-200 hover:bg-slate-50"
            aria-label={t('back')}
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-neutral-dashboard-text text-xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {isActive ? t('active') : t('inactive')}
              </span>
            </div>
            <p className="text-neutral-dashboard-muted font-mono text-xs">@{user.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleActive}
            disabled={isToggling}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
              isActive
                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {isToggling ? <Loader2 className="inline h-4 w-4 animate-spin" /> : null}
            {isActive ? t('deactivate') : t('activate')}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{t('saveChanges')}</span>
          </button>
        </div>
      </header>

      {submitError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <section className="md:col-span-6">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border space-y-6 rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('personalSection')}
            </h2>
            <Field label={t('firstName')} required error={errorText(errors.first_name?.message)}>
              <input type="text" {...register('first_name')} className="input" />
            </Field>
            <Field label={t('lastName')} error={errorText(errors.last_name?.message)}>
              <input type="text" {...register('last_name')} className="input" />
            </Field>
            <Field label={t('phone')} error={errorText(errors.phone?.message)}>
              <input type="tel" {...register('phone')} className="input" dir="ltr" />
            </Field>
          </div>
        </section>

        <section className="md:col-span-6">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border space-y-6 rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('accessSection')}
            </h2>
            <Field label={t('email')} required error={errorText(errors.email?.message)}>
              <input type="email" {...register('email')} className="input text-left" dir="ltr" />
            </Field>
            <Field label={t('role')} required error={errorText(errors.role?.message)}>
              <select {...register('role')} className="input">
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--color-neutral-dashboard-border);
          background: var(--color-neutral-dashboard-card);
          color: var(--color-neutral-dashboard-text);
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .input:focus {
          border-color: var(--color-dashboard-primary-500);
          box-shadow: 0 0 0 2px var(--color-dashboard-primary-100);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-neutral-dashboard-text mb-1 block text-sm font-medium">
        {label}
        {required ? <span className="ms-1 text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
