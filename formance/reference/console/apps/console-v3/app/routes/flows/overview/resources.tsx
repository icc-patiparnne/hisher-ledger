import { MODULES_NAMES } from '@platform/utils';
import ModuleResources from '../../../components/module-resources';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';

export default function FlowsResources() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'flows-resources',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_OVERVIEW_RESOURCES',
    breadcrumbs: [
      {
        title: 'Flows',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_OVERVIEW'].to,
      },
      {
        title: 'Resources',
      },
    ],
  });

  return <ModuleResources moduleName={MODULES_NAMES.FLOWS} />;
}
