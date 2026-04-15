import { Button, Typography, Card } from '@amdlre/design-system';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { LanguageSwitcher } from '@/components/shared/language-switcher';

import type { Metadata } from 'next';
import type { PageProps } from '@/types';

import { generateSiteMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale);
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('home');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="text-center">
        <Typography variant="h1" className="mb-4">
          {t('title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('subtitle')}
        </Typography>
      </div>

      <Card className="w-full max-w-md p-8 text-center">
        <Typography variant="h3" className="mb-4">
          {locale === 'ar' ? 'مرحباً بك' : 'Welcome'}
        </Typography>
        <Typography variant="p" className="mb-6 text-muted-foreground">
          {locale === 'ar'
            ? 'هذا المشروع جاهز للعمل مع التصميم والترجمة والمصادقة'
            : 'This project is ready with design system, i18n, and authentication'}
        </Typography>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href={`/${locale}/login`}>{t('getStarted')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/register`}>{t('learnMore')}</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
