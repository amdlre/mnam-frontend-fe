'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { LockKeyhole, UserCircle } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { Wizard, WizardStep, type WizardStepConfig } from '@/components/shared/wizard';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { createUserAction } from '@/actions/dashboard/users';
import {
  userCreateSchema,
  type UserCreateFormData,
} from '@/lib/validations/dashboard/users';

import type { AssignableRole } from '@/types/dashboard';

interface Props {
  roles: AssignableRole[];
}

export function UserCreateForm({ roles }: Props) {
  const t = useTranslations('dashboard.userForm');
  const tErrors = useTranslations('dashboard.userForm.errors');
  const router = useRouter();

  const defaultRole = roles[0]?.value ?? 'customers_agent';

  const form = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      role: defaultRole,
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardStepConfig<UserCreateFormData>[] = [
    {
      id: 'account',
      title: t('accountSection'),
      icon: <LockKeyhole className="h-4 w-4" />,
      fields: ['username', 'email', 'password', 'role'],
    },
    {
      id: 'personal',
      title: t('personalSection'),
      icon: <UserCircle className="h-4 w-4" />,
      fields: ['first_name', 'last_name', 'phone'],
    },
  ];

  async function handleComplete(values: UserCreateFormData) {
    const result = await createUserAction(values);
    if (!result.success) {
      return { success: false, message: result.message || t('createFailed') };
    }
    router.push('/dashboard/users');
    router.refresh();
    return { success: true };
  }

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={t('createTitle')}
        subtitle={t('createSubtitle')}
        backHref="/dashboard/users"
        backLabel={t('back')}
      />

      <Wizard form={form} steps={steps} onComplete={handleComplete} submitLabel={t('createSubmit')}>
        <WizardStep id="account">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border space-y-6 rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('accountSection')}
            </h2>
            <Field label={t('username')} required hint={t('usernameHint')} error={err(errors.username?.message)}>
              <input type="text" {...register('username')} className="input text-left" dir="ltr" placeholder="username" />
            </Field>
            <Field label={t('email')} required error={err(errors.email?.message)}>
              <input type="email" {...register('email')} className="input text-left" dir="ltr" placeholder="email@example.com" />
            </Field>
            <Field label={t('password')} required error={err(errors.password?.message)}>
              <input type="password" {...register('password')} className="input text-left" dir="ltr" placeholder="••••••••" />
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

        <WizardStep id="personal">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border space-y-6 rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('personalSection')}
            </h2>
            <Field label={t('firstName')} required error={err(errors.first_name?.message)}>
              <input type="text" {...register('first_name')} className="input" placeholder={t('firstNamePlaceholder')} />
            </Field>
            <Field label={t('lastName')} error={err(errors.last_name?.message)}>
              <input type="text" {...register('last_name')} className="input" placeholder={t('lastNamePlaceholder')} />
            </Field>
            <Field label={t('phone')} error={err(errors.phone?.message)}>
              <input type="tel" {...register('phone')} className="input" placeholder="05xxxxxxxx" dir="ltr" />
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
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-neutral-dashboard-text mb-1 block text-sm font-medium">
        {label}
        {required ? <span className="ms-1 text-red-500">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-neutral-dashboard-muted mt-1 text-xs">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
