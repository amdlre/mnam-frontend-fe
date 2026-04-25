import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

import { Toaster } from '@amdlre/design-system';

import { routing } from '@/i18n/routing';
import { Providers } from '@/providers';
import { generateSiteMetadata } from '@/lib/seo/metadata';
import { THEME_COOKIE_NAME, isThemePreference } from '@/lib/theme';
import '../globals.css';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale);
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Read the theme cookie so the `dark` class can be set on <html> during SSR.
  // This avoids a FOUC and the React 19 "script inside React component" warning
  // we'd hit if we injected an inline init <script>. For 'system' (or no
  // cookie), we leave the class off and let the client hook resolve it from
  // `prefers-color-scheme` once mounted; the change is imperceptible.
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const themePref = isThemePreference(cookieValue) ? cookieValue : 'system';
  const htmlClass = themePref === 'dark' ? 'dark' : '';

  return (
    <html lang={locale} dir={dir} className={htmlClass} suppressHydrationWarning>
      <body className={`${ibmPlexSansArabic.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
