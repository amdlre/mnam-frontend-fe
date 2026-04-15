import { Typography } from '@amdlre/design-system';
import { getTranslations } from 'next-intl/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('nav');

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-e bg-card p-6 md:block">
        <Typography variant="h3" className="mb-6">
          {t('dashboard')}
        </Typography>
        <nav className="space-y-2">
          <Typography variant="p" className="text-muted-foreground">
            {t('home')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            {t('settings')}
          </Typography>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
