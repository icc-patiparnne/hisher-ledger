import { MODULES_NAMES } from '@platform/utils';
import ModuleResources from '../../../components/module-resources';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';

export default function ConnectivityResources() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-resources',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_OVERVIEW_RESOURCES',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'Resources',
      },
    ],
  });

  return <ModuleResources moduleName={MODULES_NAMES.CONNECTIVITY} />;
}
