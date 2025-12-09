import { type RouteConfig } from '@react-router/dev/routes';
import { remixRoutesOptionAdapter } from '@react-router/remix-routes-option-adapter';

import { ACTIONS_ROUTES } from './utils/actions';

const routePathWithParamsPrefix = '/:organizationId/:stackId';

export default remixRoutesOptionAdapter((defineRoutes) =>
  defineRoutes((route) => {
    // GENERAL
    route(`${routePathWithParamsPrefix}`, 'routes/overview.tsx', {
      index: true,
    });
    route('_info', 'routes/[_info].ts');

    // SEARCH
    route(`${routePathWithParamsPrefix}/go-to`, 'routes/go-to.tsx', {
      index: true,
    });

    // SETTINGS - OAUTH CLIENTS
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients`,
      'routes/settings/oauth-clients/overview/index.tsx',
      () => {
        route('', 'routes/settings/oauth-clients/overview/overview.tsx', {
          index: true,
        });
        route(
          'resources',
          'routes/settings/oauth-clients/overview/resources.tsx'
        );
        route(
          'favorites',
          'routes/settings/oauth-clients/overview/favorites.tsx'
        );
      }
    );
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients/all`,
      'routes/settings/oauth-clients/all.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients/:clientId`,
      'routes/settings/oauth-clients/client.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients/create`,
      'routes/settings/oauth-clients/create.tsx'
    );

    // SETTINGS - WEBHOOKS
    route(
      `${routePathWithParamsPrefix}/settings/webhooks`,
      'routes/settings/webhooks/overview/index.tsx',
      () => {
        route('', 'routes/settings/webhooks/overview/overview.tsx', {
          index: true,
        });
        route(
          'overview/resources',
          'routes/settings/webhooks/overview/resources.tsx'
        );
        route(
          'overview/favorites',
          'routes/settings/webhooks/overview/favorites.tsx'
        );
      }
    );
    route(
      `${routePathWithParamsPrefix}/settings/webhooks/all`,
      'routes/settings/webhooks/all.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/settings/webhooks/:webhookId`,
      'routes/settings/webhooks/webhook.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/settings/webhooks/create`,
      'routes/settings/webhooks/create.tsx'
    );

    // LEDGERS
    route(
      `${routePathWithParamsPrefix}/ledger`,
      'routes/ledger/overview/index.tsx',
      () => {
        route('', 'routes/ledger/overview/overview.tsx', { index: true });
        route('resources', 'routes/ledger/overview/resources.tsx');
        route('favorites', 'routes/ledger/overview/favorites.tsx');
      }
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/all`,
      'routes/ledger/all/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/transactions`,
      'routes/ledger/transactions/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/accounts`,
      'routes/ledger/accounts/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledger/create`,
      'routes/ledger/create.tsx'
    );

    // LEDGER
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName`,
      'routes/ledger/ledger/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/transactions`,
      'routes/ledger/ledger/transactions/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/transactions/:transactionId`,
      'routes/ledger/ledger/transactions/transaction/index.tsx',
      () => {
        route(
          '',
          'routes/ledger/ledger/transactions/transaction/postings.tsx',
          {
            index: true,
          }
        );
        route(
          'information',
          'routes/ledger/ledger/transactions/transaction/information.tsx'
        );
        route(
          'metadata',
          'routes/ledger/ledger/transactions/transaction/metadata.tsx'
        );
      }
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/accounts`,
      'routes/ledger/ledger/accounts/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/accounts/:address`,
      'routes/ledger/ledger/accounts/account/index.tsx',
      () => {
        route('', 'routes/ledger/ledger/accounts/account/overview.tsx', {
          index: true,
        });
        route('metadata', 'routes/ledger/ledger/accounts/account/metadata.tsx');
        route('assets', 'routes/ledger/ledger/accounts/account/assets.tsx');
      }
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/volumes`,
      'routes/ledger/ledger/volumes/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/aggregate-balances`,
      'routes/ledger/ledger/aggregate-balances/index.tsx'
    );

    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/migrations`,
      'routes/ledger/ledger/storage-migrations/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/ledgers/:ledgerName/logs`,
      'routes/ledger/ledger/logs/index.tsx'
    );

    // CONNECTIVITY
    route(
      `${routePathWithParamsPrefix}/connectivity`,
      'routes/connectivity/overview/index.tsx',
      () => {
        route('', 'routes/connectivity/overview/overview.tsx', {
          index: true,
        });
        route('resources', 'routes/connectivity/overview/resources.tsx');
        route('favorites', 'routes/connectivity/overview/favorites.tsx');
      }
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/payments`,
      'routes/connectivity/payments/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/payments/:paymentId`,
      'routes/connectivity/payments/payment/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/accounts`,
      'routes/connectivity/accounts/index.tsx'
    );

    route(
      `${routePathWithParamsPrefix}/connectivity/accounts/:paymentAccountId`,
      'routes/connectivity/accounts/account/index.tsx',
      () => {
        route('', 'routes/connectivity/accounts/account/information.tsx', {
          index: true,
        });
        route('balances', 'routes/connectivity/accounts/account/balances.tsx');
        route('pools', 'routes/connectivity/accounts/account/pools.tsx');
        route(
          'transfers',
          'routes/connectivity/accounts/account/transfers/index.tsx'
        );
      }
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/accounts/:paymentAccountId/transfers/_index`,
      'routes/connectivity/accounts/account/transfers/_index.ts'
    );

    route(
      `${routePathWithParamsPrefix}/connectivity/cash-pools`,
      'routes/connectivity/cash-pools/all/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/cash-pool/:paymentCashPoolId`,
      'routes/connectivity/cash-pools/cash-pool/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/cash-pools/create`,
      'routes/connectivity/cash-pools/create.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/transfers`,
      'routes/connectivity/transfers/all/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/transfers/validate`,
      'routes/connectivity/transfers/validate/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/transfers/:paymentTransferId`,
      'routes/connectivity/transfers/transfer/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/bank-accounts`,
      'routes/connectivity/bank-accounts/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/bank-accounts/:paymentBankAccountId`,
      'routes/connectivity/bank-accounts/bank-account/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/bank-accounts/create`,
      'routes/connectivity/bank-accounts/create.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors`,
      'routes/connectivity/connectors/all/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/:connectorSlug`,
      'routes/connectivity/connectors/[slug].tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/installed`,
      'routes/connectivity/connectors/installed/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/install/:connectorSlug`,
      'routes/connectivity/connectors/install/[slug].tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/installed/:connectorId`,
      'routes/connectivity/connectors/installed/connector/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/installed/:connectorId/tasks/:taskId`,
      'routes/connectivity/connectors/installed/connector/task/index.tsx'
    );

    // WALLETS
    route(
      `${routePathWithParamsPrefix}/wallets`,
      'routes/wallets/overview/index.tsx',
      () => {
        route('', 'routes/wallets/overview/overview.tsx', {
          index: true,
        });
        route('resources', 'routes/wallets/overview/resources.tsx');
        route('favorites', 'routes/wallets/overview/favorites.tsx');
      }
    );
    route(
      `${routePathWithParamsPrefix}/wallets/all`,
      'routes/wallets/all/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/:walletId`,
      'routes/wallets/wallet/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/:walletId/balances`,
      'routes/wallets/wallet/balances/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/:walletId/holds`,
      'routes/wallets/wallet/holds/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/:walletId/holds/:walletHoldId`,
      'routes/wallets/wallet/holds/hold/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/:walletId/transactions`,
      'routes/wallets/wallet/transactions/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/create`,
      'routes/wallets/create.tsx'
    );

    // RECONCILIATION
    route(
      `${routePathWithParamsPrefix}/reconciliation`,
      'routes/reconciliation/overview/index.tsx',
      () => {
        route('', 'routes/reconciliation/overview/overview.tsx', {
          index: true,
        });
        route('resources', 'routes/reconciliation/overview/resources.tsx');
        route('favorites', 'routes/reconciliation/overview/favorites.tsx');
      }
    );
    route(
      `${routePathWithParamsPrefix}/reconciliation/policies`,
      'routes/reconciliation/policies/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/reconciliation/policies/:policyId`,
      'routes/reconciliation/policies/policy/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/reconciliation/policies/create`,
      'routes/reconciliation/policies/create.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/reconciliation/reports`,
      'routes/reconciliation/reports/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/reconciliation/policies/:policyId/reports/:reportId`,
      'routes/reconciliation/reports/report/index.tsx'
    );

    // FLOWS
    route(
      `${routePathWithParamsPrefix}/flows`,
      'routes/flows/overview/index.tsx',
      () => {
        route('', 'routes/flows/overview/overview.tsx', { index: true });
        route('resources', 'routes/flows/overview/resources.tsx');
        route('favorites', 'routes/flows/overview/favorites.tsx');
      }
    );
    route(
      `${routePathWithParamsPrefix}/flows/workflows`,
      'routes/flows/workflows/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/flows/workflows/:workflowId`,
      'routes/flows/workflows/workflow/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/flows/instances`,
      'routes/flows/instances/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/flows/workflows/:workflowId/instances/:instanceId`,
      'routes/flows/instances/instance/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/flows/triggers`,
      'routes/flows/triggers/index.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/flows/workflows/:workflowId/triggers/:triggerId`,
      'routes/flows/triggers/trigger/index.tsx'
    );

    // ACTIONS
    route(ACTIONS_ROUTES({}).AUTH_ACTION_LOGOUT.to, 'routes/auth/logout.ts');
    route(
      ACTIONS_ROUTES({}).AUTH_ACTION_REDIRECT_PORTAL.to,
      'routes/auth/redirect-portal.ts'
    );
    route(ACTIONS_ROUTES({}).AUTH_ACTION_LOGIN.to, 'routes/auth/login.ts');
    route(ACTIONS_ROUTES({}).ACTION_SET_THEME.to, 'routes/action.set-theme.ts');

    // LEDGER ACTIONS
    route(
      `${routePathWithParamsPrefix}/ledger/actions/update-ledger-metadata`,
      'routes/ledger/actions/action-ledger-update-metadata.ts'
    );
    route(
      `${routePathWithParamsPrefix}/ledger/actions/update-account-metadata`,
      'routes/ledger/actions/action-ledger-update-account-metadata.ts'
    );
    route(
      `${routePathWithParamsPrefix}/ledger/actions/update-transaction-metadata`,
      'routes/ledger/actions/action-ledger-update-transaction-metadata.ts'
    );
    route(
      `${routePathWithParamsPrefix}/ledger/actions/create-ledger`,
      'routes/ledger/actions/action-ledger-create-ledger.ts'
    );

    // CONNECTIVITY ACTIONS
    route(
      `${routePathWithParamsPrefix}/connectivity/actions/create-cash-pool`,
      'routes/connectivity/actions/action-connectivity-create-cash-pool.ts'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/actions/update-transfer-status`,
      'routes/connectivity/actions/action-connectivity-update-transfer-status.ts'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/actions/create-transfer`,
      'routes/connectivity/actions/action-connectivity-create-transfer.ts'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/actions/install-connector`,
      'routes/connectivity/actions/action-connectivity-install-connector.ts'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/actions/uninstall-connector`,
      'routes/connectivity/actions/action-connectivity-uninstall-connector.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/connectors/actions/reset-connector`,
      'routes/connectivity/actions/action-connectivity-reset-connector.ts'
    );
    route(
      `${routePathWithParamsPrefix}/connectivity/actions/create-bank-account`,
      'routes/connectivity/actions/action-connectivity-create-bank-account.ts'
    );

    // WALLETS ACTIONS
    route(
      `${routePathWithParamsPrefix}/wallets/actions/debit-wallet`,
      'routes/wallets/actions/action-wallets-debit-wallet.ts'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/actions/credit-wallet`,
      'routes/wallets/actions/action-wallets-credit-wallet.ts'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/actions/create-wallet`,
      'routes/wallets/actions/action-wallets-create-wallet.ts'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/actions/confirm-hold`,
      'routes/wallets/actions/action-wallets-holds-confirm.ts'
    );
    route(
      `${routePathWithParamsPrefix}/wallets/actions/void-hold`,
      'routes/wallets/actions/action-wallets-holds-void.ts'
    );

    // RECONCILIATION ACTIONS
    route(
      `${routePathWithParamsPrefix}/reconciliation/actions/delete-policy`,
      'routes/reconciliation/actions/action-reconciliation-delete-policy.ts'
    );
    route(
      `${routePathWithParamsPrefix}/reconciliation/actions/create-policy`,
      'routes/reconciliation/actions/action-reconciliation-create-policy.ts'
    );
    route(
      `${routePathWithParamsPrefix}/reconciliation/actions/run`,
      'routes/reconciliation/actions/action-reconciliation-run.ts'
    );

    // BANKING BRIDGE
    route(
      `${routePathWithParamsPrefix}/banking-bridge`,
      'routes/banking-bridge/overview.tsx'
    );
    route(
      `${routePathWithParamsPrefix}/banking-bridge/browse`,
      'routes/banking-bridge/browse/index.tsx'
    );

    // WEBHOOKS ACTIONS
    route(
      `${routePathWithParamsPrefix}/settings/webhooks/actions/create-webhook`,
      'routes/settings/webhooks/actions/action-webhooks-create-webhook.ts'
    );
    route(
      `${routePathWithParamsPrefix}/settings/webhooks/actions/set-status`,
      'routes/settings/webhooks/actions/action-webhooks-set-status.ts'
    );
    route(
      `${routePathWithParamsPrefix}/settings/webhooks/actions/delete-webhook`,
      'routes/settings/webhooks/actions/action-webhooks-delete-webhook.ts'
    );
    route(
      `${routePathWithParamsPrefix}/settings/webhooks/actions/renew-secret-webhook`,
      'routes/settings/webhooks/actions/action-webhooks-renew-secret.ts'
    );

    // OAUTH CLIENTS ACTIONS
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients/actions/create-client`,
      'routes/settings/oauth-clients/actions/action-oauth-clients-create-client.ts'
    );
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients/actions/delete-client`,
      'routes/settings/oauth-clients/actions/action-oauth-clients-delete-client.ts'
    );
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients/actions/create-secret`,
      'routes/settings/oauth-clients/actions/action-oauth-clients-create-secret.ts'
    );
    route(
      `${routePathWithParamsPrefix}/settings/oauth-clients/actions/delete-secret`,
      'routes/settings/oauth-clients/actions/action-oauth-clients-delete-secret.ts'
    );
  })
) satisfies RouteConfig;
