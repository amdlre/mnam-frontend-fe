'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Trash2 } from 'lucide-react';

import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteMappingAction } from '@/actions/dashboard/integrations';
import { useRouter } from '@/i18n/navigation';

import type { ChannexConnection, ExternalMapping } from '@/lib/api/dashboard/integrations';
import type { FetchedUnit } from '@/types/dashboard';

interface Props {
  mappings: ExternalMapping[];
  units: FetchedUnit[];
  connections: ChannexConnection[];
  onAddMapping: () => void;
  hasConnections: boolean;
}

export function MappingsTable({
  mappings,
  units,
  connections,
  onAddMapping,
  hasConnections,
}: Props) {
  const t = useTranslations('dashboard.integrations');
  const confirm = useConfirm();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const unitName = (unitId?: string) => {
    if (!unitId) return '-';
    const unit = units.find((u) => u.id === unitId);
    return unit?.unitName ?? unitId.substring(0, 8);
  };

  const propertyName = (connectionId: string) => {
    const conn = connections.find((c) => c.id === connectionId);
    return conn?.channexPropertyId ?? 'Unknown';
  };

  async function handleDelete(mapping: ExternalMapping) {
    const ok = await confirm({
      iconVariant: 'danger',
      title: t('deleteMapping'),
      description: t('deleteMappingConfirm'),
      confirmLabel: t('yesDelete'),
      cancelLabel: t('cancel'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    const result = await deleteMappingAction(mapping.id);
    if (!result.success) {
      await confirm({
        iconVariant: 'danger',
        title: t('actionFailed'),
        description: result.message ?? t('actionFailed'),
        confirmLabel: t('cancel'),
        cancelLabel: '',
      });
      return;
    }
    startTransition(() => router.refresh());
  }

  if (mappings.length === 0) {
    return (
      <div className="border-neutral-dashboard-border bg-neutral-dashboard-card overflow-hidden rounded-md border shadow-sm">
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
            <Building2 className="text-neutral-dashboard-muted h-6 w-6" />
          </div>
          <h3 className="text-neutral-dashboard-text mb-1 font-medium">{t('mappingsEmpty')}</h3>
          <p className="text-neutral-dashboard-muted mb-4 text-sm">{t('mappingsEmptyHint')}</p>
          <button
            type="button"
            onClick={onAddMapping}
            disabled={!hasConnections}
            className="text-dashboard-primary-600 hover:text-dashboard-primary-700 text-sm font-medium disabled:opacity-50"
          >
            {t('linkUnitNow')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-neutral-dashboard-border bg-neutral-dashboard-card overflow-hidden rounded-md border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="border-neutral-dashboard-border border-b bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">{t('mappingCols.unit')}</th>
              <th className="px-4 py-3 font-medium">{t('mappingCols.property')}</th>
              <th className="px-4 py-3 font-medium">{t('mappingCols.roomType')}</th>
              <th className="px-4 py-3 font-medium">{t('mappingCols.ratePlan')}</th>
              <th className="px-4 py-3 font-medium">{t('mappingCols.status')}</th>
              <th className="px-4 py-3 font-medium">{t('mappingCols.lastSync')}</th>
              <th className="px-4 py-3 font-medium">{t('mappingCols.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-neutral-dashboard-border divide-y">
            {mappings.map((m) => {
              const property = propertyName(m.connectionId);
              return (
                <tr key={m.id} className="text-sm transition-colors hover:bg-slate-50">
                  <td className="text-neutral-dashboard-text px-4 py-3 font-medium">
                    {unitName(m.unitId)}
                  </td>
                  <td className="text-neutral-dashboard-muted px-4 py-3 font-mono text-xs">
                    {property.substring(0, 15)}...
                  </td>
                  <td className="text-neutral-dashboard-muted px-4 py-3 font-mono text-xs">
                    {m.channexRoomTypeId}
                  </td>
                  <td className="text-neutral-dashboard-muted px-4 py-3 font-mono text-xs">
                    {m.channexRatePlanId}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] ${
                        m.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {m.isActive ? t('mappingActive') : t('mappingInactive')}
                    </span>
                  </td>
                  <td className="text-neutral-dashboard-muted px-4 py-3 text-xs">
                    <div>
                      {t('syncPrice')}{' '}
                      {m.lastPriceSyncAt
                        ? new Date(m.lastPriceSyncAt).toLocaleDateString('ar-SA')
                        : '-'}
                    </div>
                    <div>
                      {t('syncAvail')}{' '}
                      {m.lastAvailSyncAt
                        ? new Date(m.lastAvailSyncAt).toLocaleDateString('ar-SA')
                        : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleDelete(m)}
                      title={t('deleteMapping')}
                      className="rounded p-1 text-slate-400 transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
