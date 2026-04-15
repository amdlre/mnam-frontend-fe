import { Typography } from '@amdlre/design-system';
import { getTranslations } from 'next-intl/server';

import { generateSiteMetadata } from '@/lib/seo/metadata';

import type { Metadata } from 'next';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, {
    title: locale === 'ar' ? 'نسيت كلمة المرور' : 'Forgot Password',
    pathname: '/forgot-password',
  });
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations('auth.login');

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Typography variant="h2" className="mb-4">
          {t('forgotPassword')}
        </Typography>
      </div>
    </div>
  );
}
