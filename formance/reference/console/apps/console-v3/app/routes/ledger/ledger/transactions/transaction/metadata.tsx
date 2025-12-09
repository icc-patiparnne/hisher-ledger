import { Code } from 'lucide-react';
import { useOutletContext } from 'react-router';

import { UpdateJson } from '@platform/remix';
import { AppCard } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';
import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import { ACTIONS_ROUTES } from '../../../../../utils/actions';
import { ROUTES } from '../../../../../utils/routes';
import { LEDGER_ACTION_UPDATE_TRANSACTION_METADATA } from '../../../constants';
import { TLedgerTransactionContext } from './index';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function LedgerTransactionMetadata() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName, transactionId } =
    useRouteGuard({
      componentName: 'ledger-transaction-metadata',
      requiredParams: ['ledgerName', 'transactionId'],
    });

  const context = useOutletContext<TLedgerTransactionContext>();
  const { ledgerTransaction } = context.transactionData;

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_TRANSACTION_METADATA',
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
    <div className="col-span-12">
      <AppCard title="Metadata" variant="emeraldDark" appIcon={Code}>
        <UpdateJson
          initialJson={ledgerTransaction.data.metadata ?? {}}
          actionUrl={
            ACTIONS_ROUTES({ organizationId, stackId, region })[
              LEDGER_ACTION_UPDATE_TRANSACTION_METADATA
            ].to
          }
          formAction={LEDGER_ACTION_UPDATE_TRANSACTION_METADATA}
          formFields={{
            ledger: ledgerName,
            transactionId: ledgerTransaction.data.id,
          }}
        />
      </AppCard>
    </div>
  );
}
