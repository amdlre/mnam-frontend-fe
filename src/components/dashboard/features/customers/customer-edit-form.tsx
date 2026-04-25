'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Phone, UserCircle } from 'lucide-react';
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
import { updateCustomerAction } from '@/actions/dashboard/customers';
import {
  customerEditSchema,
  type CustomerEditFormData,
} from '@/lib/validations/dashboard/customers';

import type { Customer } from '@/lib/api/dashboard/customers';

interface Props {
  customer: Customer;
}

export function CustomerEditForm({ customer }: Props) {
  const t = useTranslations('dashboard.customerForm');
  const tErrors = useTranslations('dashboard.customerForm.errors');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();

  const form = useForm<CustomerEditFormData>({
    resolver: zodResolver(customerEditSchema),
    defaultValues: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email ?? '',
      gender: customer.gender ?? '',
      notes: customer.notes ?? '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardFormStep<CustomerEditFormData>[] = [
    {
      id: 'basic',
      title: t('steps.basic'),
      icon: <UserCircle className="h-4 w-4" />,
      fields: ['name', 'phone'],
    },
    {
      id: 'additional',
      title: t('steps.additional'),
      icon: <Phone className="h-4 w-4" />,
      fields: ['email', 'gender', 'notes'],
    },
  ];

  const err = (k?: string) => (k ? tErrors(k) : '');

  return (
    <div className="space-y-6">
      <HeaderInfo
        size="md"
        title={customer.name}
        subtitle={customer.phone}
        backHref="/dashboard/customers"
      />

      <WizardForm
        form={form}
        steps={steps}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: tWiz('submit') }}
        onComplete={async (values) => {
          const result = await updateCustomerAction(customer.id, values);
          if (!result.success) return { message: result.message || t('createFailed') };
          router.push('/dashboard/customers');
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
                error={err(errors.name?.message)}
                {...register('name')}
              />
              <CustomInput
                label={t('phone')}
                isRequired
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                error={err(errors.phone?.message)}
                {...register('phone')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="border-b pb-3 text-base font-bold">{t('steps.additional')}</h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                label={t('email')}
                type="email"
                dir="ltr"
                placeholder="email@example.com"
                error={err(errors.email?.message)}
                {...register('email')}
              />
              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <CustomCombobox
                    label={t('gender')}
                    options={[
                      { value: 'male', label: t('male') },
                      { value: 'female', label: t('female') },
                    ]}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    error={err(fieldState.error?.message)}
                    placeholder={t('selectGender')}
                  />
                )}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <CustomTextarea
                  label={t('notes')}
                  placeholder={t('notesPlaceholder')}
                  error={err(errors.notes?.message)}
                  {...register('notes')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </WizardForm>
    </div>
  );
}
