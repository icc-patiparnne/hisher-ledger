import { MODULES_NAMES } from '@platform/utils';
import ModuleResources from '../../../components/module-resources';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';

export default function LedgerResources() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledgers-resources',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_OVERVIEW_RESOURCES',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'Resources',
      },
    ],
  });

  return <ModuleResources moduleName={MODULES_NAMES.LEDGER} />;
}
