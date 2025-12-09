import React from 'react';

import { MODULES_NAMES } from '@platform/utils';
import { Outlet, useOutletContext } from 'react-router';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import ModuleOverviewHeader from '../../../components/module-overview-header';
import TabsNavigation from '../../../components/tabs-navigation';
import { useMicroStack } from '../../../hooks/useMicroStack';
import { useModules } from '../../../hooks/useModules';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { CurrentContext } from '../../../root';
import { TNavModule } from '../../../types/nav-modules';
import { ROUTES } from '../../../utils/routes';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function ReconciliationOverviewLayout() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reconciliation-overview',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.RECONCILIATION);

  const { isMicroStack } = useMicroStack(context);

  return (
    <>
      <ModuleOverviewHeader
        module={module as TNavModule}
        organizationId={organizationId}
        stackId={stackId}
        isMicroStack={isMicroStack}
      />

      <AppContentGrid>
        <div className="col-span-12">
          <TabsNavigation
            tabs={[
              {
                label: 'Overview',
                value: 'overview',
                routeId: 'RECONCILIATION_OVERVIEW',
                route: ROUTES({
                  organizationId,
                  stackId,
                  region,
                })['RECONCILIATION_OVERVIEW'].to,
                shortcut: 'o',
              },
              // {
              //   label: 'Favorites',
              //   value: 'favorites',
              //   routeId: 'RECONCILIATION_OVERVIEW_FAVORITES',
              //   route: ROUTES({
              //     organizationId,
              //     stackId,
              //     region,
              //   })['RECONCILIATION_OVERVIEW_FAVORITES'].to,
              // },
              {
                label: 'Resources',
                value: 'resources',
                routeId: 'RECONCILIATION_OVERVIEW_RESOURCES',
                route: ROUTES({
                  organizationId,
                  stackId,
                  region,
                })['RECONCILIATION_OVERVIEW_RESOURCES'].to,
                shortcut: 'r',
              },
            ]}
          />
        </div>

        <Outlet context={context} />
      </AppContentGrid>
    </>
  );
}
