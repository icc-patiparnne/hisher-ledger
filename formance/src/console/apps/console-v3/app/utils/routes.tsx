import {
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  Cable,
  Code,
  Coins,
  Currency,
  FileBarChart,
  FileJson,
  Home,
  KeyRound,
  Landmark,
  LayoutList,
  ListCheck,
  Logs,
  PlugZap,
  Plus,
  Server,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  Wallet2,
  Webhook,
  Workflow,
  Zap,
} from 'lucide-react';

import { getModule, MODULES_NAMES, TModuleName } from '@platform/utils';
import { TRouteParamsWithSearchParams } from '../types/routes';

type TRouteItem = {
  id: TRouteId;
  moduleName?: TModuleName;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  to: string;
  title: string;
  description: string;
  inSidebar?: boolean;
  inSearch?: boolean;
  params?: Array<
    Exclude<
      keyof TRouteParamsWithSearchParams,
      'organizationId' | 'stackId' | 'region'
    >
  >;
};

export type TRouteId =
  | 'GLOBAL_OVERVIEW'
  | 'GO_TO'
  | 'LEDGER_OVERVIEW'
  | 'LEDGER_OVERVIEW_RESOURCES'
  | 'LEDGER_OVERVIEW_FAVORITES'
  | 'LEDGER_ALL'
  | 'LEDGER_DETAIL'
  | 'LEDGER_STORAGE_MIGRATIONS'
  | 'LEDGER_TRANSACTIONS_INDEX'
  | 'LEDGER_TRANSACTIONS'
  | 'LEDGER_TRANSACTION'
  | 'LEDGER_TRANSACTION_INFORMATION'
  | 'LEDGER_TRANSACTION_METADATA'
  | 'LEDGER_ACCOUNTS_INDEX'
  | 'LEDGER_ACCOUNTS'
  | 'LEDGER_VOLUMES'
  | 'LEDGER_AGGREGATE_BALANCES'
  | 'LEDGER_ACCOUNT'
  | 'LEDGER_ACCOUNT_ASSETS'
  | 'LEDGER_ACCOUNT_METADATA'
  | 'LEDGER_LOGS'
  | 'LEDGER_CREATE'
  | 'CONNECTIVITY_OVERVIEW'
  | 'CONNECTIVITY_OVERVIEW_RESOURCES'
  | 'CONNECTIVITY_OVERVIEW_FAVORITES'
  | 'CONNECTIVITY_PAYMENTS'
  | 'CONNECTIVITY_PAYMENT_DETAIL'
  | 'CONNECTIVITY_ACCOUNTS'
  | 'CONNECTIVITY_ACCOUNT_DETAIL'
  | 'CONNECTIVITY_ACCOUNT_BALANCES'
  | 'CONNECTIVITY_ACCOUNT_TRANSFERS'
  | 'CONNECTIVITY_ACCOUNT_POOLS'
  | 'CONNECTIVITY_CASH_POOLS'
  | 'CONNECTIVITY_CASH_POOLS_CREATE'
  | 'CONNECTIVITY_CASH_POOL_DETAIL'
  | 'CONNECTIVITY_TRANSFERS'
  | 'CONNECTIVITY_TRANSFERS_VALIDATE'
  | 'CONNECTIVITY_TRANSFER_DETAIL'
  | 'CONNECTIVITY_BANK_ACCOUNTS'
  | 'CONNECTIVITY_BANK_ACCOUNT_DETAIL'
  | 'CONNECTIVITY_BANK_ACCOUNTS_CREATE'
  | 'CONNECTIVITY_CONNECTORS_ALL'
  | 'CONNECTIVITY_CONNECTOR_DETAIL'
  | 'CONNECTIVITY_CONNECTORS_INSTALLED'
  | 'CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'
  | 'CONNECTIVITY_CONNECTOR_INSTALLED_TASKS_DETAIL'
  | 'CONNECTIVITY_INSTALL_CONNECTOR'
  | 'WALLETS_OVERVIEW'
  | 'WALLETS_OVERVIEW_RESOURCES'
  | 'WALLETS_OVERVIEW_FAVORITES'
  | 'WALLETS_ALL'
  | 'WALLET_DETAIL'
  | 'WALLET_BALANCES'
  | 'WALLET_HOLDS'
  | 'WALLET_HOLD'
  | 'WALLET_TRANSACTIONS'
  | 'WALLET_CREATE'
  | 'FLOWS_OVERVIEW'
  | 'FLOWS_OVERVIEW_RESOURCES'
  | 'FLOWS_OVERVIEW_FAVORITES'
  | 'FLOWS_WORKFLOWS'
  | 'FLOWS_WORKFLOW_DETAIL'
  | 'FLOWS_INSTANCES'
  | 'FLOWS_INSTANCE_DETAIL'
  | 'FLOWS_TRIGGERS'
  | 'FLOWS_TRIGGER_DETAIL'
  | 'RECONCILIATION_OVERVIEW'
  | 'RECONCILIATION_OVERVIEW_RESOURCES'
  | 'RECONCILIATION_OVERVIEW_FAVORITES'
  | 'RECONCILIATION_POLICIES_LIST'
  | 'RECONCILIATION_POLICY_DETAIL'
  | 'RECONCILIATION_POLICY_CREATE'
  | 'RECONCILIATION_REPORTS_LIST'
  | 'RECONCILIATION_REPORT_DETAIL'
  | 'OAUTH_CLIENTS_OVERVIEW'
  | 'OAUTH_CLIENTS_OVERVIEW_RESOURCES'
  | 'OAUTH_CLIENTS_OVERVIEW_FAVORITES'
  | 'OAUTH_CLIENTS_ALL'
  | 'OAUTH_CLIENT_CREATE'
  | 'OAUTH_CLIENT_DETAIL'
  | 'WEBHOOKS_OVERVIEW'
  | 'WEBHOOKS_OVERVIEW_RESOURCES'
  | 'WEBHOOKS_OVERVIEW_FAVORITES'
  | 'WEBHOOKS_ALL'
  | 'WEBHOOK_DETAIL'
  | 'WEBHOOK_CREATE'
  | 'BANKING_BRIDGE_OVERVIEW'
  | 'BANKING_BRIDGE_BROWSE';

export const ROUTES = ({
  organizationId,
  stackId,
  region,
  ledgerName,
  transactionId,
  address,
  clientId,
  paymentId,
  provider,
  paymentAccountId,
  paymentCashPoolId,
  paymentTransferId,
  paymentBankAccountId,
  connectorId,
  connectorSlug,
  taskId,
  walletId,
  walletHoldId,
  reportId,
  policyId,
  workflowId,
  instanceId,
  triggerId,
  webhookId,
}: Partial<TRouteParamsWithSearchParams>): Record<TRouteId, TRouteItem> => ({
  GLOBAL_OVERVIEW: {
    id: 'GLOBAL_OVERVIEW',
    icon: Home,
    to: `/${organizationId}/${stackId}?region=${region}`,
    title: 'Overview',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  GO_TO: {
    id: 'GO_TO',
    icon: ArrowUpRight,
    to: `/${organizationId}/${stackId}/go-to?region=${region}`,
    title: 'Go to',
    description: '',
    inSidebar: true,
    inSearch: true,
  },

  // ------------------------------
  // LEDGER
  // ------------------------------
  LEDGER_OVERVIEW: {
    id: 'LEDGER_OVERVIEW',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Home,
    to: `/${organizationId}/${stackId}/ledger?region=${region}`,
    title: 'Overview',
    description:
      'Record real-time money movements on a programmable financial ledger built for scalable asset tracking.',
    inSidebar: true,
    inSearch: true,
  },
  LEDGER_OVERVIEW_RESOURCES: {
    id: 'LEDGER_OVERVIEW_RESOURCES',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Code,
    to: `/${organizationId}/${stackId}/ledger/resources?region=${region}`,
    title: 'Resources',
    description: 'Documentation and development tools for the Ledger module',
    inSidebar: false,
    inSearch: true,
  },
  LEDGER_OVERVIEW_FAVORITES: {
    id: 'LEDGER_OVERVIEW_FAVORITES',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Star,
    to: `/${organizationId}/${stackId}/ledger/favorites?region=${region}`,
    title: 'Favorites',
    description: 'View and manage your favorite ledger items',
    inSidebar: false,
    inSearch: true,
  },
  LEDGER_ALL: {
    id: 'LEDGER_ALL',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Server,
    to: `/${organizationId}/${stackId}/ledgers/all?region=${region}`,
    title: 'Ledgers',
    description: 'See the list of ledgers.',
    inSidebar: true,
    inSearch: true,
  },
  LEDGER_DETAIL: {
    id: 'LEDGER_DETAIL',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Landmark,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}?region=${region}`,
    title: 'Ledger',
    description: 'See the details of a ledger.',
    inSidebar: false,
    params: ['ledgerName'],
  },
  LEDGER_STORAGE_MIGRATIONS: {
    id: 'LEDGER_STORAGE_MIGRATIONS',
    moduleName: MODULES_NAMES.LEDGER,
    icon: ArrowLeftRight,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/migrations?region=${region}`,
    title: 'Storage Migrations',
    description: 'See the list of storage migrations.',
    inSidebar: false,
    params: ['ledgerName'],
  },
  LEDGER_TRANSACTIONS_INDEX: {
    id: 'LEDGER_TRANSACTIONS_INDEX',
    moduleName: MODULES_NAMES.LEDGER,
    icon: LayoutList,
    to: `/${organizationId}/${stackId}/ledgers/transactions?region=${region}`,
    title: 'Transactions',
    description: 'See the list of transactions.',
    inSidebar: true,
    inSearch: true,
  },
  LEDGER_TRANSACTIONS: {
    id: 'LEDGER_TRANSACTIONS',
    moduleName: MODULES_NAMES.LEDGER,
    icon: LayoutList,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/transactions?region=${region}`,
    title: 'Transactions',
    description: 'See the list of transactions.',
    inSidebar: false,
    params: ['ledgerName'],
  },
  LEDGER_TRANSACTION: {
    id: 'LEDGER_TRANSACTION',
    moduleName: MODULES_NAMES.LEDGER,
    icon: LayoutList,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/transactions/${transactionId}?region=${region}`,
    title: 'Transaction',
    description: 'See the details of a transaction.',
    inSidebar: false,
    params: ['ledgerName', 'transactionId'],
  },
  LEDGER_TRANSACTION_INFORMATION: {
    id: 'LEDGER_TRANSACTION_INFORMATION',
    moduleName: MODULES_NAMES.LEDGER,
    icon: LayoutList,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/transactions/${transactionId}/information?region=${region}`,
    title: 'Information',
    description: 'See more information about the transaction.',
    inSidebar: false,
    params: ['ledgerName', 'transactionId'],
  },
  LEDGER_TRANSACTION_METADATA: {
    id: 'LEDGER_TRANSACTION_METADATA',
    moduleName: MODULES_NAMES.LEDGER,
    icon: FileJson,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/transactions/${transactionId}/metadata?region=${region}`,
    title: 'Metadata',
    description: 'See the metadata of the transaction.',
    inSidebar: false,
    params: ['ledgerName', 'transactionId'],
  },
  LEDGER_ACCOUNTS_INDEX: {
    id: 'LEDGER_ACCOUNTS_INDEX',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Users,
    to: `/${organizationId}/${stackId}/ledgers/accounts?region=${region}`,
    title: 'Accounts',
    description: 'See the list of accounts.',
    inSidebar: true,
    inSearch: true,
  },
  LEDGER_ACCOUNTS: {
    id: 'LEDGER_ACCOUNTS',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Users,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/accounts?region=${region}`,
    title: 'Accounts',
    description: 'See the list of accounts.',
    inSidebar: false,
    params: ['ledgerName'],
  },
  LEDGER_VOLUMES: {
    id: 'LEDGER_VOLUMES',
    moduleName: MODULES_NAMES.LEDGER,
    icon: FileBarChart,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/volumes?region=${region}`,
    title: 'Volumes',
    description: 'List of volumes with balances for account/asset',
    inSidebar: false,
    params: ['ledgerName'],
  },
  LEDGER_AGGREGATE_BALANCES: {
    id: 'LEDGER_AGGREGATE_BALANCES',
    moduleName: MODULES_NAMES.LEDGER,
    icon: FileBarChart,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/aggregate-balances?region=${region}`,
    title: 'Aggregate Balances',
    description: 'Aggregated balances from selected accounts',
    inSidebar: false,
    params: ['ledgerName'],
  },
  LEDGER_ACCOUNT: {
    id: 'LEDGER_ACCOUNT',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Users,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/accounts/${address}?region=${region}`,
    title: 'Account',
    description: 'See the details of an account.',
    inSidebar: false,
    params: ['ledgerName', 'address'],
  },
  LEDGER_ACCOUNT_ASSETS: {
    id: 'LEDGER_ACCOUNT_ASSETS',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Users,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/accounts/${address}/assets?region=${region}`,
    title: 'Assets',
    description: 'See the list of assets.',
    inSidebar: false,
    params: ['ledgerName', 'address'],
  },
  LEDGER_ACCOUNT_METADATA: {
    id: 'LEDGER_ACCOUNT_METADATA',
    moduleName: MODULES_NAMES.LEDGER,
    icon: FileJson,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/accounts/${address}/metadata?region=${region}`,
    title: 'Metadata',
    description: 'See the metadata of the account.',
    inSidebar: false,
    params: ['ledgerName', 'address'],
  },
  LEDGER_LOGS: {
    id: 'LEDGER_LOGS',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Logs,
    to: `/${organizationId}/${stackId}/ledgers/${ledgerName}/logs?region=${region}`,
    title: 'Logs',
    description: 'See the list of logs.',
    inSidebar: false,
    params: ['ledgerName'],
  },
  LEDGER_CREATE: {
    id: 'LEDGER_CREATE',
    moduleName: MODULES_NAMES.LEDGER,
    icon: Plus,
    to: `/${organizationId}/${stackId}/ledger/create?region=${region}`,
    title: 'Create Ledger',
    description: 'Create a new ledger.',
    inSidebar: false,
  },

  // ------------------------------
  // CONNECTIVITY
  // ------------------------------
  CONNECTIVITY_OVERVIEW: {
    id: 'CONNECTIVITY_OVERVIEW',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Home,
    to: `/${organizationId}/${stackId}/connectivity?region=${region}`,
    title: 'Overview',
    description:
      'A single API to weave in your processing rails. Stitch your financial services providers, from pay-in to pay-out.',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_OVERVIEW_RESOURCES: {
    id: 'CONNECTIVITY_OVERVIEW_RESOURCES',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Home,
    to: `/${organizationId}/${stackId}/connectivity/resources?region=${region}`,
    title: 'Resources',
    description: 'Resources for Connectivity module',
    inSidebar: false,
    inSearch: true,
  },
  CONNECTIVITY_OVERVIEW_FAVORITES: {
    id: 'CONNECTIVITY_OVERVIEW_FAVORITES',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Home,
    to: `/${organizationId}/${stackId}/connectivity/favorites?region=${region}`,
    title: 'Favorites',
    description: 'Favorites for Connectivity module',
    inSidebar: false,
    inSearch: true,
  },
  CONNECTIVITY_PAYMENTS: {
    id: 'CONNECTIVITY_PAYMENTS',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Currency,
    to: `/${organizationId}/${stackId}/connectivity/payments?region=${region}`,
    title: 'Payments',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_PAYMENT_DETAIL: {
    id: 'CONNECTIVITY_PAYMENT_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Currency,
    to: `/${organizationId}/${stackId}/connectivity/payments/${paymentId}?region=${region}`,
    title: 'Payment',
    description: '',
    inSidebar: false,
    params: ['paymentId'],
  },
  CONNECTIVITY_ACCOUNTS: {
    id: 'CONNECTIVITY_ACCOUNTS',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Wallet2,
    to: `/${organizationId}/${stackId}/connectivity/accounts?region=${region}`,
    title: 'Accounts',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_ACCOUNT_DETAIL: {
    id: 'CONNECTIVITY_ACCOUNT_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Wallet2,
    to: `/${organizationId}/${stackId}/connectivity/accounts/${paymentAccountId}?region=${region}`,
    title: 'Account',
    description: '',
    inSidebar: false,
    params: ['paymentAccountId'],
  },
  CONNECTIVITY_ACCOUNT_BALANCES: {
    id: 'CONNECTIVITY_ACCOUNT_BALANCES',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Wallet2,
    to: `/${organizationId}/${stackId}/connectivity/accounts/${paymentAccountId}/balances?region=${region}`,
    title: 'Account balances',
    description: '',
    inSidebar: false,
    params: ['paymentAccountId'],
  },
  CONNECTIVITY_ACCOUNT_TRANSFERS: {
    id: 'CONNECTIVITY_ACCOUNT_TRANSFERS',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: ArrowLeftRight,
    to: `/${organizationId}/${stackId}/connectivity/accounts/${paymentAccountId}/transfers?region=${region}`,
    title: 'Account transfers',
    description: '',
    inSidebar: false,
    params: ['paymentAccountId'],
  },
  CONNECTIVITY_ACCOUNT_POOLS: {
    id: 'CONNECTIVITY_ACCOUNT_POOLS',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Coins,
    to: `/${organizationId}/${stackId}/connectivity/accounts/${paymentAccountId}/pools?region=${region}`,
    title: 'Account pools',
    description: '',
    inSidebar: false,
    params: ['paymentAccountId'],
  },
  CONNECTIVITY_CASH_POOLS: {
    id: 'CONNECTIVITY_CASH_POOLS',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Coins,
    to: `/${organizationId}/${stackId}/connectivity/cash-pools?region=${region}`,
    title: 'Cash Pools',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_CASH_POOLS_CREATE: {
    id: 'CONNECTIVITY_CASH_POOLS_CREATE',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Coins,
    to: `/${organizationId}/${stackId}/connectivity/cash-pools/create?region=${region}`,
    title: 'Create Cash Pool',
    description: '',
    inSidebar: false,
    inSearch: true,
  },
  CONNECTIVITY_CASH_POOL_DETAIL: {
    id: 'CONNECTIVITY_CASH_POOL_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Coins,
    to: `/${organizationId}/${stackId}/connectivity/cash-pool/${paymentCashPoolId}?region=${region}`,
    title: 'Cash Pool',
    description: '',
    inSidebar: false,
    params: ['paymentCashPoolId'],
  },
  CONNECTIVITY_TRANSFERS: {
    id: 'CONNECTIVITY_TRANSFERS',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: ArrowLeftRight,
    to: `/${organizationId}/${stackId}/connectivity/transfers?region=${region}`,
    title: 'Transfers',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_TRANSFERS_VALIDATE: {
    id: 'CONNECTIVITY_TRANSFERS_VALIDATE',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: ArrowLeftRight,
    to: `/${organizationId}/${stackId}/connectivity/transfers/validate?region=${region}`,
    title: 'Validate Transfers',
    description: '',
    inSidebar: false,
    inSearch: true,
  },
  CONNECTIVITY_TRANSFER_DETAIL: {
    id: 'CONNECTIVITY_TRANSFER_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: ArrowLeftRight,
    to: `/${organizationId}/${stackId}/connectivity/transfers/${paymentTransferId}?region=${region}`,
    title: 'Transfer',
    description: '',
    inSidebar: false,
    params: ['paymentTransferId'],
  },
  CONNECTIVITY_BANK_ACCOUNTS: {
    id: 'CONNECTIVITY_BANK_ACCOUNTS',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Banknote,
    to: `/${organizationId}/${stackId}/connectivity/bank-accounts?region=${region}`,
    title: 'Bank Accounts',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_BANK_ACCOUNT_DETAIL: {
    id: 'CONNECTIVITY_BANK_ACCOUNT_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Banknote,
    to: `/${organizationId}/${stackId}/connectivity/bank-accounts/${paymentBankAccountId}?region=${region}`,
    title: 'Bank Account',
    description: '',
    inSidebar: false,
    params: ['paymentBankAccountId'],
  },
  CONNECTIVITY_BANK_ACCOUNTS_CREATE: {
    id: 'CONNECTIVITY_BANK_ACCOUNTS_CREATE',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Banknote,
    to: `/${organizationId}/${stackId}/connectivity/bank-accounts/create?region=${region}`,
    title: 'Create Bank Account',
    description: '',
    inSidebar: false,
    inSearch: true,
    params: undefined,
  },
  CONNECTIVITY_CONNECTORS_INSTALLED: {
    id: 'CONNECTIVITY_CONNECTORS_INSTALLED',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: PlugZap,
    to: `/${organizationId}/${stackId}/connectivity/connectors/installed?region=${region}`,
    title: 'Installed Connectors',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL: {
    id: 'CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Cable,
    to: `/${organizationId}/${stackId}/connectivity/connectors/installed/${connectorId}?region=${region}&provider=${provider}`,
    title: 'Connector',
    description: '',
    inSidebar: false,
    inSearch: false,
    params: ['connectorId', 'provider'],
  },
  CONNECTIVITY_CONNECTOR_INSTALLED_TASKS_DETAIL: {
    id: 'CONNECTIVITY_CONNECTOR_INSTALLED_TASKS_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Cable,
    to: `/${organizationId}/${stackId}/connectivity/connectors/installed/${connectorId}/tasks/${taskId}?region=${region}&provider=${provider}`,
    title: 'Task',
    description: '',
    inSidebar: false,
    params: ['connectorId', 'taskId', 'provider'],
  },
  CONNECTIVITY_INSTALL_CONNECTOR: {
    id: 'CONNECTIVITY_INSTALL_CONNECTOR',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Cable,
    to: `/${organizationId}/${stackId}/connectivity/connectors/install/${connectorSlug}?region=${region}`,
    title: 'Install Connector',
    description: '',
    inSidebar: false,
    params: ['connectorSlug'],
  },
  CONNECTIVITY_CONNECTORS_ALL: {
    id: 'CONNECTIVITY_CONNECTORS_ALL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Cable,
    to: `/${organizationId}/${stackId}/connectivity/connectors?region=${region}`,
    title: 'Browse Connectors',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  CONNECTIVITY_CONNECTOR_DETAIL: {
    id: 'CONNECTIVITY_CONNECTOR_DETAIL',
    moduleName: MODULES_NAMES.CONNECTIVITY,
    icon: Cable,
    to: `/${organizationId}/${stackId}/connectivity/connectors/${connectorSlug}?region=${region}`,
    title: 'Connector',
    description: '',
    inSidebar: false,
    inSearch: false,
    params: ['connectorSlug'],
  },

  // ------------------------------
  // WALLETS
  // ------------------------------
  WALLETS_OVERVIEW: {
    id: 'WALLETS_OVERVIEW',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Home,
    to: `/${organizationId}/${stackId}/wallets?region=${region}`,
    title: 'Overview',
    description:
      'Fully managed white-label wallet service to hold user funds, with built-in support for complex flows like hold and capture.',
    inSidebar: true,
    inSearch: true,
  },
  WALLETS_OVERVIEW_RESOURCES: {
    id: 'WALLETS_OVERVIEW_RESOURCES',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Code,
    to: `/${organizationId}/${stackId}/wallets/resources?region=${region}`,
    title: 'Resources',
    description: 'Documentation and development tools for the Wallets module',
    inSidebar: false,
    inSearch: true,
  },
  WALLETS_OVERVIEW_FAVORITES: {
    id: 'WALLETS_OVERVIEW_FAVORITES',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Star,
    to: `/${organizationId}/${stackId}/wallets/favorites?region=${region}`,
    title: 'Favorites',
    description: 'View and manage your favorite wallet items',
    inSidebar: false,
    inSearch: true,
  },
  WALLETS_ALL: {
    id: 'WALLETS_ALL',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/wallets/all?region=${region}`,
    title: 'All Wallets',
    description: 'See the list of wallets.',
    inSidebar: true,
    inSearch: true,
  },
  WALLET_DETAIL: {
    id: 'WALLET_DETAIL',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/wallets/${walletId}?region=${region}`,
    title: 'Wallet',
    description: 'See the details of a wallet.',
    inSidebar: false,
    params: ['walletId'],
  },
  WALLET_BALANCES: {
    id: 'WALLET_BALANCES',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/wallets/${walletId}/balances?region=${region}`,
    title: 'Wallet balances',
    description: 'See the balances of a wallet.',
    inSidebar: false,
    params: ['walletId'],
  },
  WALLET_HOLDS: {
    id: 'WALLET_HOLDS',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/wallets/${walletId}/holds?region=${region}`,
    title: 'Wallet holds',
    description: 'See the holds of a wallet.',
    inSidebar: false,
    params: ['walletId'],
  },
  WALLET_HOLD: {
    id: 'WALLET_HOLD',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/wallets/${walletId}/holds/${walletHoldId}?region=${region}`,
    title: 'Wallet hold',
    description: 'See the details of a hold.',
    inSidebar: false,
    params: ['walletId', 'walletHoldId'],
  },
  WALLET_TRANSACTIONS: {
    id: 'WALLET_TRANSACTIONS',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/wallets/${walletId}/transactions?region=${region}`,
    title: 'Wallet transactions',
    description: 'See the transactions of a wallet.',
    inSidebar: false,
    params: ['walletId'],
  },
  WALLET_CREATE: {
    id: 'WALLET_CREATE',
    moduleName: MODULES_NAMES.WALLETS,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/wallets/create?region=${region}`,
    title: 'Create Wallet',
    description: 'Create a new wallet.',
    inSidebar: false,
  },

  // ------------------------------
  // FLOWS
  // ------------------------------
  FLOWS_OVERVIEW: {
    id: 'FLOWS_OVERVIEW',
    moduleName: MODULES_NAMES.FLOWS,
    icon: Home,
    to: `/${organizationId}/${stackId}/flows?region=${region}`,
    title: 'Overview',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  FLOWS_OVERVIEW_RESOURCES: {
    id: 'FLOWS_OVERVIEW_RESOURCES',
    moduleName: MODULES_NAMES.FLOWS,
    icon: Code,
    to: `/${organizationId}/${stackId}/flows/resources?region=${region}`,
    title: 'Resources',
    description: 'Documentation and development tools for the Flows module',
    inSidebar: false,
    inSearch: true,
  },
  FLOWS_OVERVIEW_FAVORITES: {
    id: 'FLOWS_OVERVIEW_FAVORITES',
    moduleName: MODULES_NAMES.FLOWS,
    icon: Star,
    to: `/${organizationId}/${stackId}/flows/favorites?region=${region}`,
    title: 'Favorites',
    description: 'View and manage your favorite flow items',
    inSidebar: false,
    inSearch: false,
  },
  FLOWS_WORKFLOWS: {
    id: 'FLOWS_WORKFLOWS',
    moduleName: MODULES_NAMES.FLOWS,
    icon: Workflow,
    to: `/${organizationId}/${stackId}/flows/workflows?region=${region}`,
    title: 'Workflows',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  FLOWS_WORKFLOW_DETAIL: {
    id: 'FLOWS_WORKFLOW_DETAIL',
    moduleName: MODULES_NAMES.FLOWS,
    icon: Workflow,
    to: `/${organizationId}/${stackId}/flows/workflows/${workflowId}?region=${region}`,
    title: 'Workflow',
    description: 'See the details of a workflow.',
    inSidebar: false,
    params: ['workflowId'],
  },
  FLOWS_INSTANCES: {
    id: 'FLOWS_INSTANCES',
    moduleName: MODULES_NAMES.FLOWS,
    icon: ListCheck,
    to: `/${organizationId}/${stackId}/flows/instances?region=${region}`,
    title: 'Instances',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  FLOWS_INSTANCE_DETAIL: {
    id: 'FLOWS_INSTANCE_DETAIL',
    moduleName: MODULES_NAMES.FLOWS,
    icon: ListCheck,
    to: `/${organizationId}/${stackId}/flows/workflows/${workflowId}/instances/${instanceId}?region=${region}`,
    title: 'Instance',
    description: 'See the details of a instance.',
    inSidebar: false,
    params: ['workflowId', 'instanceId'],
  },
  FLOWS_TRIGGERS: {
    id: 'FLOWS_TRIGGERS',
    moduleName: MODULES_NAMES.FLOWS,
    icon: Zap,
    to: `/${organizationId}/${stackId}/flows/triggers?region=${region}`,
    title: 'Triggers',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  FLOWS_TRIGGER_DETAIL: {
    id: 'FLOWS_TRIGGER_DETAIL',
    moduleName: MODULES_NAMES.FLOWS,
    icon: Zap,
    to: `/${organizationId}/${stackId}/flows/workflows/${workflowId}/triggers/${triggerId}?region=${region}`,
    title: 'Trigger',
    description: 'See the details of a trigger.',
    inSidebar: false,
    params: ['workflowId', 'triggerId'],
  },

  // ------------------------------
  // RECONCILIATION
  // ------------------------------
  RECONCILIATION_OVERVIEW: {
    id: 'RECONCILIATION_OVERVIEW',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: Home,
    to: `/${organizationId}/${stackId}/reconciliation?region=${region}`,
    title: 'Overview',
    description:
      'Monitor your accounts exposure, ensure assets correctness and build up safe funds management operations.',
    inSidebar: true,
    inSearch: true,
  },
  RECONCILIATION_OVERVIEW_RESOURCES: {
    id: 'RECONCILIATION_OVERVIEW_RESOURCES',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: Code,
    to: `/${organizationId}/${stackId}/reconciliation/resources?region=${region}`,
    title: 'Resources',
    description:
      'Documentation and development tools for the Reconciliation module',
    inSidebar: false,
    inSearch: true,
  },
  RECONCILIATION_OVERVIEW_FAVORITES: {
    id: 'RECONCILIATION_OVERVIEW_FAVORITES',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: Star,
    to: `/${organizationId}/${stackId}/reconciliation/favorites?region=${region}`,
    title: 'Favorites',
    description: 'View and manage your favorite reconciliation items',
    inSidebar: false,
    inSearch: false,
  },
  RECONCILIATION_POLICIES_LIST: {
    id: 'RECONCILIATION_POLICIES_LIST',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: ShieldCheck,
    to: `/${organizationId}/${stackId}/reconciliation/policies?region=${region}`,
    title: 'Policies',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  RECONCILIATION_POLICY_DETAIL: {
    id: 'RECONCILIATION_POLICY_DETAIL',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: Wallet,
    to: `/${organizationId}/${stackId}/reconciliation/policies/${policyId}?region=${region}`,
    title: 'Policy',
    description: 'See the details of a policy.',
    inSidebar: false,
    params: ['policyId'],
  },
  RECONCILIATION_POLICY_CREATE: {
    id: 'RECONCILIATION_POLICY_CREATE',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: ShieldCheck,
    to: `/${organizationId}/${stackId}/reconciliation/policies/create?region=${region}`,
    title: 'Create Policy',
    description: 'Create a new policy.',
    inSidebar: false,
  },
  RECONCILIATION_REPORTS_LIST: {
    id: 'RECONCILIATION_REPORTS_LIST',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: FileBarChart,
    to: `/${organizationId}/${stackId}/reconciliation/reports?region=${region}`,
    title: 'Reports',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  RECONCILIATION_REPORT_DETAIL: {
    id: 'RECONCILIATION_REPORT_DETAIL',
    moduleName: MODULES_NAMES.RECONCILIATION,
    icon: FileBarChart,
    to: `/${organizationId}/${stackId}/reconciliation/policies/${policyId}/reports/${reportId}?region=${region}`,
    title: 'Report',
    description: 'See the details of a report.',
    inSidebar: false,
    params: ['policyId', 'reportId'],
  },

  // ------------------------------
  // OAUTH CLIENTS
  // ------------------------------
  OAUTH_CLIENTS_OVERVIEW: {
    id: 'OAUTH_CLIENTS_OVERVIEW',
    moduleName: MODULES_NAMES.AUTH,
    icon: KeyRound,
    to: `/${organizationId}/${stackId}/settings/oauth-clients?region=${region}`,
    title: 'OAuth Clients',
    description: '',
    inSidebar: false,
    inSearch: true,
  },
  OAUTH_CLIENTS_OVERVIEW_RESOURCES: {
    id: 'OAUTH_CLIENTS_OVERVIEW_RESOURCES',
    moduleName: MODULES_NAMES.AUTH,
    icon: Code,
    to: `/${organizationId}/${stackId}/settings/oauth-clients/resources?region=${region}`,
    title: 'Resources',
    description:
      'Documentation and development tools for the OAuth Clients module',
    inSidebar: false,
    inSearch: true,
  },
  OAUTH_CLIENTS_OVERVIEW_FAVORITES: {
    id: 'OAUTH_CLIENTS_OVERVIEW_FAVORITES',
    moduleName: MODULES_NAMES.AUTH,
    icon: Star,
    to: `/${organizationId}/${stackId}/settings/oauth-clients/favorites?region=${region}`,
    title: 'Favorites',
    description: 'View and manage your favorite oauth client items',
    inSidebar: false,
    inSearch: false,
  },
  OAUTH_CLIENTS_ALL: {
    id: 'OAUTH_CLIENTS_ALL',
    moduleName: MODULES_NAMES.AUTH,
    icon: KeyRound,
    to: `/${organizationId}/${stackId}/settings/oauth-clients/all?region=${region}`,
    title: 'OAuth Clients',
    description: '',
    inSidebar: true,
    inSearch: true,
  },
  OAUTH_CLIENT_CREATE: {
    id: 'OAUTH_CLIENT_CREATE',
    moduleName: MODULES_NAMES.AUTH,
    icon: KeyRound,
    to: `/${organizationId}/${stackId}/settings/oauth-clients/create?region=${region}`,
    title: 'Create OAuth Client',
    description: 'Create a new OAuth client for authentication',
    inSidebar: false,
    inSearch: true,
  },
  OAUTH_CLIENT_DETAIL: {
    id: 'OAUTH_CLIENT_DETAIL',
    moduleName: MODULES_NAMES.AUTH,
    icon: KeyRound,
    to: `/${organizationId}/${stackId}/settings/oauth-clients/${clientId}?region=${region}`,
    title: 'OAuth Client',
    description: '',
    inSidebar: false,
    params: ['clientId'],
  },

  // ------------------------------
  // WEBHOOKS
  // ------------------------------
  WEBHOOKS_OVERVIEW: {
    id: 'WEBHOOKS_OVERVIEW',
    moduleName: MODULES_NAMES.WEBHOOKS,
    icon: Webhook,
    to: `/${organizationId}/${stackId}/settings/webhooks?region=${region}`,
    title: 'Webhooks',
    description: '',
    inSidebar: false,
    inSearch: true,
  },
  WEBHOOKS_OVERVIEW_RESOURCES: {
    id: 'WEBHOOKS_OVERVIEW_RESOURCES',
    moduleName: MODULES_NAMES.WEBHOOKS,
    icon: Code,
    to: `/${organizationId}/${stackId}/settings/webhooks/overview/resources?region=${region}`,
    title: 'Resources',
    description: 'Documentation and development tools for the Webhooks module',
    inSidebar: false,
    inSearch: true,
  },
  WEBHOOKS_OVERVIEW_FAVORITES: {
    id: 'WEBHOOKS_OVERVIEW_FAVORITES',
    moduleName: MODULES_NAMES.WEBHOOKS,
    icon: Star,
    to: `/${organizationId}/${stackId}/settings/webhooks/overview/favorites?region=${region}`,
    title: 'Favorites',
    description: 'View and manage your favorite webhook items',
    inSidebar: false,
    inSearch: false,
  },
  WEBHOOKS_ALL: {
    id: 'WEBHOOKS_ALL',
    moduleName: MODULES_NAMES.WEBHOOKS,
    icon: Webhook,
    to: `/${organizationId}/${stackId}/settings/webhooks/all?region=${region}`,
    title: 'All Webhooks',
    description: '',
    inSidebar: false,
    inSearch: true,
  },
  WEBHOOK_CREATE: {
    id: 'WEBHOOK_CREATE',
    moduleName: MODULES_NAMES.WEBHOOKS,
    icon: Webhook,
    to: `/${organizationId}/${stackId}/settings/webhooks/create?region=${region}`,
    title: 'Create Webhook',
    description: 'Create a new webhook to receive real-time notifications',
    inSidebar: false,
    inSearch: true,
  },
  WEBHOOK_DETAIL: {
    id: 'WEBHOOK_DETAIL',
    moduleName: MODULES_NAMES.WEBHOOKS,
    icon: Webhook,
    to: `/${organizationId}/${stackId}/settings/webhooks/${webhookId}?region=${region}`,
    title: 'Webhook',
    description: '',
    inSidebar: false,
    params: ['webhookId'],
  },

  // ------------------------------
  // BANKING BRIDGE
  // ------------------------------
  BANKING_BRIDGE_OVERVIEW: {
    id: 'BANKING_BRIDGE_OVERVIEW',
    moduleName: MODULES_NAMES.BANKING_BRIDGE,
    icon: Home,
    to: `/${organizationId}/${stackId}/banking-bridge?region=${region}`,
    title: 'Overview',
    description:
      'Banking Bridge allows you to connect with external banking providers throught EBICS protocol or Open Banking services.',
    inSidebar: true,
  },
  BANKING_BRIDGE_BROWSE: {
    id: 'BANKING_BRIDGE_BROWSE',
    moduleName: MODULES_NAMES.BANKING_BRIDGE,
    icon: Cable,
    to: `/${organizationId}/${stackId}/banking-bridge/browse?region=${region}`,
    title: 'Browse Banks',
    description: '',
    inSidebar: true,
  },
});

export const GLOBAL_SIDEBAR_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(([_, route]) => route.moduleName === undefined && route.inSidebar)
    .map(([_, route]) => route);
};

export const GLOBAL_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(([_, route]) => route.moduleName === undefined && route.inSearch)
    .map(([_, route]) => route);
};

export const LEDGER_SIDEBAR_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.LEDGER && route.inSidebar
    )
    .map(([_, route]) => route);
};

export const LEDGER_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.LEDGER && route.inSearch
    )
    .map(([_, route]) => route);
};

export const CONNECTIVITY_SIDEBAR_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.CONNECTIVITY && route.inSidebar
    )
    .map(([_, route]) => route);
};

export const CONNECTIVITY_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.CONNECTIVITY && route.inSearch
    )
    .map(([_, route]) => route);
};

export const WALLETS_SIDEBAR_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.WALLETS && route.inSidebar
    )
    .map(([_, route]) => route);
};

export const WALLETS_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.WALLETS && route.inSearch
    )
    .map(([_, route]) => route);
};

export const FLOWS_SIDEBAR_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.FLOWS && route.inSidebar
    )
    .map(([_, route]) => route);
};

export const FLOWS_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) => route.moduleName === MODULES_NAMES.FLOWS && route.inSearch
    )
    .map(([_, route]) => route);
};

export const RECONCILIATION_SIDEBAR_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.RECONCILIATION && route.inSidebar
    )
    .map(([_, route]) => route);
};

export const RECONCILIATION_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.RECONCILIATION && route.inSearch
    )
    .map(([_, route]) => route);
};

export const AUTH_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) => route.moduleName === MODULES_NAMES.AUTH && route.inSearch
    )
    .map(([_, route]) => route);
};

export const WEBHOOKS_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.WEBHOOKS && route.inSearch
    )
    .map(([_, route]) => route);
};

export const BANKING_BRIDGE_SIDEBAR_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.BANKING_BRIDGE && route.inSidebar
    )
    .map(([_, route]) => route);
};

export const BANKING_BRIDGE_SEARCH_ROUTES = (
  organizationId: string,
  stackId: string,
  region: string
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === MODULES_NAMES.BANKING_BRIDGE && route.inSearch
    )
    .map(([_, route]) => route);
};

export const ROUTES_WITH_PARAMS = (
  organizationId: string,
  stackId: string,
  region: string,
  moduleName: TModuleName
) => {
  const routes = ROUTES({ organizationId, stackId, region });

  const module = getModule(moduleName);

  return Object.entries(routes)
    .filter(
      ([_, route]) =>
        route.moduleName === module?.name &&
        route.params &&
        route.inSidebar === false
    )
    .map(([_, route]) => route);
};
