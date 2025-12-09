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

export default function OAuthClientsOverview() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'oauth-clients-overview-content',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.AUTH);

  useRouteUpdate({
    moduleName: MODULES_NAMES.AUTH,
    routeId: 'OAUTH_CLIENTS_OVERVIEW',
    breadcrumbs: [
      {
        title: module?.displayName ?? 'Module',
        to: ROUTES({ organizationId, stackId, region })[
          'OAUTH_CLIENTS_OVERVIEW'
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
            illustration={ILLUSTRATIONS('AUTH').CREATE_OAUTH_CLIENT}
            eyebrow="_Create"
            title="New OAuth Client"
            to={
              ROUTES({ organizationId, stackId, region })['OAUTH_CLIENT_CREATE']
                .to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <TypographyH3>{'Explore'}</TypographyH3>
        <div className="grid gap-2 max-w-screen-md">
          {!module?.isActivated && (
            <ModuleOverviewAlert moduleName={MODULES_NAMES.AUTH} />
          )}

          <CardActionLarge
            illustration={ILLUSTRATIONS('AUTH').ALL_OAUTH_CLIENTS}
            eyebrow="_LIST"
            title="All OAuth Clients"
            description="A list of all the OAuth clients."
            to={
              ROUTES({ organizationId, stackId, region })['OAUTH_CLIENTS_ALL']
                .to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>
    </div>
  );
}
