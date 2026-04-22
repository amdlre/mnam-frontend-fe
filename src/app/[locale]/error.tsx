'use client';

import { useEffect } from 'react';
import { Button, Typography, Stack, Container } from '@amdlre/design-system';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/3 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <Container size="2xl" className="relative z-10 px-6">
        <Stack align="center" gap={3} className="text-center">
          {/* Logo */}
          <Image
            src="/mnam-logo.png"
            alt="Mnam"
            width={80}
            height={80}
            className="mb-2"
          />
          {/* Text */}
          <Typography variant="h2" className="font-black tracking-tight">
            {t('error.title')}
          </Typography>
          <Typography variant="p" className="max-w-md text-muted-foreground">
            {t('error.description')}
          </Typography>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={reset} rounded="xl" size="lg">
              {t('error.retry')}
            </Button>
            <Button asChild variant="outline" rounded="xl" size="lg">
              <Link href="/">{t('notFound.backHome')}</Link>
            </Button>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
