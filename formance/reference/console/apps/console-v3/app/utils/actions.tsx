import {
  AUTH_ACTION_LOGIN,
  AUTH_ACTION_LOGOUT,
  AUTH_ACTION_REDIRECT_PORTAL,
} from '../routes/auth/constants';

import {
  CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT,
  CONNECTIVITY_ACTION_CREATE_CASH_POOL,
  CONNECTIVITY_ACTION_CREATE_TRANSFER,
  CONNECTIVITY_ACTION_INSTALL_CONNECTOR,
  CONNECTIVITY_ACTION_RESET_CONNECTOR,
  CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR,
  CONNECTIVITY_ACTION_UPDATE_TRANSFER,
} from '../routes/connectivity/constants';

import {
  LEDGER_ACTION_CREATE_LEDGER,
  LEDGER_ACTION_UPDATE_ACCOUNT_METADATA,
  LEDGER_ACTION_UPDATE_METADATA,
  LEDGER_ACTION_UPDATE_TRANSACTION_METADATA,
} from '../routes/ledger/constants';

import {
  RECONCILIATION_ACTION_CREATE_POLICY,
  RECONCILIATION_ACTION_DELETE_POLICY,
  RECONCILIATION_ACTION_RUN,
} from '../routes/reconciliation/constants';

import {
  OAUTH_CLIENTS_ACTION_CREATE_CLIENT,
  OAUTH_CLIENTS_ACTION_CREATE_SECRET,
  OAUTH_CLIENTS_ACTION_DELETE_CLIENT,
  OAUTH_CLIENTS_ACTION_DELETE_SECRET,
} from '../routes/settings/oauth-clients/constants';

import {
  WEBHOOK_ACTION_CREATE_WEBHOOK,
  WEBHOOK_ACTION_DELETE,
  WEBHOOK_ACTION_RENEW_SECRET,
  WEBHOOK_ACTION_SET_STATUS,
} from '../routes/settings/webhooks/constants';
import {
  WALLETS_ACTION_CONFIRM_HOLD,
  WALLETS_ACTION_CREATE_WALLET,
  WALLETS_ACTION_CREDIT_WALLET,
  WALLETS_ACTION_DEBIT_WALLET,
  WALLETS_ACTION_VOID_HOLD,
} from '../routes/wallets/constants';

import { TRouteParamsWithSearchParams } from '../types/routes';
import { ACTION_SET_THEME } from './constants';

export const ACTIONS_ROUTES = ({
  organizationId,
  stackId,
  region,
}: Partial<TRouteParamsWithSearchParams>) => ({
  // AUTH
  [AUTH_ACTION_LOGIN]: {
    to: `/auth/login`,
  },
  [AUTH_ACTION_LOGOUT]: {
    to: `/auth/logout`,
  },
  [AUTH_ACTION_REDIRECT_PORTAL]: {
    to: `/auth/redirect-portal`,
  },
  [ACTION_SET_THEME]: {
    to: `/action/set-theme`,
  },

  // LEDGER
  [LEDGER_ACTION_UPDATE_METADATA]: {
    to: `/${organizationId}/${stackId}/ledger/actions/update-ledger-metadata?region=${region}`,
  },
  [LEDGER_ACTION_UPDATE_ACCOUNT_METADATA]: {
    to: `/${organizationId}/${stackId}/ledger/actions/update-account-metadata?region=${region}`,
  },
  [LEDGER_ACTION_UPDATE_TRANSACTION_METADATA]: {
    to: `/${organizationId}/${stackId}/ledger/actions/update-transaction-metadata?region=${region}`,
  },
  [LEDGER_ACTION_CREATE_LEDGER]: {
    to: `/${organizationId}/${stackId}/ledger/actions/create-ledger?region=${region}`,
  },

  // CONNECTIVITY
  [CONNECTIVITY_ACTION_CREATE_CASH_POOL]: {
    to: `/${organizationId}/${stackId}/connectivity/actions/create-cash-pool?region=${region}`,
  },
  [CONNECTIVITY_ACTION_UPDATE_TRANSFER]: {
    to: `/${organizationId}/${stackId}/connectivity/actions/update-transfer-status?region=${region}`,
  },
  [CONNECTIVITY_ACTION_CREATE_TRANSFER]: {
    to: `/${organizationId}/${stackId}/connectivity/actions/create-transfer?region=${region}`,
  },
  [CONNECTIVITY_ACTION_INSTALL_CONNECTOR]: {
    to: `/${organizationId}/${stackId}/connectivity/connectors/actions/install-connector?region=${region}`,
  },
  [CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR]: {
    to: `/${organizationId}/${stackId}/connectivity/connectors/actions/uninstall-connector?region=${region}`,
  },
  [CONNECTIVITY_ACTION_RESET_CONNECTOR]: {
    to: `/${organizationId}/${stackId}/connectivity/connectors/actions/reset-connector?region=${region}`,
  },
  [CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT]: {
    to: `/${organizationId}/${stackId}/connectivity/actions/create-bank-account?region=${region}`,
  },

  // RECONCILIATION
  [RECONCILIATION_ACTION_DELETE_POLICY]: {
    to: `/${organizationId}/${stackId}/reconciliation/actions/delete-policy?region=${region}`,
  },
  [RECONCILIATION_ACTION_CREATE_POLICY]: {
    to: `/${organizationId}/${stackId}/reconciliation/actions/create-policy?region=${region}`,
  },
  [RECONCILIATION_ACTION_RUN]: {
    to: `/${organizationId}/${stackId}/reconciliation/actions/run?region=${region}`,
  },

  // WALLETS
  [WALLETS_ACTION_DEBIT_WALLET]: {
    to: `/${organizationId}/${stackId}/wallets/actions/debit-wallet?region=${region}`,
  },
  [WALLETS_ACTION_CREDIT_WALLET]: {
    to: `/${organizationId}/${stackId}/wallets/actions/credit-wallet?region=${region}`,
  },
  [WALLETS_ACTION_CREATE_WALLET]: {
    to: `/${organizationId}/${stackId}/wallets/actions/create-wallet?region=${region}`,
  },
  [WALLETS_ACTION_CONFIRM_HOLD]: {
    to: `/${organizationId}/${stackId}/wallets/actions/confirm-hold?region=${region}`,
  },
  [WALLETS_ACTION_VOID_HOLD]: {
    to: `/${organizationId}/${stackId}/wallets/actions/void-hold?region=${region}`,
  },

  // OAUTH CLIENTS
  [OAUTH_CLIENTS_ACTION_CREATE_CLIENT]: {
    to: `/${organizationId}/${stackId}/settings/oauth-clients/actions/create-client?region=${region}`,
  },
  [OAUTH_CLIENTS_ACTION_DELETE_CLIENT]: {
    to: `/${organizationId}/${stackId}/settings/oauth-clients/actions/delete-client?region=${region}`,
  },
  [OAUTH_CLIENTS_ACTION_CREATE_SECRET]: {
    to: `/${organizationId}/${stackId}/settings/oauth-clients/actions/create-secret?region=${region}`,
  },
  [OAUTH_CLIENTS_ACTION_DELETE_SECRET]: {
    to: `/${organizationId}/${stackId}/settings/oauth-clients/actions/delete-secret?region=${region}`,
  },

  // WEBHOOKS
  [WEBHOOK_ACTION_CREATE_WEBHOOK]: {
    to: `/${organizationId}/${stackId}/settings/webhooks/actions/create-webhook?region=${region}`,
  },
  [WEBHOOK_ACTION_SET_STATUS]: {
    to: `/${organizationId}/${stackId}/settings/webhooks/actions/set-status?region=${region}`,
  },
  [WEBHOOK_ACTION_DELETE]: {
    to: `/${organizationId}/${stackId}/settings/webhooks/actions/delete-webhook?region=${region}`,
  },
  [WEBHOOK_ACTION_RENEW_SECRET]: {
    to: `/${organizationId}/${stackId}/settings/webhooks/actions/renew-secret-webhook?region=${region}`,
  },
});
