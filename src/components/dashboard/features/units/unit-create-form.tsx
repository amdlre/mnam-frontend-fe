'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Building2, DollarSign } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { Wizard, WizardStep, type WizardStepConfig } from '@/components/shared/wizard';
import { FormCard, FormField, FormInputs } from '@/components/dashboard/features/forms/form-primitives';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { createUnitAction } from '@/actions/dashboard/entities';
import {
  unitCreateSchema,
  type UnitCreateFormData,
} from '@/lib/validations/dashboard/entities';

import type { SimpleProject } from '@/lib/api/dashboard/entities';

interface Props {
  projects: SimpleProject[];
}

const UNIT_TYPES = ['شقة', 'استوديو', 'فيلا', 'شاليه', 'بيت ريفي', 'استراحة', 'كرفان', 'مخيم', 'دوبلكس', 'تاون هاوس'];
const UNIT_STATUSES = ['متاحة', 'محجوزة', 'تحتاج تنظيف', 'صيانة', 'مخفية'];

export function UnitCreateForm({ projects }: Props) {
  const t = useTranslations('dashboard.unitForm');
  const tErrors = useTranslations('dashboard.unitForm.errors');
  const router = useRouter();

  const form = useForm<UnitCreateFormData>({
    resolver: zodResolver(unitCreateSchema),
    defaultValues: {
      project_id: projects[0]?.id ?? '',
      unit_name: '',
      unit_type: UNIT_TYPES[0],
      rooms: 1,
      floor_number: 0,
      unit_area: 0,
      status: 'متاحة',
      base_weekday_price: 0,
      weekend_markup_percent: 0,
      description: '',
      permit_no: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardStepConfig<UnitCreateFormData>[] = [
    {
      id: 'info',
      title: t('steps.info'),
      icon: <Building2 className="h-4 w-4" />,
      fields: ['project_id', 'unit_name', 'unit_type', 'rooms', 'status'],
    },
    {
      id: 'pricing',
      title: t('steps.pricing'),
      icon: <DollarSign className="h-4 w-4" />,
      fields: ['base_weekday_price', 'weekend_markup_percent'],
    },
  ];

  async function handleComplete(values: UnitCreateFormData) {
    const result = await createUnitAction(values);
    if (!result.success) return { success: false, message: result.message || t('createFailed') };
    router.push('/dashboard/units');
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
        backHref="/dashboard/units"
      />

      <Wizard form={form} steps={steps} onComplete={handleComplete} submitLabel={t('submit')}>
        <WizardStep id="info">
          <FormCard title={t('steps.info')}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label={t('project')} required error={err(errors.project_id?.message)}>
                  <select {...register('project_id')} className="input">
                    {projects.length === 0 ? <option value="">{t('noProjects')}</option> : null}
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label={t('unitName')} required error={err(errors.unit_name?.message)}>
                <input type="text" {...register('unit_name')} className="input" />
              </FormField>
              <FormField label={t('unitType')} required error={err(errors.unit_type?.message)}>
                <select {...register('unit_type')} className="input">
                  {UNIT_TYPES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label={t('rooms')} required error={err(errors.rooms?.message)}>
                <input
                  type="number"
                  {...register('rooms', { valueAsNumber: true })}
                  className="input"
                />
              </FormField>
              <FormField label={t('status')} required error={err(errors.status?.message)}>
                <select {...register('status')} className="input">
                  {UNIT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label={t('floor')} error={err(errors.floor_number?.message)}>
                <input
                  type="number"
                  {...register('floor_number', { valueAsNumber: true })}
                  className="input"
                />
              </FormField>
              <FormField label={t('area')} error={err(errors.unit_area?.message)}>
                <input
                  type="number"
                  step="0.1"
                  {...register('unit_area', { valueAsNumber: true })}
                  className="input"
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label={t('description')} error={err(errors.description?.message)}>
                  <textarea {...register('description')} className="input" />
                </FormField>
              </div>
              <FormField label={t('permitNo')} error={err(errors.permit_no?.message)}>
                <input type="text" {...register('permit_no')} className="input" />
              </FormField>
            </div>
          </FormCard>
        </WizardStep>

        <WizardStep id="pricing">
          <FormCard title={t('steps.pricing')}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                label={t('weekdayPrice')}
                required
                error={err(errors.base_weekday_price?.message)}
              >
                <input
                  type="number"
                  step="0.01"
                  {...register('base_weekday_price', { valueAsNumber: true })}
                  className="input"
                />
              </FormField>
              <FormField
                label={t('weekendMarkup')}
                hint={t('weekendMarkupHint')}
                error={err(errors.weekend_markup_percent?.message)}
              >
                <input
                  type="number"
                  step="0.01"
                  {...register('weekend_markup_percent', { valueAsNumber: true })}
                  className="input"
                />
              </FormField>
            </div>
          </FormCard>
        </WizardStep>
      </Wizard>

      <FormInputs />
    </div>
  );
}
