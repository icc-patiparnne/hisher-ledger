export type TCodeProps = {
  language: 'typescript' | 'yaml' | 'json' | 'bash' | 'plaintext';
  showLineNumbers: boolean;
  code: string;
};

export type TSnippet = {
  title: string;
  snippet: Pick<TCodeProps, 'language' | 'showLineNumbers' | 'code'>;
  version?: string;
  module?: string;
};

export type TSnippetKeys =
  | 'CLOUD_REGIONS_CREATE'
  | 'CLOUD_REGIONS_DELETE'
  | 'CLOUD_REGIONS_LIST'
  | 'CLOUD_REGIONS_SHOW'
  | 'CLOUD_ORGANIZATION_LIST'
  | 'CLOUD_ORGANIZATION_HISTORY'
  | 'CLOUD_ORGANIZATION_CREATE'
  | 'CLOUD_ORGANIZATION_DELETE'
  | 'CLOUD_ORGANIZATION_DESCRIBE'
  | 'CLOUD_ORGANIZATION_LOGS'
  | 'CLOUD_ORGANIZATION_CLIENT_CREATE'
  | 'CLOUD_ORGANIZATION_CLIENT_DELETE'
  | 'CLOUD_ORGANIZATION_CLIENT_LIST'
  | 'CLOUD_ORGANIZATION_CLIENT_SHOW'
  | 'CLOUD_ORGANIZATION_CLIENT_UPDATE'
  | 'CLOUD_ORGANIZATION_USERS_LIST'
  | 'CLOUD_ORGANIZATION_USERS_SHOW'

  // Stacks
  | 'STACK_LIST'
  | 'STACK_CREATE'
  | 'STACK_DELETE'
  | 'STACK_ENABLE'
  | 'STACK_DISABLE'
  | 'STACK_SHOW'
  | 'STACK_UPDATE'
  | 'STACK_UPGRADE'
  | 'STACK_LOGS'
  | 'STACK_USERS_LIST'
  | 'STACK_MODULES_LIST'
  | 'STACK_MODULES_ENABLE'
  | 'STACK_MODULES_DISABLE'
  | 'AUTH_ENABLE'
  | 'AUTH_DISABLE'
  | 'OAUTH_CLIENTS_LIST'
  | 'OAUTH_CLIENTS_SHOW'
  | 'OAUTH_CLIENTS_CREATE'
  | 'OAUTH_CLIENTS_SECRETS_CREATE'
  | 'OAUTH_CLIENTS_SECRETS_DELETE'
  | 'WEBHOOKS_ENABLE'
  | 'WEBHOOKS_DISABLE'
  | 'WEBHOOKS_LIST'
  | 'WEBHOOKS_SHOW'
  | 'WEBHOOKS_CREATE'
  | 'CONNECTORS_LIST'
  | 'CONNECTORS_SHOW'
  | 'CONNECTOR_INSTALL'
  | 'CONNECTOR_UNINSTALL'
  | 'LEDGER_ENABLE'
  | 'LEDGER_DISABLE'
  | 'LEDGER_LIST'
  | 'LEDGER_IMPORT'
  | 'LEDGER_EXPORT'
  | 'LEDGER_CREATE'
  | 'LEDGER_SET_METADATA'
  | 'LEDGER_DELETE_METADATA'
  | 'LEDGER_SERVER_INFOS'
  | 'LEDGER_TRANSACTIONS_LIST'
  | 'LEDGER_TRANSACTIONS_SHOW'
  | 'LEDGER_TRANSACTIONS_LIST_BY_LEDGER'
  | 'LEDGER_ACCOUNTS_LIST'
  | 'LEDGER_ACCOUNT_SHOW'
  | 'LEDGER_ACCOUNTS_LIST_BY_LEDGER'
  | 'LEDGER_VOLUMES_LIST'
  | 'LEDGER_STATS'
  | 'CONNECTIVITY_ENABLE'
  | 'CONNECTIVITY_DISABLE'
  | 'CONNECTIVITY_ACCOUNTS_LIST'
  | 'CONNECTIVITY_ACCOUNT_DETAIL'
  | 'CONNECTIVITY_PAYMENTS_LIST'
  | 'CONNECTIVITY_PAYMENT_DETAIL'
  | 'CONNECTIVITY_CASH_POOLS_LIST'
  | 'CONNECTIVITY_CASH_POOLS_CREATE'
  | 'CONNECTIVITY_CASH_POOL_DETAIL'
  | 'CONNECTIVITY_TRANSFERS_LIST'
  | 'CONNECTIVITY_TRANSFERS_CREATE'
  | 'CONNECTIVITY_TRANSFER_DETAIL'
  | 'CONNECTIVITY_TRANSFER_UPDATE_STATUS'
  | 'CONNECTIVITY_TRANSFER_RETRY'
  | 'CONNECTIVITY_TRANSFER_REVERSE'
  | 'CONNECTIVITY_BANK_ACCOUNTS_LIST'
  | 'CONNECTIVITY_BANK_ACCOUNT_DETAIL'
  | 'CONNECTIVITY_BANK_ACCOUNTS_CREATE'
  | 'WALLETS_ENABLE'
  | 'WALLETS_DISABLE'
  | 'WALLET_LIST'
  | 'WALLET_CREATE'
  | 'WALLET_DETAIL'
  | 'WALLET_UPDATE'
  | 'WALLET_TRANSACTIONS'
  | 'WALLET_BALANCES'
  | 'WALLET_CREATE_BALANCE'
  | 'WALLET_CREDIT_BALANCE'
  | 'WALLET_DEBIT_BALANCE'
  | 'WALLET_HOLDS_LIST'
  | 'WALLET_HOLDS_SHOW'
  | 'WALLET_HOLDS_CREATE'
  | 'WALLET_HOLDS_CONFIRM'
  | 'WALLET_HOLDS_CANCEL'
  | 'RECONCILIATION_ENABLE'
  | 'RECONCILIATION_DISABLE'
  | 'RECONCILIATION_REPORTS_LIST'
  | 'RECONCILIATION_REPORT_SHOW'
  | 'RECONCILIATION_REPORT_DELETE'
  | 'RECONCILIATION_POLICIES_LIST'
  | 'RECONCILIATION_POLICY_SHOW'
  | 'RECONCILIATION_POLICY_DELETE'
  | 'RECONCILIATION_POLICY_CREATE'
  | 'RECONCILIATION_POLICY_RECONCILE'
  | 'FLOWS_ENABLE'
  | 'FLOWS_DISABLE'
  | 'FLOWS_WORKFLOWS_LIST'
  | 'FLOWS_WORKFLOW_SHOW'
  | 'FLOWS_WORKFLOW_DELETE'
  | 'FLOWS_WORKFLOW_CREATE'
  | 'FLOWS_WORKFLOW_RUN'
  | 'FLOWS_INSTANCES_LIST'
  | 'FLOWS_INSTANCE_SHOW'
  | 'FLOWS_INSTANCE_STOP'
  | 'FLOWS_INSTANCE_DESCRIBE'
  | 'FLOWS_INSTANCE_SEND_EVENT'
  | 'FLOWS_TRIGGERS_LIST'
  | 'FLOWS_TRIGGER_SHOW'
  | 'FLOWS_TRIGGER_DELETE'
  | 'FLOWS_TRIGGER_CREATE'
  | 'FLOWS_TRIGGER_TEST'
  | 'FLOWS_TRIGGER_OCCURRENCES_LIST'
  | 'STARGATE_ENABLE'
  | 'STARGATE_DISABLE'
  | 'GATEWAY_ENABLE'
  | 'GATEWAY_DISABLE';

const FCTL_LANGUAGE: TCodeProps['language'] = 'bash';

export type TSnippetParams = {
  organizationId?: string;
  stackId?: string;

  // Portal
  userId?: string;
  regionId?: string;

  // Console
  ledgerName?: string;
  transactionId?: string;
  address?: string;
  clientId?: string;
  paymentId?: string;
  paymentAccountId?: string;
  paymentCashPoolId?: string;
  paymentTransferId?: string;
  paymentBankAccountId?: string;
  connectorId?: string;
  connectorSlug?: string;
  walletId?: string;
  walletHoldId?: string;
  reportId?: string;
  policyId?: string;
  workflowId?: string;
  instanceId?: string;
  triggerId?: string;
  moduleName?: string;
};

export const FCTL_SNIPPETS = ({
  organizationId,
  stackId,
  userId,
  regionId,
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
  moduleName,
}: TSnippetParams): Record<TSnippetKeys, TSnippet> => ({
  // --------------------
  // PORTAL
  // ---------------
  CLOUD_REGIONS_CREATE: {
    title: 'Create a region',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud regions create <region-name> --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_REGIONS_DELETE: {
    title: 'Delete a region',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud regions delete ${
        regionId ?? '<region-id>'
      } --organization ${organizationId ?? '<organization-id>'}`,
    },
  },
  CLOUD_REGIONS_LIST: {
    title: 'List all regions',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud regions list --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_REGIONS_SHOW: {
    title: 'Show a region',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud regions show ${
        regionId ?? '<region-id>'
      } --organization ${organizationId ?? '<organization-id>'}`,
    },
  },
  CLOUD_ORGANIZATION_LIST: {
    title: 'List all organizations',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization list`,
    },
  },
  CLOUD_ORGANIZATION_HISTORY: {
    title: 'List all organization history',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization history ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_ORGANIZATION_CREATE: {
    title: 'Create an organization',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization create <organization-name>`,
    },
  },
  CLOUD_ORGANIZATION_DELETE: {
    title: 'Delete an organization',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization delete ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_ORGANIZATION_DESCRIBE: {
    title: 'Describe an organization',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization describe ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_ORGANIZATION_LOGS: {
    title: 'List all organization logs',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organizations history ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_ORGANIZATION_USERS_LIST: {
    title: 'List all users',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization users list --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_ORGANIZATION_USERS_SHOW: {
    title: 'Show a user',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization users show ${
        userId ?? '<user-id>'
      } --organization ${organizationId ?? '<organization-id>'} `,
    },
  },
  CLOUD_ORGANIZATION_CLIENT_CREATE: {
    title: 'Create a client',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization oauth-clients create <client-name> --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_ORGANIZATION_CLIENT_DELETE: {
    title: 'Delete a client',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization oauth-clients delete ${
        clientId ?? '<client-id>'
      } --organization ${organizationId ?? '<organization-id>'}`,
    },
  },
  CLOUD_ORGANIZATION_CLIENT_LIST: {
    title: 'List all clients',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization oauth-clients list --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  CLOUD_ORGANIZATION_CLIENT_SHOW: {
    title: 'Show a client',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization oauth-clients show ${
        clientId ?? '<client-id>'
      } --organization ${organizationId ?? '<organization-id>'}`,
    },
  },
  CLOUD_ORGANIZATION_CLIENT_UPDATE: {
    title: 'Update a client',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl cloud organization oauth-clients update ${
        clientId ?? '<client-id>'
      } --name '<new-name>' --description '<new-description>' --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  STACK_LIST: {
    title: 'List all stacks',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack list --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
    module: 'STACK',
  },
  STACK_CREATE: {
    title: 'Create a stack',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack create <stack-name> --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
    module: 'STACK',
  },
  STACK_DELETE: {
    title: 'Delete a stack',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack delete ${stackId ?? '<stack-id>'} --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  STACK_ENABLE: {
    title: 'Enable a stack',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack enable ${stackId ?? '<stack-id>'} --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  STACK_DISABLE: {
    title: 'Disable a stack',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack disable ${stackId ?? '<stack-id>'} --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  STACK_SHOW: {
    title: 'Show a stack',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack show ${stackId ?? '<stack-id>'} --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  STACK_UPDATE: {
    title: 'Update a stack',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack update ${stackId ?? '<stack-id>'} --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  STACK_LOGS: {
    title: 'List all stack logs',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack history ${stackId ?? '<stack-id>'} --organization ${
        organizationId ?? '<organization-id>'
      }`,
    },
  },
  STACK_UPGRADE: {
    title: 'Upgrade a stack',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack upgrade ${
        stackId ?? '<stack-id>'
      } <version> --organization ${organizationId ?? '<organization-id>'}`,
    },
  },
  STACK_USERS_LIST: {
    title: 'List all stack users',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack users list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
  },
  STACK_MODULES_LIST: {
    title: 'List all stack modules',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack modules list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
  },
  STACK_MODULES_ENABLE: {
    title: 'Enable a stack module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable ${
        moduleName ?? '<module-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
  },
  STACK_MODULES_DISABLE: {
    title: 'Disable a stack module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable ${
        moduleName ?? '<module-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
  },

  // --------------------
  // CONSOLE
  // ---------------
  // Auth
  AUTH_ENABLE: {
    title: 'Enable auth module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable auth --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'AUTH',
  },
  AUTH_DISABLE: {
    title: 'Disable auth module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable auth --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'AUTH',
  },
  OAUTH_CLIENTS_LIST: {
    title: 'List all OAuth clients',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl auth clients list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'AUTH',
  },
  OAUTH_CLIENTS_SHOW: {
    title: 'Show an OAuth client',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl auth clients show ${
        clientId ?? '<client-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'AUTH',
  },
  OAUTH_CLIENTS_CREATE: {
    title: 'Create an OAuth client',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl auth clients create <client-name> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'AUTH',
  },
  OAUTH_CLIENTS_SECRETS_CREATE: {
    title: 'Create a new OAuth client secret',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl auth clients secrets create <client-id> <secret-name> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'AUTH',
  },
  OAUTH_CLIENTS_SECRETS_DELETE: {
    title: 'Delete an OAuth client secret',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl auth clients secrets delete ${
        clientId ?? '<client-id>'
      } <secret-name> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'AUTH',
  },

  // Webhook
  WEBHOOKS_ENABLE: {
    title: 'Enable webhooks',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable webhooks --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WEBHOOKS',
  },
  WEBHOOKS_DISABLE: {
    title: 'Disable webhooks',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable webhooks --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WEBHOOKS',
  },
  WEBHOOKS_LIST: {
    title: 'List all webhooks',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl webhooks list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WEBHOOKS',
  },
  WEBHOOKS_SHOW: {
    title: 'Show a Webhook',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl webhooks show ${clientId ?? '<client-id>'} --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WEBHOOKS',
  },
  WEBHOOKS_CREATE: {
    title: 'Create a webhook',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl webhooks create <endpoint> [<eventType>...]--organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WEBHOOKS',
  },

  // Ledger
  LEDGER_ENABLE: {
    title: 'Enable ledger module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable ledger --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'LEDGER',
  },
  LEDGER_DISABLE: {
    title: 'Disable ledger module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable ledger --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'LEDGER',
  },
  LEDGER_SERVER_INFOS: {
    title: 'Server Information',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger server-infos --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'LEDGER',
  },
  LEDGER_LIST: {
    title: 'List all ledgers',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    version: '2',
    module: 'LEDGER',
  },
  LEDGER_IMPORT: {
    title: 'Import a ledger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger import ${
        ledgerName ?? '<ledger-name>'
      } <file-path> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'LEDGER',
  },
  LEDGER_EXPORT: {
    title: 'Export a ledger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger export --file <file> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'LEDGER',
  },
  LEDGER_CREATE: {
    title: 'Create a ledger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger create --name ${
        ledgerName ?? '<ledger-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    version: '2',
    module: 'LEDGER',
  },
  LEDGER_SET_METADATA: {
    title: 'Set ledger metadata',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger set-metadata ${
        ledgerName ?? '<ledger-name>'
      } [<key>=<value>...] --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    version: '2',
    module: 'LEDGER',
  },
  LEDGER_DELETE_METADATA: {
    title: 'Delete ledger metadata',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger delete-metadata ${
        ledgerName ?? '<ledger-name>'
      } [<key>=<value>...] --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    version: '2',
    module: 'LEDGER',
  },
  LEDGER_TRANSACTIONS_LIST: {
    title: 'List all transactions',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger transactions list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'LEDGER',
  },
  LEDGER_TRANSACTIONS_LIST_BY_LEDGER: {
    title: "List all ledger's transactions",
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger transactions list --ledger ${
        ledgerName ?? '<ledger-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'LEDGER',
  },
  LEDGER_TRANSACTIONS_SHOW: {
    title: 'Show a single transaction',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `
  fctl ledger transactions show ${
    transactionId ?? '<transaction-id>'
  } --ledger ${ledgerName ?? '<ledger-name>'} --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}
  `,
    },
    module: 'LEDGER',
  },
  LEDGER_ACCOUNTS_LIST: {
    title: 'List all accounts',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger accounts list --ledger ${
        ledgerName ?? '<ledger-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'LEDGER',
  },
  LEDGER_ACCOUNTS_LIST_BY_LEDGER: {
    title: "List all ledger's accounts",
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger accounts list --ledger ${
        ledgerName ?? '<ledger-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'LEDGER',
  },
  LEDGER_ACCOUNT_SHOW: {
    title: 'Show an account',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `
      fctl ledger accounts show ${address ?? '<account-name>'} --ledger ${
        ledgerName ?? '<ledger-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }
      `,
    },
    module: 'LEDGER',
  },
  LEDGER_VOLUMES_LIST: {
    title: 'List of volumes and balances for account/asset',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger volume list --start-time '<start-time>' --ledger ${
        ledgerName ?? '<ledger-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'LEDGER',
  },

  LEDGER_STATS: {
    title: 'Get ledger stats',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl ledger stats --ledger ${
        ledgerName ?? '<ledger-name>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'LEDGER',
  },

  // Connectivity
  CONNECTIVITY_ENABLE: {
    title: 'Enable connectivity module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable payments --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_DISABLE: {
    title: 'Disable connectivity module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable payments --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_PAYMENTS_LIST: {
    title: 'List all payments',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments payments list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_PAYMENT_DETAIL: {
    title: 'Show a payment',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments payments get ${
        paymentId ?? '<payment-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_ACCOUNTS_LIST: {
    title: 'List all accounts',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments accounts list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_ACCOUNT_DETAIL: {
    title: 'Show an account',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments accounts get ${
        paymentAccountId ?? '<account-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_CASH_POOLS_LIST: {
    title: 'List all cash pools',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments pools list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_CASH_POOLS_CREATE: {
    title: 'Create a cash pool',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments pools create pool.json --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_CASH_POOL_DETAIL: {
    title: 'Show a cash pool',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments pools get ${
        paymentCashPoolId ?? '<cash-pool-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_TRANSFERS_LIST: {
    title: 'List all transfers',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments transfer_initiation list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_TRANSFERS_CREATE: {
    title: 'Create a transfer',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments transfer_initiation create transfer.json --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_TRANSFER_DETAIL: {
    title: 'Show a transfer',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments transfer_initiation get ${
        paymentTransferId ?? '<transfer-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_TRANSFER_UPDATE_STATUS: {
    title: 'Update a transfer status',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments transfer_initiation update_status ${
        paymentTransferId ?? '<transfer-id>'
      } <status> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_TRANSFER_RETRY: {
    title: 'Retry a transfer',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments transfer_initiation retry ${
        paymentTransferId ?? '<transfer-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_TRANSFER_REVERSE: {
    title: 'Reverse a transfer',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments transfer_initiation reverse ${
        paymentTransferId ?? '<transfer-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_BANK_ACCOUNTS_LIST: {
    title: 'List all bank accounts',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments bank_accounts list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_BANK_ACCOUNT_DETAIL: {
    title: 'Show a bank account',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments bank_accounts get ${
        paymentBankAccountId ?? '<bank-account-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTIVITY',
  },
  CONNECTIVITY_BANK_ACCOUNTS_CREATE: {
    title: 'Create a bank account',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments bank_accounts create config.json --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTIVITY',
  },

  // Wallets
  WALLETS_ENABLE: {
    title: 'Enable wallets module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable wallets --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLETS_DISABLE: {
    title: 'Disable wallets module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable wallets --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_LIST: {
    title: 'List all wallets',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_CREATE: {
    title: 'Create a wallet',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets create <wallet-name> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_DETAIL: {
    title: 'Show a wallet',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets show --id ${
        walletId ?? '<wallet-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'WALLETS',
  },
  WALLET_UPDATE: {
    title: 'Update a wallet',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets update ${
        walletId ?? '<wallet-id>'
      } --metadata "key=value,key2=value2" --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_BALANCES: {
    title: 'Show wallet balances',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets balances list --id ${
        walletId ?? '<wallet-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'WALLETS',
  },
  WALLET_TRANSACTIONS: {
    title: 'Show wallet transactions',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets transactions list --id ${
        walletId ?? '<wallet-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'WALLETS',
  },
  WALLET_CREATE_BALANCE: {
    title: 'Create a wallet balance',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets balances create <balance-name> --id ${
        walletId ?? '<wallet-id>'
      } --expires-at ${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString()} --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_CREDIT_BALANCE: {
    title: 'Credit wallet balance',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets credit 10 USD/2 --id ${
        walletId ?? '<wallet-id>'
      } --balance <balance-name> --source account=world --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_DEBIT_BALANCE: {
    title: 'Debit wallet balance',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets debit 10 USD/2 --id ${
        walletId ?? '<wallet-id>'
      } --balance <balance-name> --destination account=world --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_HOLDS_LIST: {
    title: 'List all wallet holds',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets holds list --id ${
        walletId ?? '<wallet-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'WALLETS',
  },
  WALLET_HOLDS_SHOW: {
    title: 'Show a wallet hold',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets holds show ${
        walletHoldId ?? '<wallet-hold-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'WALLETS',
  },
  WALLET_HOLDS_CREATE: {
    title: 'Create a wallet hold',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets debit 10 USD/2 --pending --id ${
        walletId ?? '<wallet-id>'
      } --balance <balance-name> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_HOLDS_CONFIRM: {
    title: 'Confirm a wallet hold',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets holds confirm ${
        walletHoldId ?? '<wallet-hold-id>'
      } --amount 10 --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'WALLETS',
  },
  WALLET_HOLDS_CANCEL: {
    title: 'Cancel a wallet hold',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl wallets holds void ${
        walletHoldId ?? '<wallet-hold-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'WALLETS',
  },

  // Connectors
  CONNECTORS_LIST: {
    title: 'List all Connectors',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments connectors list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTORS',
  },
  CONNECTORS_SHOW: {
    title: 'Show a Connector',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments connectors get-config --connector-id ${
        connectorId ?? '<connector-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'CONNECTORS',
  },
  CONNECTOR_INSTALL: {
    title: 'Install a Connector',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments connectors install ${
        connectorSlug ?? '<connector-slug>'
      } config.json --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTORS',
  },
  CONNECTOR_UNINSTALL: {
    title: 'Uninstall a Connector',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl payments connectors uninstall --connector-id ${
        connectorId ?? '<connector-id>'
      } --provider <provider> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'CONNECTORS',
  },

  // Reconciliation
  RECONCILIATION_ENABLE: {
    title: 'Enable reconciliation module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable reconciliation --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_DISABLE: {
    title: 'Disable reconciliation module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable reconciliation --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_REPORTS_LIST: {
    title: 'List all reconciliation report',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_REPORT_SHOW: {
    title: 'Show a Report',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation get ${
        reportId ?? '<report-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_REPORT_DELETE: {
    title: 'Delete a Report',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation delete ${
        reportId ?? '<report-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_POLICIES_LIST: {
    title: 'List all reconciliation policies',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation policies list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_POLICY_SHOW: {
    title: 'Show a Policy',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation policies get ${
        policyId ?? '<policy-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_POLICY_DELETE: {
    title: 'Delete a Policy',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation policies delete ${
        policyId ?? '<policy-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_POLICY_RECONCILE: {
    title: 'Reconcile a Policy',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation policies reconcile ${
        policyId ?? '<policy-id>'
      } <at-ledger> <at-payment> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'RECONCILIATION',
  },
  RECONCILIATION_POLICY_CREATE: {
    title: 'Create a policy',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl reconciliation policies create policy.json --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'RECONCILIATION',
  },

  // Flows
  FLOWS_ENABLE: {
    title: 'Enable flows module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable orchestration --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_DISABLE: {
    title: 'Disable flows module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable orchestration --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_WORKFLOWS_LIST: {
    title: 'List all workflows',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration workflows list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_WORKFLOW_SHOW: {
    title: 'Show a Workflow',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration workflows show ${
        workflowId ?? '<workflow-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_WORKFLOW_DELETE: {
    title: 'Delete a Workflow',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration workflows delete ${
        workflowId ?? '<workflow-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_WORKFLOW_CREATE: {
    title: 'Create a Workflow',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration workflows create workflow.yaml --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_WORKFLOW_RUN: {
    title: 'Run a Workflow',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration workflows run ${
        workflowId ?? '<workflow-id>'
      }  --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_INSTANCES_LIST: {
    title: 'List all instances',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration instances list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_INSTANCE_SHOW: {
    title: 'Show an Instance',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration instances show ${
        instanceId ?? '<instance-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_INSTANCE_STOP: {
    title: 'Stop an Instance',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration instances stop ${
        instanceId ?? '<instance-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_INSTANCE_DESCRIBE: {
    title: 'Describe an Instance',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration instances describe ${
        instanceId ?? '<instance-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_INSTANCE_SEND_EVENT: {
    title: 'Send an event to an Instance',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration instances send-event ${
        instanceId ?? '<instance-id>'
      } '<event>' --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_TRIGGERS_LIST: {
    title: 'List all triggers',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration triggers list --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_TRIGGER_SHOW: {
    title: 'Show a Trigger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration triggers show ${
        triggerId ?? '<trigger-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_TRIGGER_DELETE: {
    title: 'Delete a Trigger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration triggers delete ${
        triggerId ?? '<trigger-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_TRIGGER_CREATE: {
    title: 'Create a Trigger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration triggers create <event> ${
        workflowId ?? '<workflow-id>'
      } --organization ${organizationId ?? '<organization-id>'} --stack ${
        stackId ?? '<stack-id>'
      }`,
    },
    module: 'FLOWS',
  },
  FLOWS_TRIGGER_TEST: {
    title: 'Test a Trigger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration triggers test ${
        triggerId ?? '<trigger-id>'
      } <event> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },
  FLOWS_TRIGGER_OCCURRENCES_LIST: {
    title: 'Show all occurrences of a trigger',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl orchestration triggers occurrences ${
        triggerId ?? '<trigger-id>'
      } <event> --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'FLOWS',
  },

  // Stargate
  STARGATE_ENABLE: {
    title: 'Enable stargate module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable stargate --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'STARGATE',
  },
  STARGATE_DISABLE: {
    title: 'Disable stargate module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable stargate --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'STARGATE',
  },
  // Gateway
  GATEWAY_ENABLE: {
    title: 'Enable gateway module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module enable gateway --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'GATEWAY',
  },
  GATEWAY_DISABLE: {
    title: 'Disable gateway module',
    snippet: {
      language: FCTL_LANGUAGE,
      showLineNumbers: false,
      code: `fctl stack module disable gateway --organization ${
        organizationId ?? '<organization-id>'
      } --stack ${stackId ?? '<stack-id>'}`,
    },
    module: 'GATEWAY',
  },
});
