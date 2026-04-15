import { Typography, Card } from '@amdlre/design-system';
import { getTranslations } from 'next-intl/server';

import { generateSiteMetadata } from '@/lib/seo/metadata';

import type { Metadata } from 'next';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, {
    title: locale === 'ar' ? 'لوحة التحكم' : 'Dashboard',
    pathname: '/dashboard',
    noIndex: true,
  });
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="space-y-6">
      <Typography variant="h1">{t('title')}</Typography>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <Typography variant="p" className="text-muted-foreground">
            {t('totalUsers')}
          </Typography>
          <Typography variant="h3">0</Typography>
        </Card>
        <Card className="p-6">
          <Typography variant="p" className="text-muted-foreground">
            {t('revenue')}
          </Typography>
          <Typography variant="h3">$0</Typography>
        </Card>
      </div>
    </div>
  );
}
