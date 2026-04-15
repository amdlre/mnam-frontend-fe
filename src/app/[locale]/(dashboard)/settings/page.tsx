import { Typography } from '@amdlre/design-system';
import { getTranslations } from 'next-intl/server';

import { generateSiteMetadata } from '@/lib/seo/metadata';

import type { Metadata } from 'next';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, {
    title: locale === 'ar' ? 'الإعدادات' : 'Settings',
    pathname: '/dashboard/settings',
    noIndex: true,
  });
}

export default async function SettingsPage() {
  const t = await getTranslations('nav');

  return (
    <div className="space-y-6">
      <Typography variant="h1">{t('settings')}</Typography>
      <Typography variant="p" className="text-muted-foreground">
        {t('profile')}
      </Typography>
    </div>
  );
}
