import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ChevronRight, Mail, Pencil, Phone, ShieldCheck, User } from 'lucide-react';

import { fetchEmployeesStatus, fetchUserById } from '@/lib/api/dashboard/users';
import { USER_ROLE_BADGE_STYLES } from '@/components/dashboard/features/users/role-badge';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function formatDateTime(value: string | undefined, locale: string) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
  } catch {
    return value;
  }
}

export default async function DashboardUserDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const [t, tRoles, user, statuses] = await Promise.all([
    getTranslations('dashboard.userDetail'),
    getTranslations('dashboard.roles'),
    fetchUserById(id),
    fetchEmployeesStatus(),
  ]);
  if (!user) notFound();

  const status = statuses.find((s) => s.employeeId === id);
  const roleStyle =
    USER_ROLE_BADGE_STYLES[user.role] ?? 'border-slate-200 bg-slate-50 text-slate-600';
  const initial = user.firstName?.charAt(0) || 'U';

  return (
    <div className="space-y-6">
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
            <h1 className="text-neutral-dashboard-text text-xl font-bold">{t('title')}</h1>
            <p className="text-neutral-dashboard-muted text-xs">{t('subtitle')}</p>
          </div>
        </div>
        {!user.isSystemOwner ? (
          <Link
            href={`/${locale}/dashboard/users/${user.id}/edit`}
            className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
          >
            <Pencil className="h-4 w-4" />
            <span>{t('edit')}</span>
          </Link>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <section className="md:col-span-5">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 text-center shadow-sm">
            <div className="bg-dashboard-primary-50 text-dashboard-primary-700 mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold">
              {initial}
            </div>
            <h2 className="text-neutral-dashboard-text mt-4 text-lg font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-neutral-dashboard-muted font-mono text-xs">@{user.username}</p>
            <div className="mt-3 flex justify-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] ${roleStyle}`}>
                {tRoles(user.role)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {user.isActive ? t('active') : t('inactive')}
              </span>
            </div>

            {!user.isSystemOwner && status ? (
              <div className="border-neutral-dashboard-border mt-6 grid grid-cols-2 gap-3 border-t pt-6 text-start text-xs">
                <div>
                  <p className="text-neutral-dashboard-muted">{t('onlineStatus')}</p>
                  <p className="text-neutral-dashboard-text mt-1 font-semibold">
                    {status.isOnline ? t('online') : t('offline')}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-dashboard-muted">{t('todayWorked')}</p>
                  <p className="text-neutral-dashboard-text mt-1 font-semibold">
                    {status.formattedDuration}
                  </p>
                </div>
                {status.lastActivity ? (
                  <div className="col-span-2">
                    <p className="text-neutral-dashboard-muted">{t('lastActivity')}</p>
                    <p className="text-neutral-dashboard-text mt-1 font-semibold">
                      {formatDateTime(status.lastActivity, locale)}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <section className="md:col-span-7">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('contactInfo')}
            </h2>
            <dl className="divide-neutral-dashboard-border mt-3 divide-y">
              <InfoRow icon={<User className="h-4 w-4 text-slate-500" />} label={t('fullName')}>
                {user.firstName} {user.lastName}
              </InfoRow>
              <InfoRow icon={<Mail className="h-4 w-4 text-slate-500" />} label={t('email')}>
                {user.email || '-'}
              </InfoRow>
              <InfoRow icon={<Phone className="h-4 w-4 text-slate-500" />} label={t('phone')}>
                {user.phone || '-'}
              </InfoRow>
              <InfoRow
                icon={<ShieldCheck className="h-4 w-4 text-slate-500" />}
                label={t('lastLogin')}
              >
                {formatDateTime(user.lastLogin, locale)}
              </InfoRow>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="flex items-center gap-2 text-sm">
        {icon}
        <span className="text-neutral-dashboard-muted">{label}</span>
      </dt>
      <dd className="text-neutral-dashboard-text text-sm font-semibold">{children}</dd>
    </div>
  );
}
