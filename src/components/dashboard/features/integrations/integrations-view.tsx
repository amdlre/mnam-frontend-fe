'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Building2, Link as LinkIcon, Plus } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { useRouter } from '@/i18n/navigation';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';

import { AlertsList } from './alerts-list';
import { ConnectionWizard } from './connection-wizard';
import { ConnectionsGrid } from './connections-grid';
import { MappingsTable } from './mappings-table';
import { MappingWizard } from './mapping-wizard';

import type {
  ChannexConnection,
  ExternalMapping,
  IntegrationAlert,
} from '@/lib/api/dashboard/integrations';
import type { SimpleProject } from '@/lib/api/dashboard/entities';
import type { FetchedUnit } from '@/types/dashboard';

interface Props {
  connections: ChannexConnection[];
  mappings: ExternalMapping[];
  units: FetchedUnit[];
  projects: SimpleProject[];
  alerts: IntegrationAlert[];
}

type Tab = 'mappings' | 'alerts';

export function IntegrationsView({
  connections,
  mappings,
  units,
  projects,
  alerts,
}: Props) {
  const t = useTranslations('dashboard.integrations');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('mappings');
  const [connectionWizardOpen, setConnectionWizardOpen] = useState(false);
  const [mappingWizardOpen, setMappingWizardOpen] = useState(false);

  const refresh = () => router.refresh();
  const hasConnections = connections.length > 0;

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<LinkIcon className="h-4 w-4" />}
              onClick={() => setConnectionWizardOpen(true)}
            >
              {t('newConnection')}
            </Button>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setMappingWizardOpen(true)}
              disabled={!hasConnections}
            >
              {t('newMapping')}
            </Button>
          </div>
        }
      />

      <ConnectionsGrid connections={connections} />

      <div className="border-neutral-dashboard-border flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab('mappings')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'mappings'
              ? 'border-dashboard-primary-600 text-dashboard-primary-600'
              : 'text-neutral-dashboard-muted hover:text-neutral-dashboard-text border-transparent'
          }`}
        >
          <Building2 className="h-4 w-4" />
          {t('tabs.mappings')} ({mappings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'border-dashboard-primary-600 text-dashboard-primary-600'
              : 'text-neutral-dashboard-muted hover:text-neutral-dashboard-text border-transparent'
          }`}
        >
          <Bell className="h-4 w-4" />
          {t('tabs.alerts')}
        </button>
      </div>

      {activeTab === 'mappings' ? (
        <MappingsTable
          mappings={mappings}
          units={units}
          connections={connections}
          hasConnections={hasConnections}
          onAddMapping={() => setMappingWizardOpen(true)}
        />
      ) : (
        <AlertsList initialAlerts={alerts} initialFilter="open" />
      )}

      <ConnectionWizard
        open={connectionWizardOpen}
        onOpenChange={setConnectionWizardOpen}
        projects={projects}
        onSuccess={refresh}
      />

      <MappingWizard
        open={mappingWizardOpen}
        onOpenChange={setMappingWizardOpen}
        connections={connections}
        units={units}
        onSuccess={refresh}
      />
    </div>
  );
}
