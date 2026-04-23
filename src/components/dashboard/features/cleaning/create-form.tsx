'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2, Sparkles } from 'lucide-react';

import { createCleaningRequestAction } from '@/actions/dashboard/cleaning';
import { CLEANING_REQUEST_TYPES } from '@/types/dashboard';

import type { CleaningRequestType, FetchedUnit } from '@/types/dashboard';

interface Props {
  units: FetchedUnit[];
  activeUnitIds: string[];
}

export function CleaningCreateForm({ units, activeUnitIds }: Props) {
  const t = useTranslations('dashboard.cleaning');
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedType, setSelectedType] = useState<CleaningRequestType>('تنظيف');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeSet = new Set(activeUnitIds);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedUnit) {
      setError(t('unitRequired'));
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createCleaningRequestAction(selectedUnit, selectedType);
      if (!result.success) {
        setError(result.message || t('createFailed'));
        return;
      }
      setSelectedUnit('');
      setSelectedType('تنظيف');
      router.refresh();
    });
  }

  return (
    <div className="bg-neutral-dashboard-card border-neutral-dashboard-border rounded-md border shadow-sm">
      <div className="border-neutral-dashboard-border flex items-center gap-2 border-b bg-slate-50/50 px-4 py-3">
        <Sparkles className="text-dashboard-primary-600 h-5 w-5" />
        <h3 className="text-neutral-dashboard-text text-sm font-semibold">{t('quickCreate')}</h3>
      </div>
      <form onSubmit={onSubmit} className="p-4">
        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
          <div>
            <label className="text-neutral-dashboard-muted mb-1 block text-xs font-medium">
              {t('unit')}
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-text focus:ring-dashboard-primary-500 focus:border-dashboard-primary-500 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1"
            >
              <option value="">{t('unitPlaceholder')}</option>
              {units.map((u) => {
                const hasActive = activeSet.has(u.id);
                return (
                  <option key={u.id} value={u.id} disabled={hasActive}>
                    {u.unitName} — {u.projectName}
                    {hasActive ? ` (${t('alreadyActive')})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="text-neutral-dashboard-muted mb-1 block text-xs font-medium">
              {t('type')}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as CleaningRequestType)}
              className="border-neutral-dashboard-border bg-neutral-dashboard-card text-neutral-dashboard-text focus:ring-dashboard-primary-500 focus:border-dashboard-primary-500 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1"
            >
              {CLEANING_REQUEST_TYPES.map((tt) => (
                <option key={tt} value={tt}>
                  {tt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending || !selectedUnit}
              className="bg-dashboard-primary-600 hover:bg-dashboard-primary-700 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('submit')}
            </button>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
