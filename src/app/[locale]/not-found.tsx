import { Typography, Button } from '@amdlre/design-system';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Typography variant="h1">404</Typography>
      <Typography variant="p" className="text-muted-foreground">
        {t('notFound.description')}
      </Typography>
      <Button asChild>
        <Link href="/">{t('notFound.backHome')}</Link>
      </Button>
    </div>
  );
}
