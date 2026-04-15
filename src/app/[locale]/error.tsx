'use client';

import { useEffect } from 'react';
import { Button, Typography } from '@amdlre/design-system';
import { useTranslations } from 'next-intl';

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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Typography variant="h2">{t('error.title')}</Typography>
      <Typography variant="p" className="text-muted-foreground">
        {t('error.description')}
      </Typography>
      <Button onClick={reset}>{t('error.retry')}</Button>
    </div>
  );
}
