import { getTranslations } from 'next-intl/server';
import { Bell, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, Typography } from '@amdlre/design-system';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';

export async function IntegrationsDashboard() {
  const t = await getTranslations('dashboard.integrations');

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <Card className="border-neutral-dashboard-border">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <Bell className="text-dashboard-primary-600 h-5 w-5" />
            <Typography as="h3" variant="h4" className="text-base font-bold">
              {t('alertsTitle')}
            </Typography>
          </div>
          <Typography as="p" variant="muted" className="text-sm">
            {t('alertsSubtitle')}
          </Typography>

          <nav className="border-neutral-dashboard-border flex gap-2 border-b">
            {(['open', 'acknowledged', 'resolved', 'all'] as const).map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={
                  index === 0
                    ? 'border-dashboard-primary-600 text-dashboard-primary-600 -mb-px border-b-2 px-3 py-2 text-sm font-medium'
                    : 'text-neutral-dashboard-muted -mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium'
                }
              >
                {t(`alertTabs.${tab}`)}
              </button>
            ))}
          </nav>

          <div className="text-neutral-dashboard-muted py-12 text-center">
            <Bell className="mx-auto mb-2 h-12 w-12 text-slate-300" />
            <p className="text-sm">{t('alertEmpty')}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-dashboard-border">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <LinkIcon className="text-dashboard-primary-600 h-5 w-5" />
            <Typography as="h3" variant="h4" className="text-base font-bold">
              {t('mappingsTitle')}
            </Typography>
          </div>
          <Typography as="p" variant="muted" className="text-sm">
            {t('mappingsSubtitle')}
          </Typography>

          <div className="text-neutral-dashboard-muted py-12 text-center">
            <LinkIcon className="mx-auto mb-2 h-12 w-12 text-slate-300" />
            <p className="text-sm">{t('mappingsEmpty')}</p>
          </div>
        </CardContent>
      </Card>

      <Typography as="p" variant="muted" className="text-xs">
        {t('comingSoon')}
      </Typography>
    </div>
  );
}
