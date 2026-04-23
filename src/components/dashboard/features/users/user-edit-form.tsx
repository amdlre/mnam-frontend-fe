'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Loader2, ShieldCheck, UserCircle } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { Wizard, WizardStep, type WizardStepConfig } from '@/components/shared/wizard';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { toggleUserActiveAction, updateUserAction } from '@/actions/dashboard/users';
import {
  userEditSchema,
  type UserEditFormData,
} from '@/lib/validations/dashboard/users';

import type { AssignableRole, SystemUser } from '@/types/dashboard';

interface Props {
  user: SystemUser;
  roles: AssignableRole[];
}

export function UserEditForm({ user, roles }: Props) {
  const t = useTranslations('dashboard.userForm');
  const tErrors = useTranslations('dashboard.userForm.errors');
  const router = useRouter();
  const confirm = useConfirm();
  const [isToggling, startToggleTransition] = useTransition();
  const [isActive, setIsActive] = useState(user.isActive);

  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.isActive,
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardStepConfig<UserEditFormData>[] = [
    {
      id: 'personal',
      title: t('personalSection'),
      icon: <UserCircle className="h-4 w-4" />,
      fields: ['first_name', 'last_name', 'phone'],
    },
    {
      id: 'access',
      title: t('accessSection'),
      icon: <ShieldCheck className="h-4 w-4" />,
      fields: ['email', 'role'],
    },
  ];

  async function handleComplete(values: UserEditFormData) {
    const result = await updateUserAction(user.id, { ...values, is_active: isActive });
    if (!result.success) {
      return { success: false, message: result.message || t('updateFailed') };
    }
    router.push('/dashboard/users');
    router.refresh();
    return { success: true };
  }

  async function onToggleActive() {
    const ok = await confirm({
      iconVariant: isActive ? 'warning' : 'info',
      title: isActive ? t('deactivate') : t('activate'),
      description: isActive ? t('confirmDeactivate') : t('confirmActivate'),
      confirmLabel: isActive ? t('deactivate') : t('activate'),
      cancelLabel: t('cancel'),
      confirmVariant: isActive ? 'destructive' : 'default',
    });
    if (!ok) return;
    startToggleTransition(async () => {
      const result = await toggleUserActiveAction(user.id);
      if (result.success) {
        setIsActive((prev) => !prev);
      } else {
        await confirm({
          iconVariant: 'danger',
          title: t('updateFailed'),
          description: result.message || t('updateFailed'),
          confirmLabel: t('cancel'),
          cancelLabel: '',
        });
      }
    });
  }

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={`${user.firstName} ${user.lastName}`}
        subtitle={`@${user.username}`}
        backHref="/dashboard/users"
        backLabel={t('back')}
        actions={
          <>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isActive ? t('active') : t('inactive')}
            </span>
            <button
              type="button"
              onClick={onToggleActive}
              disabled={isToggling}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                isActive
                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isToggling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>{isActive ? t('deactivate') : t('activate')}</span>
            </button>
          </>
        }
      />

      <Wizard form={form} steps={steps} onComplete={handleComplete} submitLabel={t('saveChanges')}>
        <WizardStep id="personal">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border space-y-6 rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('personalSection')}
            </h2>
            <Field label={t('firstName')} required error={err(errors.first_name?.message)}>
              <input type="text" {...register('first_name')} className="input" />
            </Field>
            <Field label={t('lastName')} error={err(errors.last_name?.message)}>
              <input type="text" {...register('last_name')} className="input" />
            </Field>
            <Field label={t('phone')} error={err(errors.phone?.message)}>
              <input type="tel" {...register('phone')} className="input" dir="ltr" />
            </Field>
          </div>
        </WizardStep>

        <WizardStep id="access">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border space-y-6 rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('accessSection')}
            </h2>
            <Field label={t('email')} required error={err(errors.email?.message)}>
              <input type="email" {...register('email')} className="input text-left" dir="ltr" />
            </Field>
            <Field label={t('role')} required error={err(errors.role?.message)}>
              <select {...register('role')} className="input">
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </WizardStep>
      </Wizard>

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
    </div>
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
