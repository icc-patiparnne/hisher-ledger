import { useOutletContext } from 'react-router';

import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../../utils/routes';

import { MODULES_NAMES } from '@platform/utils';
import { TLedgerAccountContext } from '.';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import LedgerAccountAssetsList from '../../../components/ledger-account-assets-list';
import LedgerTransactionsList from '../../../components/ledger-transactions-list';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function LedgerAccountOverview() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName, address } =
    useRouteGuard({
      componentName: 'ledger-account-overview',
      requiredParams: ['ledgerName', 'address'],
    });

  const context = useOutletContext<TLedgerAccountContext>();
  const { ledgerAccount, ledgerAccountTransactions, version } = context;

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_ACCOUNT',
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
          'LEDGER_ACCOUNT'
        ].to,
      },
    ],
  });

  return (
    <>
      <div className="col-span-12">
        <LedgerTransactionsList
          ledgerTransactions={ledgerAccountTransactions?.cursor}
          showLedgerColumn={false}
          version={version}
        />
      </div>
      <div className="col-span-12">
        {ledgerAccount.data && (
          <LedgerAccountAssetsList ledgerAccount={ledgerAccount.data} />
        )}
      </div>
    </>
  );
}
