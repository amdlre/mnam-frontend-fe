'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Phone, UserCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CustomInput,
  CustomTextarea,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { createOwnerAction } from '@/actions/dashboard/entities';
import {
  ownerCreateSchema,
  type OwnerCreateFormData,
} from '@/lib/validations/dashboard/entities';

export function OwnerCreateForm() {
  const t = useTranslations('dashboard.ownerForm');
  const tErrors = useTranslations('dashboard.ownerForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();

  const form = useForm<OwnerCreateFormData>({
    resolver: zodResolver(ownerCreateSchema),
    defaultValues: {
      owner_name: '',
      owner_mobile_phone: '',
      paypal_email: '',
      note: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardFormStep<OwnerCreateFormData>[] = [
    {
      id: 'basic',
      title: t('steps.basic'),
      icon: <UserCircle className="h-4 w-4" />,
      fields: ['owner_name', 'note'],
    },
    {
      id: 'contact',
      title: t('steps.contact'),
      icon: <Phone className="h-4 w-4" />,
      fields: ['owner_mobile_phone', 'paypal_email'],
    },
  ];

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={t('title')}
        subtitle={t('subtitle')}
        backHref="/dashboard/owners"
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: t('submit') }}
        onComplete={async (values) => {
          const result = await createOwnerAction(values);
          if (!result.success) return { message: result.message || t('createFailed') };
          router.push('/dashboard/owners');
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
                placeholder={t('namePlaceholder')}
                error={err(errors.owner_name?.message)}
                {...register('owner_name')}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <CustomTextarea
                  label={t('note')}
                  placeholder={t('notePlaceholder')}
                  error={err(errors.note?.message)}
                  {...register('note')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.contact')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('phone')}
                isRequired
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                error={err(errors.owner_mobile_phone?.message)}
                {...register('owner_mobile_phone')}
              />
              <CustomInput
                label={t('email')}
                type="email"
                dir="ltr"
                placeholder="email@example.com"
                error={err(errors.paypal_email?.message)}
                {...register('paypal_email')}
              />
            </div>
          </CardContent>
        </Card>
      </WizardForm>
    </div>
  );
}
