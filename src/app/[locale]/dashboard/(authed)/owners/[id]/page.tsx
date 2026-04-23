import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Briefcase, Mail, Phone } from 'lucide-react';

import { fetchOwnerById, fetchOwnerProjects } from '@/lib/api/dashboard/entities';
import { OwnerDeleteButton } from '@/components/dashboard/features/owners/delete-button';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardOwnerDetailPage({ params }: Props) {
  const { id } = await params;
  const [t, owner, ownerProjects] = await Promise.all([
    getTranslations('dashboard.ownerDetail'),
    fetchOwnerById(id),
    fetchOwnerProjects(id),
  ]);
  if (!owner) notFound();

  const initial = owner.ownerName?.charAt(0) || 'م';

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={t('title')}
        subtitle={t('subtitle')}
        backHref="/dashboard/owners"
        actions={<OwnerDeleteButton ownerId={owner.id} ownerName={owner.ownerName} />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <section className="md:col-span-5">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 text-center shadow-sm">
            <div className="bg-dashboard-primary-50 text-dashboard-primary-700 mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold">
              {initial}
            </div>
            <h2 className="text-neutral-dashboard-text mt-4 text-lg font-bold">
              {owner.ownerName}
            </h2>
            <div className="border-neutral-dashboard-border mt-6 grid grid-cols-2 gap-3 border-t pt-6 text-start">
              <div>
                <p className="text-neutral-dashboard-muted text-xs">{t('projectsCount')}</p>
                <p className="text-neutral-dashboard-text mt-1 text-lg font-bold">
                  {owner.projectCount}
                </p>
              </div>
              <div>
                <p className="text-neutral-dashboard-muted text-xs">{t('unitsCount')}</p>
                <p className="text-neutral-dashboard-text mt-1 text-lg font-bold">
                  {owner.unitCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 md:col-span-7">
          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text border-b pb-3 text-base font-bold">
              {t('contact')}
            </h2>
            <dl className="divide-neutral-dashboard-border mt-3 divide-y">
              <InfoRow icon={<Phone className="h-4 w-4 text-slate-500" />} label={t('phone')}>
                {owner.ownerMobilePhone || '-'}
              </InfoRow>
              <InfoRow icon={<Mail className="h-4 w-4 text-slate-500" />} label={t('paypal')}>
                {owner.paypalEmail || '-'}
              </InfoRow>
              {owner.note ? (
                <div className="py-3">
                  <p className="text-neutral-dashboard-muted text-sm">{t('notes')}</p>
                  <p className="text-neutral-dashboard-text mt-1 text-sm">{owner.note}</p>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 shadow-sm">
            <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text flex items-center gap-2 border-b pb-3 text-base font-bold">
              <Briefcase className="h-4 w-4 text-slate-500" />
              {t('projectsList')}
            </h2>
            {ownerProjects.length === 0 ? (
              <p className="text-neutral-dashboard-muted mt-3 text-sm">{t('noProjects')}</p>
            ) : (
              <ul className="divide-neutral-dashboard-border mt-3 divide-y">
                {ownerProjects.map((p, idx) => (
                  <li key={idx} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-neutral-dashboard-text text-sm font-semibold">
                        {p.projectName}
                      </p>
                      <p className="text-neutral-dashboard-muted text-xs">
                        {[p.city, p.district].filter(Boolean).join(' • ') || '-'}
                      </p>
                    </div>
                    <p className="text-neutral-dashboard-text text-sm font-semibold">
                      {p.unitCount}
                    </p>
                  </li>
                ))}
              </ul>
            )}
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
