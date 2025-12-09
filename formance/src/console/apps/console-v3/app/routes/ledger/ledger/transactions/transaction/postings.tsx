import { useOutletContext } from 'react-router';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../../../utils/routes';
import LedgerTransactionGraph from '../../../components/ledger-transaction-graph';
import LedgerTransactionPostingsList from '../../../components/ledger-transaction-postings-list';
import { TLedgerTransactionContext } from './index';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function LedgerTransactionPostings() {
  useFeatureFlag(FEATURES[MODULES_GATEWAYS.LEDGER]);

  const { organizationId, stackId, region, ledgerName, transactionId } =
    useRouteGuard({
      componentName: 'ledger-transaction-postings',
      requiredParams: ['ledgerName', 'transactionId'],
    });

  // Get the data from the context
  const context = useOutletContext<TLedgerTransactionContext>();
  const data = context.transactionData;

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_TRANSACTION',
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
        title: 'Transactions',
        to: ROUTES({ organizationId, stackId, region, ledgerName })[
          'LEDGER_TRANSACTIONS'
        ].to,
      },
      {
        title: transactionId,
      },
    ],
  });

  return (
    <>
      <div className="col-span-12">
        <LedgerTransactionPostingsList
          postings={data.ledgerTransaction.data.postings}
        />
      </div>

      {data.ledgerTransaction.data.postings.length > 0 && (
        <div className="col-span-12">
          <LedgerTransactionGraph
            ledgerTransaction={data.ledgerTransaction?.data}
          />
        </div>
      )}
    </>
  );
}
