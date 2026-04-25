'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { FileSignature, Info, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CustomCombobox,
  CustomInput,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { updateProjectAction } from '@/actions/dashboard/entities';
import {
  projectEditSchema,
  type ProjectEditFormData,
} from '@/lib/validations/dashboard/entities';

import type { SimpleOwner } from '@/lib/api/dashboard/entities';
import type { Project } from '@/types/dashboard';

interface Props {
  project: Project;
  owners: SimpleOwner[];
}

const CONTRACT_STATUSES = ['ساري', 'منتهي', 'موقف مؤقتاً'];

export function ProjectEditForm({ project, owners }: Props) {
  const t = useTranslations('dashboard.projectForm');
  const tErrors = useTranslations('dashboard.projectForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();

  const form = useForm<ProjectEditFormData>({
    resolver: zodResolver(projectEditSchema),
    defaultValues: {
      name: project.name,
      owner_id: project.ownerId,
      city: project.city ?? '',
      district: project.district ?? '',
      security_guard_phone: '',
      property_manager_phone: '',
      map_url: '',
      contract_no: project.contractNo ?? '',
      contract_status: project.contractStatus ?? 'ساري',
      contract_duration: '',
      commission_percent: project.commissionPercent ?? 0,
      bank_name: '',
      bank_iban: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardFormStep<ProjectEditFormData>[] = [
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

  const contractStatusLabel = (s: string) =>
    s === 'ساري' ? t('statusActive') : s === 'منتهي' ? t('statusExpired') : t('statusSuspended');

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={project.name}
        subtitle={project.ownerName}
        backHref="/dashboard/projects"
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: tWiz('submit') }}
        onComplete={async (values) => {
          const result = await updateProjectAction(project.id, values);
          if (!result.success) return { message: result.message || t('createFailed') };
          router.push('/dashboard/projects');
          router.refresh();
        }}
      >
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.basic')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('name')}
                isRequired
                type="text"
                placeholder={t('name')}
                error={err(errors.name?.message)}
                {...register('name')}
              />
              <Controller
                control={form.control}
                name="owner_id"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('owner')}
                    isRequired
                    options={owners.map((o) => ({ value: o.id, label: o.name }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectOwner')}
                    emptyMessage={t('noOwners')}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.location')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('city')}
                type="text"
                placeholder={t('city')}
                error={err(errors.city?.message)}
                {...register('city')}
              />
              <CustomInput
                label={t('district')}
                type="text"
                placeholder={t('district')}
                error={err(errors.district?.message)}
                {...register('district')}
              />
              <CustomInput
                label={t('securityPhone')}
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                error={err(errors.security_guard_phone?.message)}
                {...register('security_guard_phone')}
              />
              <CustomInput
                label={t('managerPhone')}
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                error={err(errors.property_manager_phone?.message)}
                {...register('property_manager_phone')}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <CustomInput
                  label={t('mapUrl')}
                  type="url"
                  dir="ltr"
                  placeholder="https://maps.google.com/..."
                  error={err(errors.map_url?.message)}
                  {...register('map_url')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.contract')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('contractNo')}
                type="text"
                placeholder={t('contractNo')}
                error={err(errors.contract_no?.message)}
                {...register('contract_no')}
              />
              <Controller
                control={form.control}
                name="contract_status"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('contractStatus')}
                    options={CONTRACT_STATUSES.map((s) => ({ value: s, label: contractStatusLabel(s) }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectStatus')}
                  />
                )}
              />
              <CustomInput
                label={t('contractDuration')}
                type="text"
                placeholder={t('contractDuration')}
                error={err(errors.contract_duration?.message)}
                {...register('contract_duration')}
              />
              <CustomInput
                label={t('commission')}
                type="number"
                step="0.1"
                placeholder="0"
                error={err(errors.commission_percent?.message)}
                {...register('commission_percent', { valueAsNumber: true })}
              />
              <CustomInput
                label={t('bankName')}
                type="text"
                placeholder={t('bankName')}
                error={err(errors.bank_name?.message)}
                {...register('bank_name')}
              />
              <CustomInput
                label={t('iban')}
                type="text"
                dir="ltr"
                placeholder="SA00 0000 0000 0000 0000 0000"
                error={err(errors.bank_iban?.message)}
                {...register('bank_iban')}
              />
            </div>
          </CardContent>
        </Card>
      </WizardForm>
    </div>
  );
}
