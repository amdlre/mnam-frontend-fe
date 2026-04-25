'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Building2, DollarSign, Link as LinkIcon, Sparkles, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CustomCombobox,
  CustomInput,
  CustomTextarea,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { updateUnitAction } from '@/actions/dashboard/entities';
import { ALL_AMENITIES } from '@/lib/constants/amenities';
import {
  unitEditSchema,
  type UnitEditFormData,
} from '@/lib/validations/dashboard/entities';

import type { SimpleProject } from '@/lib/api/dashboard/entities';
import type { FetchedUnit } from '@/types/dashboard';

interface Props {
  unit: FetchedUnit & {
    accessInfo?: string;
    bookingLinks?: Array<{ platform: string; url: string }>;
    discount16Percent?: number;
    discount21Percent?: number;
    discount23Percent?: number;
    weekendMarkupPercent?: number;
  };
  projects: SimpleProject[];
}

const UNIT_TYPES = ['شقة', 'استوديو', 'فيلا', 'شاليه', 'بيت ريفي', 'استراحة', 'كرفان', 'مخيم', 'دوبلكس', 'تاون هاوس'];
const UNIT_STATUSES = ['متاحة', 'محجوزة', 'تحتاج تنظيف', 'صيانة', 'مخفية'];

const DISCOUNT_TIERS: Array<{
  field: 'discount_16_percent' | 'discount_21_percent' | 'discount_23_percent';
  labelKey: 'discount16' | 'discount21' | 'discount23';
  tagKey: 'discount16Tag' | 'discount21Tag' | 'discount23Tag';
  toneClass: string;
}> = [
  { field: 'discount_16_percent', labelKey: 'discount16', tagKey: 'discount16Tag', toneClass: 'border-purple-200 bg-purple-50 text-purple-700' },
  { field: 'discount_21_percent', labelKey: 'discount21', tagKey: 'discount21Tag', toneClass: 'border-pink-200 bg-pink-50 text-pink-700' },
  { field: 'discount_23_percent', labelKey: 'discount23', tagKey: 'discount23Tag', toneClass: 'border-rose-200 bg-rose-50 text-rose-700' },
];

export function UnitEditForm({ unit, projects }: Props) {
  const t = useTranslations('dashboard.unitForm');
  const tErrors = useTranslations('dashboard.unitForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();

  // Reverse-engineer markup from base + weekend price.
  const inferredMarkup =
    unit.weekendMarkupPercent ??
    (unit.priceDaysOfWeek > 0
      ? Math.round(((unit.priceInWeekends / unit.priceDaysOfWeek) - 1) * 100)
      : 0);

  const form = useForm<UnitEditFormData>({
    resolver: zodResolver(unitEditSchema),
    defaultValues: {
      project_id: unit.projectId,
      unit_name: unit.unitName,
      unit_type: unit.unitType,
      rooms: unit.rooms,
      floor_number: unit.floorNumber ?? 0,
      unit_area: unit.unitArea ?? 0,
      status: unit.status,
      base_weekday_price: unit.priceDaysOfWeek,
      weekend_markup_percent: inferredMarkup,
      discount_16_percent: unit.discount16Percent ?? 0,
      discount_21_percent: unit.discount21Percent ?? 0,
      discount_23_percent: unit.discount23Percent ?? 0,
      description: unit.description ?? '',
      permit_no: unit.permit_no ?? '',
      amenities: unit.amenities ?? [],
      access_info: unit.accessInfo ?? '',
      booking_links: unit.bookingLinks ?? [],
    },
    mode: 'onBlur',
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const linksArray = useFieldArray({ control: form.control, name: 'booking_links' });
  const amenities = watch('amenities');
  const basePrice = watch('base_weekday_price') || 0;

  const toggleAmenity = (amenity: string, checked: boolean) => {
    if (checked) {
      setValue('amenities', [...(amenities ?? []), amenity], { shouldDirty: true });
    } else {
      setValue('amenities', (amenities ?? []).filter((a) => a !== amenity), {
        shouldDirty: true,
      });
    }
  };

  const calcDiscounted = (discount: number) =>
    Math.round(basePrice * (1 - (discount || 0) / 100));

  const steps: WizardFormStep<UnitEditFormData>[] = [
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
    {
      id: 'details',
      title: t('steps.details'),
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      id: 'links',
      title: t('steps.links'),
      icon: <LinkIcon className="h-4 w-4" />,
    },
  ];

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={unit.unitName}
        subtitle={unit.projectName}
        backHref="/dashboard/units"
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: tWiz('submit') }}
        onComplete={async (values) => {
          const result = await updateUnitAction(unit.id, values);
          if (!result.success) return { message: result.message || t('createFailed') };
          router.push('/dashboard/units');
          router.refresh();
        }}
      >
        {/* Step 1: Info */}
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.info')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-3">
                <Controller
                  control={form.control}
                  name="project_id"
                  render={({ field, fieldState }) => (
                    <CustomCombobox
                      label={t('project')}
                      isRequired
                      options={projects.map((p) => ({ value: p.id, label: p.name }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={err(fieldState.error?.message)}
                      placeholder={t('selectProject')}
                      emptyMessage={t('noProjects')}
                    />
                  )}
                />
              </div>
              <CustomInput
                label={t('unitName')}
                isRequired
                type="text"
                placeholder={t('unitName')}
                error={err(errors.unit_name?.message)}
                {...register('unit_name')}
              />
              <Controller
                control={form.control}
                name="unit_type"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('unitType')}
                    isRequired
                    options={UNIT_TYPES.map((u) => ({ value: u, label: u }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectUnitType')}
                  />
                )}
              />
              <CustomInput
                label={t('rooms')}
                isRequired
                type="number"
                placeholder="1"
                error={err(errors.rooms?.message)}
                {...register('rooms', { valueAsNumber: true })}
              />
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('status')}
                    isRequired
                    options={UNIT_STATUSES.map((s) => ({ value: s, label: s }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectStatus')}
                  />
                )}
              />
              <CustomInput
                label={t('floor')}
                type="number"
                placeholder="0"
                error={err(errors.floor_number?.message)}
                {...register('floor_number', { valueAsNumber: true })}
              />
              <CustomInput
                label={t('area')}
                type="number"
                step="0.1"
                placeholder="0"
                error={err(errors.unit_area?.message)}
                {...register('unit_area', { valueAsNumber: true })}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <CustomTextarea
                  label={t('description')}
                  placeholder={t('descriptionPlaceholder')}
                  error={err(errors.description?.message)}
                  {...register('description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Pricing + dynamic discounts */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 p-6">
              <h2 className="border-b pb-3 text-base font-bold">{t('steps.pricing')}</h2>
              <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
                <CustomInput
                  label={t('weekdayPrice')}
                  isRequired
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={err(errors.base_weekday_price?.message)}
                  {...register('base_weekday_price', { valueAsNumber: true })}
                />
                <CustomInput
                  label={t('weekendMarkup')}
                  type="number"
                  step="0.01"
                  placeholder="0"
                  error={err(errors.weekend_markup_percent?.message)}
                  {...register('weekend_markup_percent', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="text-base font-bold">{t('discountsTitle')}</h3>
                <p className="text-neutral-dashboard-muted mt-1 text-xs">
                  {t('discountsSubtitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {DISCOUNT_TIERS.map((tier) => {
                  const value = watch(tier.field) || 0;
                  return (
                    <div
                      key={tier.field}
                      className={`rounded-xl border p-4 transition-all hover:shadow-md ${tier.toneClass}`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-bold">{t(tier.labelKey)}</span>
                        <span className="rounded border bg-white px-2 py-0.5 text-[10px]">
                          {t(tier.tagKey)}
                        </span>
                      </div>
                      <CustomInput
                        type="number"
                        step="0.1"
                        placeholder="0"
                        error={err(errors[tier.field]?.message)}
                        {...register(tier.field, { valueAsNumber: true })}
                      />
                      <div className="border-t border-current/20 pt-2 text-xs opacity-80">
                        {t('afterDiscount')}:{' '}
                        <span className="text-base font-black">
                          {calcDiscounted(value)} {t('currency')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 3: Details (amenities + permit) */}
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.details')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('permitNo')}
                type="text"
                placeholder={t('permitNo')}
                error={err(errors.permit_no?.message)}
                {...register('permit_no')}
              />
            </div>

            <div>
              <p className="text-neutral-dashboard-text mb-3 text-sm font-medium">
                {t('amenitiesLabel')}
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {ALL_AMENITIES.map((amenity) => {
                  const checked = (amenities ?? []).includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="border-neutral-dashboard-border flex cursor-pointer items-center gap-2 rounded border bg-slate-50 p-2 transition hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggleAmenity(amenity, e.target.checked)}
                        className="text-dashboard-primary-600 focus:ring-dashboard-primary-500 h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-neutral-dashboard-text text-xs">{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Links + access info */}
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.links')}</h2>

            <CustomTextarea
              label={t('accessInfoLabel')}
              placeholder={t('accessInfoPlaceholder')}
              error={err(errors.access_info?.message)}
              className="bg-yellow-50"
              {...register('access_info')}
            />

            <div>
              <p className="text-neutral-dashboard-text mb-3 text-sm font-medium">
                {t('bookingLinksLabel')}
              </p>
              <div className="space-y-2">
                {linksArray.fields.map((field, idx) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="flex-1">
                      <CustomInput
                        type="text"
                        placeholder={t('platformPlaceholder')}
                        {...register(`booking_links.${idx}.platform`)}
                      />
                    </div>
                    <div className="flex-[2]">
                      <CustomInput
                        type="url"
                        dir="ltr"
                        placeholder={t('urlPlaceholder')}
                        {...register(`booking_links.${idx}.url`)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => linksArray.remove(idx)}
                      className="mt-2 rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => linksArray.append({ platform: '', url: '' })}
                className="text-dashboard-primary-600 hover:text-dashboard-primary-700 mt-2 text-sm font-medium hover:underline"
              >
                {t('bookingLinksAdd')}
              </button>
            </div>
          </CardContent>
        </Card>
      </WizardForm>
    </div>
  );
}
