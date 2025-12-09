import { useOutletContext } from 'react-router';

import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../../utils/routes';

import {
  AppCard,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Kbd,
  KbdGroup,
  PreviewJson,
} from '@platform/ui';
import { formatDate, MODULES_NAMES, padNumber } from '@platform/utils';
import { Code } from 'lucide-react';
import { chipVariantFromConsoleType } from '../../../../../components/chip';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import { TLedgerTransactionContext } from './index';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function LedgerTransactionInformation() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName, transactionId } =
    useRouteGuard({
      componentName: 'ledger-transaction',
      requiredParams: ['ledgerName', 'transactionId'],
    });

  // Get the data from the context
  const context = useOutletContext<TLedgerTransactionContext>();
  const { ledgerTransaction } = context.transactionData;

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_TRANSACTION_INFORMATION',
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
      <AppCard
        title="Transaction Information"
        variant="emeraldDark"
        appIcon={Code}
      >
        <DescriptionList>
          <DescriptionTerm>Transaction ID</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromConsoleType['transactionId']}
              label={padNumber(ledgerTransaction?.data.id.toString())}
              copyMode="click"
            />
          </DescriptionDetails>

          <DescriptionTerm>Timestamp</DescriptionTerm>
          <DescriptionDetails>
            <span className="whitespace-nowrap">
              {ledgerTransaction?.data.timestamp
                ? formatDate(ledgerTransaction?.data.timestamp)
                : '-'}
            </span>
          </DescriptionDetails>

          <DescriptionTerm>Reference</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromConsoleType['reference']}
              label={ledgerTransaction?.data.reference || 'None'}
              size="md"
            />
          </DescriptionDetails>

          <DescriptionTerm>Transaction reverted</DescriptionTerm>
          <DescriptionDetails>
            <Chip
              {...chipVariantFromType[
                ledgerTransaction?.data.reverted ? 'true' : 'false'
              ]}
              label={ledgerTransaction?.data.reverted ? 'Yes' : 'No'}
              size="md"
            />
          </DescriptionDetails>

          <DescriptionTerm>
            <div className="flex items-center gap-2">
              Transaction as JSON
              <KbdGroup>
                <Kbd>⇧</Kbd>
                <Kbd>C</Kbd>
              </KbdGroup>
            </div>
          </DescriptionTerm>
          <DescriptionDetails>
            <PreviewJson json={ledgerTransaction?.data} />
          </DescriptionDetails>
        </DescriptionList>
      </AppCard>
    </div>
  );
}
