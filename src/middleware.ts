import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { routing } from '@/i18n/routing';
import { APP_CONFIG } from '@/constants/config';
import { PUBLIC_ROUTES, AUTH_ROUTES } from '@/constants/routes';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameLocale = APP_CONFIG.i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  const pathnameWithoutLocale = pathnameLocale
    ? pathname.replace(`/${pathnameLocale}`, '') || '/'
    : pathname;

  const token = request.cookies.get(APP_CONFIG.auth.cookieName)?.value;
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathnameWithoutLocale === route,
  );

  if (isAuthRoute && token) {
    const locale = pathnameLocale || APP_CONFIG.i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  if (!isPublicRoute && !token) {
    const locale = pathnameLocale || APP_CONFIG.i18n.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
