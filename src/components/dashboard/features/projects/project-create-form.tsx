'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { FileSignature, Info, MapPin } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { Wizard, WizardStep, type WizardStepConfig } from '@/components/shared/wizard';
import { FormCard, FormField, FormInputs } from '@/components/dashboard/features/forms/form-primitives';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { createProjectAction } from '@/actions/dashboard/entities';
import {
  projectCreateSchema,
  type ProjectCreateFormData,
} from '@/lib/validations/dashboard/entities';

import type { SimpleOwner } from '@/lib/api/dashboard/entities';

interface Props {
  owners: SimpleOwner[];
}

export function ProjectCreateForm({ owners }: Props) {
  const t = useTranslations('dashboard.projectForm');
  const tErrors = useTranslations('dashboard.projectForm.errors');
  const router = useRouter();

  const form = useForm<ProjectCreateFormData>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      name: '',
      owner_id: owners[0]?.id ?? '',
      city: '',
      district: '',
      security_guard_phone: '',
      property_manager_phone: '',
      map_url: '',
      contract_no: '',
      contract_status: 'ساري',
      contract_duration: '',
      commission_percent: 0,
      bank_name: '',
      bank_iban: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardStepConfig<ProjectCreateFormData>[] = [
    {
      id: 'basic',
      title: t('steps.basic'),
      icon: <Info className="h-4 w-4" />,
      fields: ['name', 'owner_id'],
    },
    {
      id: 'location',
      title: t('steps.location'),
      icon: <MapPin className="h-4 w-4" />,
      fields: ['city', 'district'],
    },
    {
      id: 'contract',
      title: t('steps.contract'),
      icon: <FileSignature className="h-4 w-4" />,
      fields: ['contract_no', 'contract_status', 'commission_percent'],
    },
  ];

  async function handleComplete(values: ProjectCreateFormData) {
    const result = await createProjectAction(values);
    if (!result.success) return { success: false, message: result.message || t('createFailed') };
    router.push('/dashboard/projects');
    router.refresh();
    return { success: true };
  }

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={t('title')}
        subtitle={t('subtitle')}
        backHref="/dashboard/projects"
      />

      <Wizard form={form} steps={steps} onComplete={handleComplete} submitLabel={t('submit')}>
        <WizardStep id="basic">
          <FormCard title={t('steps.basic')}>
            <FormField label={t('name')} required error={err(errors.name?.message)}>
              <input type="text" {...register('name')} className="input" />
            </FormField>
            <FormField label={t('owner')} required error={err(errors.owner_id?.message)}>
              <select {...register('owner_id')} className="input">
                {owners.length === 0 ? <option value="">{t('noOwners')}</option> : null}
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </FormField>
          </FormCard>
        </WizardStep>

        <WizardStep id="location">
          <FormCard title={t('steps.location')}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label={t('city')} error={err(errors.city?.message)}>
                <input type="text" {...register('city')} className="input" />
              </FormField>
              <FormField label={t('district')} error={err(errors.district?.message)}>
                <input type="text" {...register('district')} className="input" />
              </FormField>
              <FormField label={t('securityPhone')} error={err(errors.security_guard_phone?.message)}>
                <input type="tel" {...register('security_guard_phone')} className="input" dir="ltr" />
              </FormField>
              <FormField
                label={t('managerPhone')}
                error={err(errors.property_manager_phone?.message)}
              >
                <input type="tel" {...register('property_manager_phone')} className="input" dir="ltr" />
              </FormField>
              <div className="md:col-span-2">
                <FormField label={t('mapUrl')} error={err(errors.map_url?.message)}>
                  <input type="url" {...register('map_url')} className="input" dir="ltr" />
                </FormField>
              </div>
            </div>
          </FormCard>
        </WizardStep>

        <WizardStep id="contract">
          <FormCard title={t('steps.contract')}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label={t('contractNo')} error={err(errors.contract_no?.message)}>
                <input type="text" {...register('contract_no')} className="input" />
              </FormField>
              <FormField label={t('contractStatus')} error={err(errors.contract_status?.message)}>
                <select {...register('contract_status')} className="input">
                  <option value="ساري">{t('statusActive')}</option>
                  <option value="منتهي">{t('statusExpired')}</option>
                  <option value="موقف مؤقتاً">{t('statusSuspended')}</option>
                </select>
              </FormField>
              <FormField label={t('contractDuration')} error={err(errors.contract_duration?.message)}>
                <input type="text" {...register('contract_duration')} className="input" />
              </FormField>
              <FormField label={t('commission')} error={err(errors.commission_percent?.message)}>
                <input
                  type="number"
                  step="0.1"
                  {...register('commission_percent', { valueAsNumber: true })}
                  className="input"
                />
              </FormField>
              <FormField label={t('bankName')} error={err(errors.bank_name?.message)}>
                <input type="text" {...register('bank_name')} className="input" />
              </FormField>
              <FormField label={t('iban')} error={err(errors.bank_iban?.message)}>
                <input type="text" {...register('bank_iban')} className="input" dir="ltr" />
              </FormField>
            </div>
          </FormCard>
        </WizardStep>
      </Wizard>

      <FormInputs />
    </div>
  );
}
