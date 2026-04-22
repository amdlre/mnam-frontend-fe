import type { Metadata } from 'next';
import type { PageProps } from '@/types';

import { generateSiteMetadata } from '@/lib/seo/metadata';
import LandingPage from '@/components/landing/landing-page';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale);
}

export default function HomePage() {
  // TODO: Remove this - testing error page
  // throw new Error('Test error page');
  return <LandingPage />;
}
