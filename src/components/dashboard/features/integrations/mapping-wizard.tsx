'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Wizard,
  WizardNavigation,
  WizardStep,
} from '@amdlre/design-system';

import {
  createMappingAction,
  fetchChannexRatePlansAction,
  fetchChannexRoomTypesAction,
} from '@/actions/dashboard/integrations';

import type {
  ChannexConnection,
  ChannexRatePlan,
  ChannexRoomType,
} from '@/lib/api/dashboard/integrations';
import type { FetchedUnit } from '@/types/dashboard';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connections: ChannexConnection[];
  units: FetchedUnit[];
  preSelectedUnitId?: string;
  onSuccess: () => void;
}

export function MappingWizard({
  open,
  onOpenChange,
  connections,
  units,
  preSelectedUnitId,
  onSuccess,
}: Props) {
  const t = useTranslations('dashboard.integrations.mappingWizard');
  const tCommon = useTranslations('dashboard.integrations');
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [roomTypes, setRoomTypes] = useState<ChannexRoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [ratePlans, setRatePlans] = useState<ChannexRatePlan[]>([]);
  const [selectedRatePlan, setSelectedRatePlan] = useState('');

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setSelectedConnection(connections.length === 1 ? connections[0].id : '');
      setSelectedUnit(preSelectedUnitId ?? '');
      setRoomTypes([]);
      setSelectedRoomType('');
      setRatePlans([]);
      setSelectedRatePlan('');
      setError(null);
    }
  }, [open, preSelectedUnitId, connections]);

  async function handleBeforeNext() {
    setError(null);
    if (currentStep === 0 && !selectedConnection) return false;
    if (currentStep === 1 && !selectedUnit) return false;
    if (currentStep === 1) {
      // Load room types when leaving the unit step
      const result = await fetchChannexRoomTypesAction(selectedConnection);
      if (!result.success) {
        setError(result.message ?? t('noRoomTypes'));
        return false;
      }
      setRoomTypes(result.data ?? []);
    }
    if (currentStep === 2 && !selectedRoomType) return false;
    if (currentStep === 2) {
      const result = await fetchChannexRatePlansAction(selectedConnection, selectedRoomType);
      if (!result.success) {
        setError(result.message ?? t('noRatePlans'));
        return false;
      }
      setRatePlans(result.data ?? []);
    }
    if (currentStep === 3 && !selectedRatePlan) return false;
    return true;
  }

  async function handleSubmit() {
    setError(null);
    const result = await createMappingAction({
      connectionId: selectedConnection,
      unitId: selectedUnit,
      channexRoomTypeId: selectedRoomType,
      channexRatePlanId: selectedRatePlan,
    });
    if (!result.success) {
      setError(result.message ?? t('mappingFailed'));
      return;
    }
    onSuccess();
    onOpenChange(false);
  }

  const isNextDisabled =
    (currentStep === 0 && !selectedConnection) ||
    (currentStep === 1 && !selectedUnit) ||
    (currentStep === 2 && !selectedRoomType) ||
    (currentStep === 3 && !selectedRatePlan);

  const selectedUnitData = units.find((u) => u.id === selectedUnit);
  const selectedRoomTypeData = roomTypes.find((rt) => rt.id === selectedRoomType);
  const selectedRatePlanData = ratePlans.find((rp) => rp.id === selectedRatePlan);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>

        <Wizard defaultStep={0} totalSteps={5} onStepChange={setCurrentStep}>
          <div className="mb-4 flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i === currentStep
                    ? 'bg-dashboard-primary-600'
                    : i < currentStep
                      ? 'bg-dashboard-primary-200'
                      : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          <WizardStep>
            <h3 className="mb-3 text-sm font-semibold">{t('stepConnection')}</h3>
            {connections.length === 0 ? (
              <p className="text-neutral-dashboard-muted py-8 text-center text-sm">
                {t('noConnections')}
              </p>
            ) : (
              <div className="space-y-2">
                {connections.map((conn) => (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => setSelectedConnection(conn.id)}
                    className={`w-full rounded border p-3 text-right text-sm transition-all ${
                      selectedConnection === conn.id
                        ? 'border-dashboard-primary-500 bg-dashboard-primary-50 text-dashboard-primary-700'
                        : 'border-neutral-dashboard-border hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium">{conn.channexPropertyId || 'Property'}</div>
                    <div className="text-neutral-dashboard-muted mt-0.5 text-xs">
                      {conn.provider} • {tCommon(`connectionStatus.${conn.status}` as never)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </WizardStep>

          <WizardStep>
            <h3 className="mb-3 text-sm font-semibold">{t('stepUnit')}</h3>
            {units.length === 0 ? (
              <p className="text-neutral-dashboard-muted py-8 text-center text-sm">{t('noUnits')}</p>
            ) : (
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {units.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnit(unit.id)}
                    className={`w-full rounded border p-3 text-right text-sm transition-all ${
                      selectedUnit === unit.id
                        ? 'border-dashboard-primary-500 bg-dashboard-primary-50 text-dashboard-primary-700'
                        : 'border-neutral-dashboard-border hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium">{unit.unitName}</div>
                    <div className="text-neutral-dashboard-muted mt-0.5 text-xs">
                      {unit.projectName} • {unit.unitType}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </WizardStep>

          <WizardStep>
            <h3 className="mb-3 text-sm font-semibold">{t('stepRoomType')}</h3>
            {roomTypes.length === 0 ? (
              <p className="text-neutral-dashboard-muted py-8 text-center text-sm">
                {t('noRoomTypes')}
              </p>
            ) : (
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {roomTypes.map((rt) => (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => setSelectedRoomType(rt.id)}
                    className={`w-full rounded border p-3 text-right text-sm transition-all ${
                      selectedRoomType === rt.id
                        ? 'border-dashboard-primary-500 bg-dashboard-primary-50 text-dashboard-primary-700'
                        : 'border-neutral-dashboard-border hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium">{rt.title}</div>
                    <div className="text-neutral-dashboard-muted mt-0.5 text-xs">
                      {t('guests', {
                        adults: rt.occAdults ?? 2,
                        children: rt.occChildren ?? 0,
                      })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </WizardStep>

          <WizardStep>
            <h3 className="mb-3 text-sm font-semibold">{t('stepRatePlan')}</h3>
            {ratePlans.length === 0 ? (
              <p className="text-neutral-dashboard-muted py-8 text-center text-sm">
                {t('noRatePlans')}
              </p>
            ) : (
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {ratePlans.map((rp) => (
                  <button
                    key={rp.id}
                    type="button"
                    onClick={() => setSelectedRatePlan(rp.id)}
                    className={`w-full rounded border p-3 text-right text-sm transition-all ${
                      selectedRatePlan === rp.id
                        ? 'border-dashboard-primary-500 bg-dashboard-primary-50 text-dashboard-primary-700'
                        : 'border-neutral-dashboard-border hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium">{rp.title}</div>
                    <div className="text-neutral-dashboard-muted mt-0.5 text-xs">
                      {rp.currency || 'SAR'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </WizardStep>

          <WizardStep>
            <h3 className="mb-4 text-sm font-semibold">{t('stepConfirm')}</h3>
            <div className="border-neutral-dashboard-border space-y-3 rounded border bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-dashboard-muted">{t('fieldUnit')}</span>
                <span className="font-medium">{selectedUnitData?.unitName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-dashboard-muted">{t('fieldRoom')}</span>
                <span className="font-medium">{selectedRoomTypeData?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-dashboard-muted">{t('fieldRate')}</span>
                <span className="font-medium">{selectedRatePlanData?.title}</span>
              </div>
            </div>
          </WizardStep>

          {error ? (
            <div className="my-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <WizardNavigation
            backLabel={t('back')}
            nextLabel={t('next')}
            submitLabel={t('submit')}
            isNextDisabled={isNextDisabled}
            onBeforeNext={handleBeforeNext}
            onSubmit={handleSubmit}
          />
        </Wizard>
      </DialogContent>
    </Dialog>
  );
}
