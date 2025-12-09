import { MODULES_NAMES } from '@platform/utils';
import ModuleResources from '../../../components/module-resources';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';

export default function WalletsResources() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallets-resources',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLETS_OVERVIEW_RESOURCES',
    breadcrumbs: [
      {
        title: 'Wallets',
        to: ROUTES({ organizationId, stackId, region })['WALLETS_OVERVIEW'].to,
      },
      {
        title: 'Resources',
      },
    ],
  });

  return <ModuleResources moduleName={MODULES_NAMES.WALLETS} />;
}
