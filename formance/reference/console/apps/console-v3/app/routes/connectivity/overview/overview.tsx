import { CardActionLarge, CardActionSmall, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import { Link, useOutletContext } from 'react-router';
import ModuleOverviewAlert from '../../../components/module-overview-alert';
import { useModules } from '../../../hooks/useModules';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../root';
import ILLUSTRATIONS from '../../../utils/illustrations';
import { ROUTES } from '../../../utils/routes';

export default function ConnectivityOverview() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-overview-content',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.CONNECTIVITY);

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_OVERVIEW',
    breadcrumbs: [
      {
        title: module?.displayName ?? 'Module',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
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
            illustration={ILLUSTRATIONS('CONNECTIVITY').CREATE_CASH_POOLS}
            eyebrow="_Create"
            title="New Cash Pool"
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_CASH_POOLS'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
          <CardActionSmall
            illustration={ILLUSTRATIONS('CONNECTIVITY').CREATE_TRANSFERS}
            eyebrow="_Create"
            title="New Transfer"
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_TRANSFERS'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
          <CardActionSmall
            illustration={ILLUSTRATIONS('CONNECTIVITY').CREATE_CONNECTORS}
            eyebrow="_Install"
            title="New Connector"
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_CONNECTORS_ALL'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
          <CardActionSmall
            illustration={ILLUSTRATIONS('CONNECTIVITY').CREATE_BANK_ACCOUNTS}
            eyebrow="_Create"
            title="New Bank Account"
            to={
              ROUTES({ organizationId, stackId, region })[
                'CONNECTIVITY_BANK_ACCOUNTS_CREATE'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <TypographyH3>{'Explore'}</TypographyH3>
        <div className="grid gap-2 grid-cols-2">
          {module && !module?.isActivated && (
            <ModuleOverviewAlert moduleName={module.gateway} />
          )}

          <div className="grid gap-2">
            <CardActionLarge
              illustration={ILLUSTRATIONS('CONNECTIVITY').ALL_PAYMENTS}
              eyebrow="_LIST"
              title="All Payments"
              description="A list of all payments."
              to={
                ROUTES({ organizationId, stackId, region })[
                  'CONNECTIVITY_PAYMENTS'
                ].to
              }
              asRemixLink={Link}
              isDisabled={!module?.isActivated}
            />

            <CardActionLarge
              illustration={ILLUSTRATIONS('CONNECTIVITY').ALL_ACCOUNTS}
              eyebrow="_LIST"
              title="All Accounts"
              description="A list of all accounts."
              to={
                ROUTES({ organizationId, stackId, region })[
                  'CONNECTIVITY_ACCOUNTS'
                ].to
              }
              asRemixLink={Link}
              isDisabled={!module?.isActivated}
            />

            <CardActionLarge
              illustration={ILLUSTRATIONS('CONNECTIVITY').ALL_CASH_POOLS}
              eyebrow="_LIST"
              title="All Cash Pools"
              description="A list of all cash pools."
              to={
                ROUTES({ organizationId, stackId, region })[
                  'CONNECTIVITY_CASH_POOLS'
                ].to
              }
              asRemixLink={Link}
              isDisabled={!module?.isActivated}
            />
          </div>

          <div className="grid gap-2">
            <CardActionLarge
              illustration={ILLUSTRATIONS('CONNECTIVITY').ALL_TRANSFERS}
              eyebrow="_LIST"
              title="All Transfers"
              description="A list of all transfers."
              to={
                ROUTES({ organizationId, stackId, region })[
                  'CONNECTIVITY_TRANSFERS'
                ].to
              }
              asRemixLink={Link}
              isDisabled={!module?.isActivated}
            />

            <CardActionLarge
              illustration={ILLUSTRATIONS('CONNECTIVITY').ALL_BANK_ACCOUNTS}
              eyebrow="_LIST"
              title="All Bank Accounts"
              description="A list of all bank accounts."
              to={
                ROUTES({ organizationId, stackId, region })[
                  'CONNECTIVITY_BANK_ACCOUNTS'
                ].to
              }
              asRemixLink={Link}
              isDisabled={!module?.isActivated}
            />

            <CardActionLarge
              illustration={
                ILLUSTRATIONS('CONNECTIVITY').ALL_INSTALLED_CONNECTORS
              }
              eyebrow="_LIST"
              title="Installed Connectors"
              description="A list of all installed connectors."
              to={
                ROUTES({ organizationId, stackId, region })[
                  'CONNECTIVITY_CONNECTORS_INSTALLED'
                ].to
              }
              asRemixLink={Link}
              isDisabled={!module?.isActivated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
