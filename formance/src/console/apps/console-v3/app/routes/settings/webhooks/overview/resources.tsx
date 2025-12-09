import { MODULES_NAMES } from '@platform/utils';
import ModuleResources from '../../../../components/module-resources';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../../utils/routes';

export default function WebhooksResources() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'webhooks-resources',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WEBHOOKS,
    routeId: 'WEBHOOKS_OVERVIEW_RESOURCES',
    breadcrumbs: [
      {
        title: 'Webhooks',
        to: ROUTES({ organizationId, stackId, region })['WEBHOOKS_OVERVIEW'].to,
      },
      {
        title: 'Resources',
      },
    ],
  });

  return <ModuleResources moduleName={MODULES_NAMES.WEBHOOKS} />;
}
