import { fetchSimpleProjects } from '@/lib/api/dashboard/entities';
import {
  fetchChannexConnections,
  fetchIntegrationAlerts,
  fetchMappings,
} from '@/lib/api/dashboard/integrations';
import { fetchUnits } from '@/lib/api/dashboard/units';

import { IntegrationsView } from './integrations-view';

export async function IntegrationsDashboard() {
  const [connections, mappings, units, projects, alerts] = await Promise.all([
    fetchChannexConnections(),
    fetchMappings(),
    fetchUnits(),
    fetchSimpleProjects(),
    fetchIntegrationAlerts('open'),
  ]);

  return (
    <IntegrationsView
      connections={connections}
      mappings={mappings}
      units={units}
      projects={projects}
      alerts={alerts}
    />
  );
}
