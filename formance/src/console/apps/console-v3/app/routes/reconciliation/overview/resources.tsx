import { MODULES_NAMES } from '@platform/utils';
import ModuleResources from '../../../components/module-resources';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';

export default function ReconciliationResources() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reconciliation-resources',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.RECONCILIATION,
    routeId: 'RECONCILIATION_OVERVIEW_RESOURCES',
    breadcrumbs: [
      {
        title: 'Reconciliation',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_OVERVIEW'
        ].to,
      },
      {
        title: 'Resources',
      },
    ],
  });

  return <ModuleResources moduleName={MODULES_NAMES.RECONCILIATION} />;
}
