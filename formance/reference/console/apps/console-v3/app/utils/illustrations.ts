const ALL_ILLUSTRATIONS = {
  ALL_LEDGERS: '/images/illustrations/ledger-ledger-list.webp',
  ALL_TRANSACTIONS: '/images/illustrations/ledger-transactions-list.webp',
  ALL_ACCOUNTS: '/images/illustrations/ledger-accounts-list.webp',
  LEDGER_CREATE: '/images/illustrations/wallets-create.webp',

  LEDGER_TRANSACTIONS: '/images/illustrations/ledger-ledger-transactions.webp',
  LEDGER_ACCOUNTS: '/images/illustrations/ledger-ledger-accounts.webp',
  LEDGER_STORAGE_MIGRATIONS:
    '/images/illustrations/ledger-ledger-storage-migrations.webp',

  CONNECTIVITY_PAYMENTS:
    '/images/illustrations/connectivity-payments-list.webp',
  CONNECTIVITY_ACCOUNTS:
    '/images/illustrations/connectivity-accounts-list.webp',
  CONNECTIVITY_CASH_POOLS:
    '/images/illustrations/connectivity-cash-pools-list.webp',
  CONNECTIVITY_TRANSFERS:
    '/images/illustrations/connectivity-transfers-list.webp',
  CONNECTIVITY_BANK_ACCOUNTS:
    '/images/illustrations/connectivity-bank-accounts-list.webp',
  CONNECTIVITY_CONNECTORS:
    '/images/illustrations/connectivity-connectors-list.webp',
  CONNECTIVITY_INSTALLED_CONNECTORS:
    '/images/illustrations/connectivity-installed-connectors-list.webp',
  CONNECTIVITY_CREATE_TRANSFERS: '/images/illustrations/wallets-create.webp',
  CONNECTIVITY_CREATE_CASH_POOLS: '/images/illustrations/wallets-create.webp',
  CONNECTIVITY_CREATE_CONNECTORS: '/images/illustrations/wallets-create.webp',
  CONNECTIVITY_CREATE_BANK_ACCOUNTS:
    '/images/illustrations/wallets-create.webp',

  WALLETS_LIST: '/images/illustrations/wallets-list.webp',
  WALLETS_CREATE: '/images/illustrations/wallets-create.webp',

  FLOWS_WORKFLOWS: '/images/illustrations/flows-workflows-list.webp',
  FLOWS_INSTANCES: '/images/illustrations/flows-instances-list.webp',
  FLOWS_TRIGGERS: '/images/illustrations/flows-triggers-list.webp',

  RECONCILIATION_POLICIES:
    '/images/illustrations/reconciliation-policies-list.webp',
  RECONCILIATION_POLICIES_CREATE:
    '/images/illustrations/reconciliation-policies-create.webp',
  RECONCILIATION_REPORTS:
    '/images/illustrations/reconciliation-reports-list.webp',
  RECONCILIATION_REPORTS_CREATE:
    '/images/illustrations/reconciliation-reports-create.webp',

  WEBHOOKS_ALL_WEBHOOKS: '/images/illustrations/webhooks-list.webp',
  WEBHOOKS_CREATE_WEBHOOK: '/images/illustrations/wallets-create.webp',
  AUTH_ALL_AUTH: '/images/illustrations/oauth-clients-list.webp',
  AUTH_CREATE_OAUTH_CLIENT: '/images/illustrations/wallets-create.webp',
} as const;

type IllustrationsMap = {
  LEDGER: {
    ALL_LEDGERS: string;
    ALL_TRANSACTIONS: string;
    ALL_ACCOUNTS: string;
    LEDGER_CREATE: string;
    TRANSACTIONS: string;
    ACCOUNTS: string;
    STORAGE_MIGRATIONS: string;
  };
  CONNECTIVITY: {
    ALL_PAYMENTS: string;
    ALL_ACCOUNTS: string;
    ALL_CASH_POOLS: string;
    ALL_TRANSFERS: string;
    ALL_BANK_ACCOUNTS: string;
    ALL_CONNECTORS: string;
    ALL_INSTALLED_CONNECTORS: string;
    CREATE_TRANSFERS: string;
    CREATE_CASH_POOLS: string;
    CREATE_CONNECTORS: string;
    CREATE_BANK_ACCOUNTS: string;
  };
  WALLETS: {
    ALL_WALLETS: string;
    CREATE_WALLET: string;
  };
  FLOWS: {
    WORKFLOWS: string;
    INSTANCES: string;
    TRIGGERS: string;
  };
  RECONCILIATION: {
    POLICIES_LIST: string;
    POLICIES_CREATE: string;
    REPORTS_LIST: string;
    REPORTS_CREATE: string;
  };
  WEBHOOKS: {
    ALL_WEBHOOKS: string;
    CREATE_WEBHOOK: string;
  };
  AUTH: {
    ALL_OAUTH_CLIENTS: string;
    CREATE_OAUTH_CLIENT: string;
  };
  GENERAL: {
    NO_RIGHTS: string;
  };
};

const ILLUSTRATIONS_MAP: IllustrationsMap = {
  LEDGER: {
    ALL_LEDGERS: ALL_ILLUSTRATIONS.ALL_LEDGERS,
    ALL_TRANSACTIONS: ALL_ILLUSTRATIONS.ALL_TRANSACTIONS,
    ALL_ACCOUNTS: ALL_ILLUSTRATIONS.ALL_ACCOUNTS,
    LEDGER_CREATE: ALL_ILLUSTRATIONS.LEDGER_CREATE,
    TRANSACTIONS: ALL_ILLUSTRATIONS.LEDGER_TRANSACTIONS,
    ACCOUNTS: ALL_ILLUSTRATIONS.LEDGER_ACCOUNTS,
    STORAGE_MIGRATIONS: ALL_ILLUSTRATIONS.LEDGER_STORAGE_MIGRATIONS,
  },
  CONNECTIVITY: {
    ALL_PAYMENTS: ALL_ILLUSTRATIONS.CONNECTIVITY_PAYMENTS,
    ALL_ACCOUNTS: ALL_ILLUSTRATIONS.CONNECTIVITY_ACCOUNTS,
    ALL_CASH_POOLS: ALL_ILLUSTRATIONS.CONNECTIVITY_CASH_POOLS,
    ALL_TRANSFERS: ALL_ILLUSTRATIONS.CONNECTIVITY_TRANSFERS,
    ALL_BANK_ACCOUNTS: ALL_ILLUSTRATIONS.CONNECTIVITY_BANK_ACCOUNTS,
    ALL_CONNECTORS: ALL_ILLUSTRATIONS.CONNECTIVITY_CONNECTORS,
    ALL_INSTALLED_CONNECTORS:
      ALL_ILLUSTRATIONS.CONNECTIVITY_INSTALLED_CONNECTORS,
    CREATE_TRANSFERS: ALL_ILLUSTRATIONS.CONNECTIVITY_CREATE_TRANSFERS,
    CREATE_CASH_POOLS: ALL_ILLUSTRATIONS.CONNECTIVITY_CREATE_CASH_POOLS,
    CREATE_CONNECTORS: ALL_ILLUSTRATIONS.CONNECTIVITY_CREATE_CONNECTORS,
    CREATE_BANK_ACCOUNTS: ALL_ILLUSTRATIONS.CONNECTIVITY_CREATE_BANK_ACCOUNTS,
  },
  WALLETS: {
    ALL_WALLETS: ALL_ILLUSTRATIONS.WALLETS_LIST,
    CREATE_WALLET: ALL_ILLUSTRATIONS.WALLETS_CREATE,
  },
  FLOWS: {
    WORKFLOWS: ALL_ILLUSTRATIONS.FLOWS_WORKFLOWS,
    INSTANCES: ALL_ILLUSTRATIONS.FLOWS_INSTANCES,
    TRIGGERS: ALL_ILLUSTRATIONS.FLOWS_TRIGGERS,
  },
  RECONCILIATION: {
    POLICIES_LIST: ALL_ILLUSTRATIONS.RECONCILIATION_POLICIES,
    POLICIES_CREATE: ALL_ILLUSTRATIONS.RECONCILIATION_POLICIES_CREATE,
    REPORTS_LIST: ALL_ILLUSTRATIONS.RECONCILIATION_REPORTS,
    REPORTS_CREATE: ALL_ILLUSTRATIONS.RECONCILIATION_REPORTS_CREATE,
  },
  WEBHOOKS: {
    ALL_WEBHOOKS: ALL_ILLUSTRATIONS.WEBHOOKS_ALL_WEBHOOKS,
    CREATE_WEBHOOK: ALL_ILLUSTRATIONS.WEBHOOKS_CREATE_WEBHOOK,
  },
  AUTH: {
    ALL_OAUTH_CLIENTS: ALL_ILLUSTRATIONS.AUTH_ALL_AUTH,
    CREATE_OAUTH_CLIENT: ALL_ILLUSTRATIONS.AUTH_CREATE_OAUTH_CLIENT,
  },
  GENERAL: {
    NO_RIGHTS: ALL_ILLUSTRATIONS.LEDGER_ACCOUNTS,
  },
};

type TRouteIllustrationContext =
  | 'LEDGER'
  | 'CONNECTIVITY'
  | 'WALLETS'
  | 'FLOWS'
  | 'RECONCILIATION'
  | 'WEBHOOKS'
  | 'AUTH'
  | 'GENERAL';

export default function ILLUSTRATIONS<
  T extends TRouteIllustrationContext | undefined = undefined
>(
  routeContextType?: T
): T extends TRouteIllustrationContext
  ? IllustrationsMap[T]
  : IllustrationsMap['GENERAL'] {
  // TODO: fix any type
  return ILLUSTRATIONS_MAP[routeContextType ?? 'GENERAL'] as any;
}
