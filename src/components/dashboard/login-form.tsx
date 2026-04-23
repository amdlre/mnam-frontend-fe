'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { dashboardLoginAction } from '@/actions/dashboard/auth';
import {
  dashboardLoginSchema,
  type DashboardLoginFormData,
} from '@/lib/validations/dashboard/auth';

export function DashboardLoginForm() {
  const t = useTranslations('dashboard.login');
  const tErrors = useTranslations('dashboard.errors');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DashboardLoginFormData>({
    resolver: zodResolver(dashboardLoginSchema),
    defaultValues: { username: '', password: '' },
  });

  function onSubmit(data: DashboardLoginFormData) {
    setSubmitError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set('username', data.username);
      formData.set('password', data.password);
      console.log(formData)
      const result = await dashboardLoginAction(formData);
      if (!result.success) {
        setSubmitError(tErrors(result.messageKey || 'loginFailed'));
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    });
  }

  const fieldErrorKey = (key?: string) => (key ? tErrors(key) : '');

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label htmlFor="username" className="text-neutral-dashboard-text block text-sm font-medium">
          {t('usernameLabel')}
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          {...register('username')}
          className="border-neutral-dashboard-border text-neutral-dashboard-text focus:ring-dashboard-primary-400 focus:border-dashboard-primary-600 w-full rounded-md border bg-white px-3 py-2.5 transition-all focus:ring-2 focus:outline-none"
        />
        {errors.username ? (
          <p className="text-sm text-red-600">{fieldErrorKey(errors.username.message)}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-neutral-dashboard-text block text-sm font-medium">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
            className="border-neutral-dashboard-border text-neutral-dashboard-text focus:ring-dashboard-primary-400 focus:border-dashboard-primary-600 w-full rounded-md border bg-white px-3 py-2.5 pe-10 transition-all focus:ring-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-neutral-dashboard-muted hover:text-neutral-dashboard-text absolute inset-y-0 end-0 flex items-center pe-3"
            aria-label={showPassword ? t('hidePassword') : t('showPassword')}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-sm text-red-600">{fieldErrorKey(errors.password.message)}</p>
        ) : null}
      </div>

      {submitError ? (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 w-full rounded-md py-2.5 font-bold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {t('submitting')}
          </span>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}
