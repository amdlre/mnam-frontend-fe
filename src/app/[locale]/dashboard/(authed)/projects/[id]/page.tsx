import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { FileSignature, Folder, MapPin } from 'lucide-react';

import { fetchProjectById } from '@/lib/api/dashboard/entities';
import { ProjectDeleteButton } from '@/components/dashboard/features/projects/delete-button';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const CONTRACT_STATUS_STYLES: Record<string, string> = {
  ساري: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  منتهي: 'bg-red-50 text-red-700 border-red-200',
  'موقف مؤقتاً': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default async function DashboardProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const [t, project] = await Promise.all([
    getTranslations('dashboard.projectDetail'),
    fetchProjectById(id),
  ]);
  if (!project) notFound();

  const statusClass = project.contractStatus
    ? (CONTRACT_STATUS_STYLES[project.contractStatus] ?? 'bg-slate-50 text-slate-600 border-slate-200')
    : 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={project.name}
        subtitle={project.ownerName}
        backHref="/dashboard/projects"
        actions={
          <>
            {project.contractStatus ? (
              <span className={`rounded border px-2 py-0.5 text-[10px] ${statusClass}`}>
                {project.contractStatus}
              </span>
            ) : null}
            <ProjectDeleteButton projectId={project.id} projectName={project.name} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <section className="md:col-span-5 space-y-6">
          <InfoCard title={t('overview')} icon={<Folder className="h-4 w-4 text-slate-500" />}>
            <InfoRow label={t('owner')}>{project.ownerName}</InfoRow>
            <InfoRow label={t('units')}>{project.unitCount}</InfoRow>
          </InfoCard>

          <InfoCard title={t('location')} icon={<MapPin className="h-4 w-4 text-slate-500" />}>
            <InfoRow label={t('city')}>{project.city || '-'}</InfoRow>
            <InfoRow label={t('district')}>{project.district || '-'}</InfoRow>
          </InfoCard>
        </section>

        <section className="md:col-span-7">
          <InfoCard title={t('contract')} icon={<FileSignature className="h-4 w-4 text-slate-500" />}>
            <InfoRow label={t('contractNo')}>{project.contractNo || '-'}</InfoRow>
            <InfoRow label={t('commission')}>
              {project.commissionPercent != null ? `${project.commissionPercent}%` : '-'}
            </InfoRow>
            <InfoRow label={t('status')}>{project.contractStatus || '-'}</InfoRow>
          </InfoCard>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-xl border p-6 shadow-sm">
      <h2 className="border-neutral-dashboard-border text-neutral-dashboard-text mb-3 flex items-center gap-2 border-b pb-3 text-base font-bold">
        {icon}
        {title}
      </h2>
      <dl className="divide-neutral-dashboard-border divide-y">{children}</dl>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-neutral-dashboard-muted text-sm">{label}</dt>
      <dd className="text-neutral-dashboard-text text-sm font-semibold">{children}</dd>
    </div>
  );
}
