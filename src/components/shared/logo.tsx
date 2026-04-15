import { Typography } from '@amdlre/design-system';
import Link from 'next/link';

interface LogoProps {
  locale?: string;
}

export function Logo({ locale = 'ar' }: LogoProps) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2">
      <Typography variant="h3" className="font-bold">
        {locale === 'ar' ? 'منام' : 'Mnam'}
      </Typography>
    </Link>
  );
}
