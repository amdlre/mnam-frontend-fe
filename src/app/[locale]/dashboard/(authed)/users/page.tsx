import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { UserPlus, Users as UsersIcon } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { fetchEmployeesStatus, fetchSystemUsers } from '@/lib/api/dashboard/users';
import { UserCard } from '@/components/dashboard/features/users/user-card';
import { UsersFilters, UsersViewToggle } from '@/components/dashboard/features/users/filters';
import { UsersTable } from '@/components/dashboard/features/users/users-table';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { StatCard } from '@/components/dashboard/shared/stat-card';

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
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const [t, users, statuses] = await Promise.all([
    getTranslations('dashboard.users'),
    fetchSystemUsers(),
    fetchEmployeesStatus(),
  ]);

  const viewMode = sp.view === 'table' ? 'table' : 'grid';
  const filtered = viewMode === 'grid' ? applyFilters(users, sp) : users;
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
          <Button href="/dashboard/users/new" locale={locale} leftIcon={<UserPlus className="h-4 w-4" />}>
            {t('addMember')}
          </Button>
        }
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t('stats.total')} value={totalMembers} />
        <StatCard label={t('stats.active')} value={activeMembers} valueTone="success" />
        <StatCard
          label={t('stats.onlineNow')}
          value={onlineNow}
          subtitle={t('stats.onlineNowSub')}
          icon={
            <div className="hidden rounded-md bg-slate-50 p-1.5 sm:block md:p-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            </div>
          }
        />
        <StatCard
          label={t('stats.todayHours')}
          value={`${totalTodayHours}${t('hoursUnit')}`}
          subtitle={t('stats.todayHoursSub')}
        />
      </section>

      <div className="bg-neutral-dashboard-card border-neutral-dashboard-border flex flex-wrap items-center justify-between gap-4 rounded-md border p-4 shadow-sm">
        {viewMode === 'grid' ? <UsersFilters /> : <div />}
        <UsersViewToggle />
      </div>

      {viewMode === 'grid' ? (
        filtered.length === 0 ? (
          <div className="text-neutral-dashboard-muted py-12 text-center">
            <UsersIcon className="mx-auto mb-2 h-12 w-12 text-slate-300" />
            <p>{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((user) => (
              <UserCard key={user.id} user={user} status={statusById.get(user.id)} />
            ))}
          </div>
        )
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  );
}
