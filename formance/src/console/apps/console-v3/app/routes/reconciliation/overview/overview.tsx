import { Link, useOutletContext } from 'react-router';

import { CardActionLarge, CardActionSmall, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import React from 'react';
import ModuleOverviewAlert from '../../../components/module-overview-alert';
import { useModules } from '../../../hooks/useModules';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../root';
import ILLUSTRATIONS from '../../../utils/illustrations';
import { ROUTES } from '../../../utils/routes';

export default function ReconciliationOverview() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reconciliation-overview-content',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.RECONCILIATION);

  useRouteUpdate({
    moduleName: MODULES_NAMES.RECONCILIATION,
    routeId: 'RECONCILIATION_OVERVIEW',
    breadcrumbs: [
      {
        title: 'Reconciliation',
        to: ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_OVERVIEW'
        ].to,
      },
      {
        title: 'Overview',
      },
    ],
  });

  return (
    <div className="col-span-12 grid gap-4 mt-4">
      <div className="grid gap-2">
        <TypographyH3>{'Actions'}</TypographyH3>
        <div className="grid xl:grid-cols-3 2xl:grid-cols-3 gap-2">
          <CardActionSmall
            illustration={ILLUSTRATIONS('RECONCILIATION').POLICIES_CREATE}
            eyebrow="_Create"
            title="New Policy"
            to={
              ROUTES({ organizationId, stackId, region })[
                'RECONCILIATION_POLICY_CREATE'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
          <CardActionSmall
            illustration={ILLUSTRATIONS('RECONCILIATION').REPORTS_CREATE}
            eyebrow="_Create"
            title="New Reconciliation"
            to={
              ROUTES({ organizationId, stackId, region })[
                'RECONCILIATION_POLICIES_LIST'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <TypographyH3>{'Explore'}</TypographyH3>
        <div className="grid gap-2 max-w-screen-md">
          {module && !module?.isActivated && (
            <ModuleOverviewAlert moduleName={module.gateway} />
          )}

          <CardActionLarge
            illustration={ILLUSTRATIONS('RECONCILIATION').POLICIES_LIST}
            eyebrow="_LIST"
            title="All Policies"
            description="A list of all the policies you have created."
            to={
              ROUTES({ organizationId, stackId, region })[
                'RECONCILIATION_POLICIES_LIST'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />

          <CardActionLarge
            illustration={ILLUSTRATIONS('RECONCILIATION').REPORTS_LIST}
            eyebrow="_LIST"
            title="All Reports"
            description="A list of all the reports you have created."
            to={
              ROUTES({ organizationId, stackId, region })[
                'RECONCILIATION_REPORTS_LIST'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>
    </div>
  );
}
