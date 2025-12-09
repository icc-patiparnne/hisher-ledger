import { Link, useOutletContext } from 'react-router';

import { CardActionLarge, CardActionSmall, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import ModuleOverviewAlert from '../../../components/module-overview-alert';
import { useModules } from '../../../hooks/useModules';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { CurrentContext } from '../../../root';
import ILLUSTRATIONS from '../../../utils/illustrations';
import { ROUTES } from '../../../utils/routes';

export default function LedgerOverview() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledger-overview-content',
  });

  const context = useOutletContext<CurrentContext>();

  const { getModule } = useModules({
    organizationId,
    stackId,
    region,
    context,
  });

  const module = getModule(MODULES_NAMES.LEDGER);

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_OVERVIEW',
    breadcrumbs: [
      {
        title: module?.displayName ?? 'Module',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
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
            illustration={ILLUSTRATIONS('LEDGER').LEDGER_CREATE}
            eyebrow="_Create"
            title="New Ledger"
            to={ROUTES({ organizationId, stackId, region })['LEDGER_CREATE'].to}
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <TypographyH3>{'Explore'}</TypographyH3>
        <div className="grid md:grid-cols-2 gap-2">
          {!module?.isActivated && (
            <ModuleOverviewAlert moduleName={MODULES_NAMES.LEDGER} />
          )}

          <CardActionLarge
            illustration={ILLUSTRATIONS('LEDGER').ALL_LEDGERS}
            eyebrow="_LIST"
            title="All Ledgers"
            description="A list of all the ledgers."
            to={ROUTES({ organizationId, stackId, region })['LEDGER_ALL'].to}
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />

          <CardActionLarge
            illustration={ILLUSTRATIONS('LEDGER').ALL_TRANSACTIONS}
            eyebrow="_LIST"
            title="All Transactions"
            description="A list of all transactions."
            to={
              ROUTES({ organizationId, stackId, region })[
                'LEDGER_TRANSACTIONS_INDEX'
              ].to
            }
            asRemixLink={Link}
            isDisabled={!module?.isActivated}
          />

          <CardActionLarge
            illustration={ILLUSTRATIONS('LEDGER').ALL_ACCOUNTS}
            eyebrow="_LIST"
            title="All Accounts"
            description="A list of all accounts."
            to={
              ROUTES({ organizationId, stackId, region })[
                'LEDGER_ACCOUNTS_INDEX'
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
