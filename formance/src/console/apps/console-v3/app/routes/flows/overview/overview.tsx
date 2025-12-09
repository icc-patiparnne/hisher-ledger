import { Link, useOutletContext } from 'react-router';

import { CardActionLarge, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import ModuleOverviewAlert from '../../../components/module-overview-alert';
import { useModules } from '../../../hooks/useModules';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../root';
import ILLUSTRATIONS from '../../../utils/illustrations';
import { ROUTES } from '../../../utils/routes';

export default function FlowsOverview() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'flows-overview-content',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.FLOWS);

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_OVERVIEW',
    breadcrumbs: [
      {
        title: module?.displayName ?? 'Module',
      },
      {
        title: 'Overview',
      },
    ],
  });

  return (
    <div className="col-span-12 grid gap-4 mt-4">
      <div className="grid gap-2">
        <TypographyH3>{'Explore'}</TypographyH3>

        {module && !module?.isActivated && (
          <ModuleOverviewAlert moduleName={module.gateway} />
        )}

        <div className="grid gap-2 max-w-screen-md">
          <CardActionLarge
            illustration={ILLUSTRATIONS('FLOWS').WORKFLOWS}
            eyebrow="_LIST"
            title="All Workflows"
            description="A list of all workflows"
            to={
              ROUTES({ organizationId, stackId, region })['FLOWS_WORKFLOWS'].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />

          <CardActionLarge
            illustration={ILLUSTRATIONS('FLOWS').INSTANCES}
            eyebrow="_LIST"
            title="All Instances"
            description="A list of all instances"
            to={
              ROUTES({ organizationId, stackId, region })['FLOWS_INSTANCES'].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />

          <CardActionLarge
            illustration={ILLUSTRATIONS('FLOWS').TRIGGERS}
            eyebrow="_LIST"
            title="All Triggers"
            description="A list of all triggers"
            to={
              ROUTES({ organizationId, stackId, region })['FLOWS_TRIGGERS'].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>
    </div>
  );
}
