'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CalendarDays, ClipboardList } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { Wizard, WizardStep, type WizardStepConfig } from '@/components/shared/wizard';
import { FormCard, FormField, FormInputs } from '@/components/dashboard/features/forms/form-primitives';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { createBookingAction } from '@/actions/dashboard/entities';
import {
  bookingCreateSchema,
  type BookingCreateFormData,
} from '@/lib/validations/dashboard/entities';
import { BOOKING_STATUSES, type FetchedUnit } from '@/types/dashboard';

import type { SimpleProject } from '@/lib/api/dashboard/entities';

interface Props {
  projects: SimpleProject[];
  units: FetchedUnit[];
}

const CHANNELS = ['direct', 'airbnb', 'booking.com', 'expedia', 'agoda', 'gathern', 'other_ota'];

export function BookingCreateForm({ projects, units }: Props) {
  const t = useTranslations('dashboard.bookingForm');
  const tErrors = useTranslations('dashboard.bookingForm.errors');
  const router = useRouter();

  const form = useForm<BookingCreateFormData>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      project_id: projects[0]?.id ?? '',
      unit_id: '',
      guest_name: '',
      guest_phone: '',
      check_in_date: '',
      check_out_date: '',
      total_price: 0,
      status: 'مؤكد',
      channel_source: 'direct',
      notes: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const projectId = watch('project_id');
  const availableUnits = useMemo(
    () => units.filter((u) => (projectId ? u.projectId === projectId : true) && u.status === 'متاحة'),
    [projectId, units],
  );

  const steps: WizardStepConfig<BookingCreateFormData>[] = [
    {
      id: 'selection',
      title: t('steps.selection'),
      icon: <ClipboardList className="h-4 w-4" />,
      fields: ['project_id', 'unit_id', 'guest_name', 'guest_phone'],
    },
    {
      id: 'dates',
      title: t('steps.dates'),
      icon: <CalendarDays className="h-4 w-4" />,
      fields: ['check_in_date', 'check_out_date', 'total_price', 'status', 'channel_source'],
    },
  ];

  async function handleComplete(values: BookingCreateFormData) {
    const result = await createBookingAction(values);
    if (!result.success) return { success: false, message: result.message || t('createFailed') };
    router.push('/dashboard/bookings');
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
        backHref="/dashboard/bookings"
      />

      <Wizard form={form} steps={steps} onComplete={handleComplete} submitLabel={t('submit')}>
        <WizardStep id="selection">
          <FormCard title={t('steps.selection')}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label={t('project')} required error={err(errors.project_id?.message)}>
                <select
                  {...register('project_id')}
                  onChange={(e) => {
                    register('project_id').onChange(e);
                    setValue('unit_id', '');
                  }}
                  className="input"
                >
                  {projects.length === 0 ? <option value="">{t('noProjects')}</option> : null}
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label={t('unit')} required error={err(errors.unit_id?.message)}>
                <select {...register('unit_id')} className="input">
                  <option value="">{t('unitPlaceholder')}</option>
                  {availableUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.unitName}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label={t('guestName')} required error={err(errors.guest_name?.message)}>
                <input type="text" {...register('guest_name')} className="input" />
              </FormField>
              <FormField label={t('guestPhone')} error={err(errors.guest_phone?.message)}>
                <input type="tel" {...register('guest_phone')} className="input" dir="ltr" />
              </FormField>
            </div>
          </FormCard>
        </WizardStep>

        <WizardStep id="dates">
          <FormCard title={t('steps.dates')}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label={t('checkIn')} required error={err(errors.check_in_date?.message)}>
                <input type="date" {...register('check_in_date')} className="input" />
              </FormField>
              <FormField label={t('checkOut')} required error={err(errors.check_out_date?.message)}>
                <input type="date" {...register('check_out_date')} className="input" />
              </FormField>
              <FormField
                label={t('price')}
                hint={t('priceHint')}
                error={err(errors.total_price?.message)}
              >
                <input
                  type="number"
                  step="0.01"
                  {...register('total_price', { valueAsNumber: true })}
                  className="input"
                />
              </FormField>
              <FormField label={t('status')} required error={err(errors.status?.message)}>
                <select {...register('status')} className="input">
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label={t('channel')} error={err(errors.channel_source?.message)}>
                <select {...register('channel_source')} className="input">
                  {CHANNELS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
              <div className="md:col-span-2">
                <FormField label={t('notes')} error={err(errors.notes?.message)}>
                  <textarea {...register('notes')} className="input" />
                </FormField>
              </div>
            </div>
          </FormCard>
        </WizardStep>
      </Wizard>

      <FormInputs />
    </div>
  );
}
