import { Code } from 'lucide-react';
import { useOutletContext } from 'react-router';

import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../../utils/routes';

import { UpdateJson } from '@platform/remix';
import { AppCard } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';

import { TLedgerAccountContext } from '.';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../../../utils/actions';
import { LEDGER_ACTION_UPDATE_ACCOUNT_METADATA } from '../../../constants';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function LedgerAccountMetadata() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName, address } =
    useRouteGuard({
      componentName: 'ledger-account-metadata',
      requiredParams: ['ledgerName', 'address'],
    });

  // Get the data from the context
  const context = useOutletContext<TLedgerAccountContext>();
  const { ledgerAccount } = context;

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_ACCOUNT_METADATA',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'All Ledgers',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_ALL'].to,
      },
      {
        title: ledgerName,
        to: ROUTES({ organizationId, stackId, region, ledgerName })[
          'LEDGER_DETAIL'
        ].to,
      },
      {
        title: 'Accounts',
        to: ROUTES({ organizationId, stackId, region, ledgerName })[
          'LEDGER_ACCOUNTS_INDEX'
        ].to,
      },
      {
        title: address,
        to: ROUTES({ organizationId, stackId, region, ledgerName, address })[
          'LEDGER_ACCOUNT_METADATA'
        ].to,
      },
      {
        title: 'Metadata',
      },
    ],
  });

  return (
    <div className="col-span-12">
      <AppCard title="Metadata" variant="emeraldDark" appIcon={Code}>
        <UpdateJson
          initialJson={ledgerAccount.data.metadata ?? {}}
          actionUrl={
            ACTIONS_ROUTES({ organizationId, stackId, region })[
              LEDGER_ACTION_UPDATE_ACCOUNT_METADATA
            ].to
          }
          formAction={LEDGER_ACTION_UPDATE_ACCOUNT_METADATA}
          formFields={{
            ledger: ledgerName,
            address,
          }}
        />
      </AppCard>
    </div>
  );
}
