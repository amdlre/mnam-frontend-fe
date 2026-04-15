import { generateSiteMetadata } from '@/lib/seo/metadata';
import { LoginForm } from '@/components/forms/login-form';

import type { Metadata } from 'next';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, {
    title: locale === 'ar' ? 'تسجيل الدخول' : 'Sign In',
    description:
      locale === 'ar'
        ? 'سجل دخولك إلى حسابك'
        : 'Sign in to your account',
    pathname: '/login',
  });
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
