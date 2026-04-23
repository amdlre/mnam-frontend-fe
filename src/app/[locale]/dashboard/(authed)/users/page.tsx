import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { UserPlus, Users as UsersIcon } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { fetchEmployeesStatus, fetchSystemUsers } from '@/lib/api/dashboard/users';
import { UserCard } from '@/components/dashboard/features/users/user-card';
import { UsersFilters } from '@/components/dashboard/features/users/filters';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

import type { SystemUser } from '@/types/dashboard';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; role?: string; status?: string; view?: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function applyFilters(
  users: SystemUser[],
  { q, role, status }: { q?: string; role?: string; status?: string },
): SystemUser[] {
  const query = (q || '').toLowerCase().trim();
  return users.filter((u) => {
    if (role && role !== 'all' && u.role !== role) return false;
    if (status === 'active' && !u.isActive) return false;
    if (status === 'inactive' && u.isActive) return false;
    if (query) {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      if (!fullName.includes(query) && !u.username.toLowerCase().includes(query)) return false;
    }
    return true;
  });
}

export default async function DashboardUsersPage({ params, searchParams }: Props) {
  const [, sp] = await Promise.all([params, searchParams]);
  const [t, tRoles, users, statuses] = await Promise.all([
    getTranslations('dashboard.users'),
    getTranslations('dashboard.roles'),
    fetchSystemUsers(),
    fetchEmployeesStatus(),
  ]);

  const filtered = applyFilters(users, sp);
  const viewMode = sp.view === 'table' ? 'table' : 'grid';

  const statusById = new Map(statuses.map((s) => [s.employeeId, s]));

  const totalMembers = users.length;
  const activeMembers = users.filter((u) => u.isActive).length;
  const onlineNow = statuses.filter((s) => s.isOnline).length;
  const totalTodayMinutes = statuses.reduce((sum, s) => sum + s.todayDuration, 0);
  const totalTodayHours = Math.round((totalTodayMinutes / 60) * 10) / 10;

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Link
            href="/dashboard/users/new"
            className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>{t('addMember')}</span>
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t('stats.total')} value={totalMembers} />
        <StatCard label={t('stats.active')} value={activeMembers} />
        <StatCard
          label={t('stats.onlineNow')}
          value={onlineNow}
          subtitle={t('stats.onlineNowSub')}
          pulse
        />
        <StatCard
          label={t('stats.todayHours')}
          value={`${totalTodayHours}${t('hoursUnit')}`}
          subtitle={t('stats.todayHoursSub')}
        />
      </section>

      <UsersFilters />

      {filtered.length === 0 ? (
        <div className="text-neutral-dashboard-muted py-12 text-center">
          <UsersIcon className="mx-auto mb-2 h-12 w-12 text-slate-300" />
          <p>{t('empty')}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} status={statusById.get(user.id)} />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-dashboard-card border-neutral-dashboard-border overflow-hidden rounded-md border shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="text-neutral-dashboard-muted border-neutral-dashboard-border border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('cols.user')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.username')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.role')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.status')}</th>
                  <th className="px-4 py-3 font-medium">{t('cols.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-dashboard-border divide-y">
                {filtered.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="text-neutral-dashboard-text px-4 py-3 font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="text-neutral-dashboard-text px-4 py-3 font-mono text-xs">
                      @{user.username}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600">
                        {tRoles(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            user.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            user.isActive ? 'text-emerald-700' : 'text-slate-500'
                          }`}
                        >
                          {user.isActive ? t('active') : t('inactive')}
                        </span>
                      </div>
                    </td>
                    <td className="flex gap-2 px-4 py-3">
                      {!user.isSystemOwner ? (
                        <>
                          <Link
                            href={`/dashboard/users/${user.id}`}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            {t('file')}
                          </Link>
                          <Link
                            href={`/dashboard/users/${user.id}/edit`}
                            className="text-dashboard-primary-600 text-xs hover:underline"
                          >
                            {t('edit')}
                          </Link>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  pulse,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
  pulse?: boolean;
}) {
  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border flex min-h-[80px] items-start justify-between rounded-md border p-3 shadow-sm md:p-4">
      <div>
        <p className="text-neutral-dashboard-muted text-xs font-medium md:text-sm">{label}</p>
        <p className="text-neutral-dashboard-text mt-1 text-lg font-bold md:text-2xl">{value}</p>
        {subtitle ? (
          <p className="text-neutral-dashboard-muted mt-1 text-[10px] md:text-xs">{subtitle}</p>
        ) : null}
      </div>
      {pulse ? (
        <div className="hidden rounded-md bg-slate-50 p-1.5 sm:block md:p-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
        </div>
      ) : null}
    </div>
  );
}
