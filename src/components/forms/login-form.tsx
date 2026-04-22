'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useTransition, useState } from 'react';
import {
  Button,
  Input,
  Label,
  Typography,
  Card,
  Stack,
  Center,
  useToast,
} from '@amdlre/design-system';

import { loginSchema } from '@/lib/validations/auth';
import { loginAction } from '@/actions/auth';

import type { LoginFormData } from '@/lib/validations/auth';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await loginAction(formData);

      if (!result.success) {
        setServerError(result.message || t('error'));
        toast({ variant: 'destructive', description: result.message || t('error') });
      }
    });
  };

  return (
    <Center>
      <Card className="w-full max-w-md p-6">
        <Typography variant="h2" className="mb-6 text-center">
          {t('title')}
        </Typography>

        {serverError && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <Stack gap={4}>
          <Stack gap={2}>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              {...register('email')}
            />
            {errors.email && (
              <Typography variant="p" className="text-sm text-destructive">
                {errors.email.message}
              </Typography>
            )}
          </Stack>

          <Stack gap={2}>
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <Typography variant="p" className="text-sm text-destructive">
                {errors.password.message}
              </Typography>
            )}
          </Stack>

          <Button
            className="w-full"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? t('loading') : t('submit')}
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
