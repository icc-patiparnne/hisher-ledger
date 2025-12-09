import { MODULES_NAMES } from '@platform/utils';
import ModuleResources from '../../../../components/module-resources';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../../utils/routes';

export default function OAuthClientsResources() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'oauth-clients-resources',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.AUTH,
    routeId: 'OAUTH_CLIENTS_OVERVIEW_RESOURCES',
    breadcrumbs: [
      {
        title: 'Auth',
        to: ROUTES({ organizationId, stackId, region })[
          'OAUTH_CLIENTS_OVERVIEW'
        ].to,
      },
      {
        title: 'Resources',
      },
    ],
  });

  return <ModuleResources moduleName={MODULES_NAMES.AUTH} />;
}
