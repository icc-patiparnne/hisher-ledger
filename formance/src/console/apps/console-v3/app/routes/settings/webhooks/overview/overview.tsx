import { CardActionLarge, CardActionSmall, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { Link, useOutletContext } from 'react-router';
import ModuleOverviewAlert from '../../../../components/module-overview-alert';
import { useModules } from '../../../../hooks/useModules';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../../root';
import ILLUSTRATIONS from '../../../../utils/illustrations';
import { ROUTES } from '../../../../utils/routes';

export default function WebhooksOverview() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'webhooks-overview-content',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.WEBHOOKS);

  useRouteUpdate({
    moduleName: MODULES_NAMES.WEBHOOKS,
    routeId: 'WEBHOOKS_OVERVIEW',
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
        <TypographyH3>{'Actions'}</TypographyH3>
        <div className="grid xl:grid-cols-3 2xl:grid-cols-3 gap-2">
          <CardActionSmall
            illustration={ILLUSTRATIONS('WEBHOOKS').CREATE_WEBHOOK}
            eyebrow="_Create"
            title="New Webhook"
            to={
              ROUTES({ organizationId, stackId, region })['WEBHOOK_CREATE'].to
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
            illustration={ILLUSTRATIONS('WEBHOOKS').ALL_WEBHOOKS}
            eyebrow="_LIST"
            title="All Webhooks"
            description="A list of all the webhooks."
            to={ROUTES({ organizationId, stackId, region })['WEBHOOKS_ALL'].to}
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>
    </div>
  );
}
