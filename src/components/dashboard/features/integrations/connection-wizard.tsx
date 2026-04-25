'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  CustomCombobox,
  CustomInput,
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
  createChannexConnectionAction,
  verifyChannexApiKeyAction,
} from '@/actions/dashboard/integrations';

import type { ChannexPropertyPreview } from '@/lib/api/dashboard/integrations';
import type { SimpleProject } from '@/lib/api/dashboard/entities';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: SimpleProject[];
  onSuccess: () => void;
}

export function ConnectionWizard({ open, onOpenChange, projects, onSuccess }: Props) {
  const t = useTranslations('dashboard.integrations.connectionWizard');
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [properties, setProperties] = useState<ChannexPropertyPreview[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setSelectedProject('');
      setApiKey('');
      setProperties([]);
      setSelectedProperty('');
      setAutoSync(true);
      setError(null);
    }
  }, [open]);

  async function handleBeforeNext() {
    setError(null);
    if (currentStep === 0 && !selectedProject) return false;
    if (currentStep === 1) {
      if (!apiKey.trim()) {
        setError(t('apiKeyRequired'));
        return false;
      }
      const result = await verifyChannexApiKeyAction(apiKey);
      if (!result.success || !result.data || result.data.length === 0) {
        setError(result.message ?? t('noProperties'));
        return false;
      }
      setProperties(result.data);
      if (result.data.length === 1) setSelectedProperty(result.data[0].id);
    }
    if (currentStep === 2 && !selectedProperty) return false;
    return true;
  }

  async function handleSubmit() {
    setError(null);
    const result = await createChannexConnectionAction({
      projectId: selectedProject,
      apiKey,
      channexPropertyId: selectedProperty,
      autoSync,
    });
    if (!result.success) {
      setError(result.message ?? t('connectionFailed'));
      return;
    }
    onSuccess();
    onOpenChange(false);
  }

  const isNextDisabled =
    (currentStep === 0 && !selectedProject) ||
    (currentStep === 1 && !apiKey.trim()) ||
    (currentStep === 2 && !selectedProperty);

  const selectedProjectData = projects.find((p) => p.id === selectedProject);
  const selectedPropertyData = properties.find((p) => p.id === selectedProperty);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>

        <Wizard defaultStep={0} totalSteps={4} onStepChange={setCurrentStep}>
          <div className="mb-4 flex items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
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
            {projects.length === 0 ? (
              <p className="text-neutral-dashboard-muted py-8 text-center text-sm">
                {t('noProjects')}
              </p>
            ) : (
              <CustomCombobox
                label={t('stepProject')}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                value={selectedProject}
                onValueChange={setSelectedProject}
                placeholder={t('stepProject')}
              />
            )}
          </WizardStep>

          <WizardStep>
            <h3 className="mb-3 text-sm font-semibold">{t('stepApiKey')}</h3>
            <p className="text-neutral-dashboard-muted mb-4 text-xs">{t('stepApiKeyHint')}</p>
            <CustomInput
              type="password"
              dir="ltr"
              placeholder={t('apiKeyPlaceholder')}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </WizardStep>

          <WizardStep>
            <h3 className="mb-3 text-sm font-semibold">{t('stepProperty')}</h3>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {properties.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProperty(p.id)}
                  className={`w-full rounded border p-3 text-right text-sm transition-all ${
                    selectedProperty === p.id
                      ? 'border-dashboard-primary-500 bg-dashboard-primary-50 text-dashboard-primary-700'
                      : 'border-neutral-dashboard-border hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="text-neutral-dashboard-muted mt-1 text-xs">
                    {p.city || p.address || t('noAddress')}
                  </div>
                </button>
              ))}
            </div>
          </WizardStep>

          <WizardStep>
            <h3 className="mb-4 text-sm font-semibold">{t('stepConfirm')}</h3>
            <div className="border-neutral-dashboard-border mb-4 space-y-3 rounded border bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-dashboard-muted">{t('fieldProject')}</span>
                <span className="font-medium">{selectedProjectData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-dashboard-muted">{t('fieldProperty')}</span>
                <span className="font-medium">{selectedPropertyData?.title}</span>
              </div>
            </div>
            <label className="border-neutral-dashboard-border flex cursor-pointer items-center gap-2 rounded border bg-slate-50 p-3">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="text-dashboard-primary-600 h-4 w-4 rounded border-gray-300"
              />
              <div>
                <span className="block text-sm font-medium">{t('autoSyncTitle')}</span>
                <p className="text-neutral-dashboard-muted text-xs">{t('autoSyncHint')}</p>
              </div>
            </label>
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
