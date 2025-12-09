import { isEmpty } from 'lodash-es';
import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { SnippetsAccordion, SnippetsSheet, TSnippet } from '@platform/ui';
import { FCTL_SNIPPETS, SNIPPETS_MAPPING } from '../utils/snippets';

import { useRouteGuard } from '../hooks/useRouteGuard';
import { TCurrentPage } from './contexts/page-context';

export default function AppSnippetsSheet({
  currentPage,
}: {
  currentPage: TCurrentPage;
}) {
  const { organizationId, stackId } = useRouteGuard({
    componentName: 'app-snippets',
  });

  const [searchParams] = useSearchParams();

  const currentPageSnippets = SNIPPETS_MAPPING[currentPage.routeId];

  const hasSnippets = !isEmpty(currentPageSnippets);

  const ledgerNameFromSearchParams = useMemo(
    () =>
      searchParams.get('ledgers_param_filter:ledger') ||
      searchParams.get('ledger_accounts_param_filter:ledger') ||
      searchParams.get('ledger_transactions_param_filter:ledger') ||
      null,
    [searchParams]
  );

  const {
    ledgerName,
    transactionId,
    address,
    clientId,
    paymentId,
    paymentAccountId,
    paymentCashPoolId,
    paymentTransferId,
    paymentBankAccountId,
    connectorId,
    connectorSlug,
    walletId,
    walletHoldId,
    reportId,
    policyId,
    workflowId,
    instanceId,
    triggerId,
    webhookId,
  } = useParams();

  const fctlSnippets = currentPageSnippets?.map(
    (key) =>
      FCTL_SNIPPETS({
        organizationId,
        stackId,
        ledgerName: ledgerName ?? ledgerNameFromSearchParams ?? undefined,
        transactionId,
        address,
        clientId,
        paymentId,
        paymentAccountId,
        paymentCashPoolId,
        paymentTransferId,
        paymentBankAccountId,
        connectorId,
        connectorSlug,
        walletId,
        walletHoldId,
        reportId,
        policyId,
        workflowId,
        instanceId,
        triggerId,
        webhookId,
      })[key]
  );

  const fctlSnippetsTitles = fctlSnippets?.map((item) => item.title);

  // Get current route snippets
  const renderModuleAccordions = () => (
    <SnippetsAccordion
      snippets={fctlSnippets as TSnippet[]}
      defaultOpen={true}
      defaultValues={fctlSnippetsTitles}
    />
  );

  return (
    <>
      {hasSnippets ? (
        <SnippetsSheet>{renderModuleAccordions()}</SnippetsSheet>
      ) : (
        <div className="h-8"></div>
      )}
    </>
  );
}
