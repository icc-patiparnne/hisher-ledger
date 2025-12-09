import { MODULES_NAMES, TModuleName } from './modules';

export const EXTERNAL_LINKS = {
  WEBSITE: {
    to: 'https://www.formance.com?ref=console',
    target: '_blank',
  },
  WEBSITE_BLOG: {
    to: 'https://www.formance.com/blog?ref=console',
    target: '_blank',
  },
  WEBSITE_CONTACT_US: {
    to: 'https://www.formance.com/contact?ref=console',
    target: '_blank',
  },

  STATUS: {
    to: 'https://status.formance.com/',
    target: '_blank',
  },

  COMMUNITY_HELP: {
    to: 'https://github.com/orgs/formancehq/discussions',
    target: '_blank',
  },

  NUMSCRIPT_PLAYGROUND: {
    to: 'https://playground.numscript.org',
    target: '_blank',
  },

  DOCUMENTATION: {
    to: 'https://docs.formance.com',
    target: '_blank',
  },
  DOCUMENTATION_INSTALL_FCTL: {
    to: 'https://docs.formance.com/get-started/fctl-quick-start#installing-fctl',
    target: '_blank',
  },
  DOCUMENTATION_FILTERING_SYNTAX: {
    to: 'https://docs.formance.com/modules/ledger/working-with-the-ledger/filtering-queries#filtering-syntax',
    target: '_blank',
  },
  DOCUMENTATION_API: {
    to: 'https://docs.formance.com/api-reference/introduction',
    target: '_blank',
  },
  DOCUMENTATION_NUMSCRIPT: {
    to: 'https://docs.formance.com/modules/numscript',
    target: '_blank',
  },
  DOCUMENTATION_CONNECTIVITY_CAPABILITIES: {
    to: 'https://docs.formance.com/modules/connectivity/capabilities#supported-processors',
    target: '_blank',
  },
  OPEN_API_SPEC: {
    to: 'https://github.com/formancehq/docs/tree/main/openapi',
    target: '_blank',
  },
  TERMS_OF_SERVICE: {
    to: 'https://www.formance.com/terms-of-service',
    target: '_blank',
  },
  PRIVACY_POLICY: {
    to: 'https://www.formance.com/privacy-policy',
    target: '_blank',
  },
  GITHUB_APPS_LIBRARY: {
    to: 'https://github.com/formancehq/apps-library',
    target: '_blank',
  },
};

const LEDGERS_LINKS = {
  GITHUB_REPO: {
    to: 'https://github.com/formancehq/ledger',
    target: '_blank',
  },
  GITHUB_REPO_RELEASES: {
    to: 'https://github.com/formancehq/ledger/releases',
    target: '_blank',
  },
  OVERVIEW_DOCUMENTATION_LINKS: [
    {
      LABEL: 'Getting Started',
      LINK: 'https://docs.formance.com/modules/ledger/introduction#getting-started',
    },
    {
      LABEL: 'Accounts',
      LINK: 'https://docs.formance.com/modules/ledger/accounting-model/accounts',
    },
    {
      LABEL: 'Transactions',
      LINK: 'https://docs.formance.com/modules/ledger/accounting-model/transactions',
    },
    {
      LABEL: 'The source and destination accounting models',
      LINK: 'https://docs.formance.com/modules/ledger/accounting-model/source-destination-accounting-model',
    },
  ],
  OVERVIEW_BLOG_POST_LINKS: [
    {
      LABEL: 'How not to build a ledger',
      LINK: 'https://www.formance.com/blog/engineering/how-not-to-build-a-ledger',
    },
    {
      LABEL: 'Announcing Ledger v2',
      LINK: 'https://www.formance.com/blog/product/announcing-formance-ledger-v2',
    },
  ],
};

const CONNECTIVITY_LINKS = {
  GITHUB_REPO: {
    to: 'https://github.com/formancehq/payments',
    target: '_blank',
  },
  GITHUB_REPO_RELEASES: {
    to: 'https://github.com/formancehq/payments/releases',
    target: '_blank',
  },
  OVERVIEW_DOCUMENTATION_LINKS: [
    {
      LABEL: 'Getting Started',
      LINK: 'https://docs.formance.com/modules/connectivity/introduction#getting-started',
    },
    {
      LABEL: 'Account concept',
      LINK: 'https://docs.formance.com/modules/connectivity/concepts/accounts',
    },
    {
      LABEL: 'Payments concept',
      LINK: 'https://docs.formance.com/modules/connectivity/concepts/payments',
    },
    {
      LABEL: 'Connectors capabilities',
      LINK: 'https://docs.formance.com/modules/connectivity/capabilities',
    },
    {
      LABEL: 'Build a connector',
      LINK: 'https://docs.formance.com/modules/connectivity/build-a-connector',
    },
  ],
};

const WALLETS_LINKS = {
  GITHUB_REPO: {
    to: 'https://github.com/formancehq/wallets',
    target: '_blank',
  },
  GITHUB_REPO_RELEASES: {
    to: 'https://github.com/formancehq/wallets/releases',
    target: '_blank',
  },
  OVERVIEW_DOCUMENTATION_LINKS: [
    {
      LABEL: 'Getting Started',
      LINK: 'https://docs.formance.com/modules/wallets/introduction',
    },
    {
      LABEL: 'Using Wallets vs Ledger',
      LINK: 'https://docs.formance.com/modules/wallets/introduction#using-wallets-vs-ledger',
    },
    {
      LABEL: 'Choosing a Wallet strategy',
      LINK: 'https://docs.formance.com/modules/wallets/creating-wallets#choosing-a-wallet-strategy',
    },
    {
      LABEL: 'Adding funds to a wallet',
      LINK: 'https://docs.formance.com/modules/wallets/managing-funds/adding-funds',
    },
  ],
};

const FLOWS_LINKS = {
  GITHUB_REPO: {
    to: 'https://github.com/formancehq/flows',
    target: '_blank',
  },
  GITHUB_REPO_RELEASES: {
    to: 'https://github.com/formancehq/flows/releases',
    target: '_blank',
  },
  OVERVIEW_DOCUMENTATION_LINKS: [
    {
      LABEL: 'Flows Introduction',
      LINK: 'https://docs.formance.com/modules/flows/introduction',
    },
    {
      LABEL: 'Workflows definition',
      LINK: 'https://docs.formance.com/modules/flows/workflows-definition',
    },
    {
      LABEL: 'Workflows execution',
      LINK: 'https://docs.formance.com/modules/flows/workflows-execution',
    },
    {
      LABEL: 'Example: Ledger to Ledger',
      LINK: 'https://docs.formance.com/modules/flows/examples/ledger-to-ledger',
    },
    {
      LABEL: 'Example: Payment to Wallet',
      LINK: 'https://docs.formance.com/modules/flows/examples/payment-to-wallet',
    },
    {
      LABEL: 'Example: Ledger to Payout',
      LINK: 'https://docs.formance.com/modules/flows/examples/ledger-to-payout',
    },
  ],
};

const RECONCILIATION_LINKS = {
  GITHUB_REPO: {
    to: 'https://github.com/formancehq/reconciliation',
    target: '_blank',
  },
  GITHUB_REPO_RELEASES: {
    to: 'https://github.com/formancehq/reconciliation/releases',
    target: '_blank',
  },
  OVERVIEW_DOCUMENTATION_LINKS: [
    {
      LABEL: 'Reconciliation Introduction',
      LINK: 'https://docs.formance.com/modules/reconciliation/introduction',
    },
    {
      LABEL: 'What is reconciliation?',
      LINK: 'https://docs.formance.com/modules/reconciliation/explanations/what-is-reconciliation',
    },
  ],
};

const WEBHOOKS_LINKS = {
  GITHUB_REPO: {
    to: 'https://github.com/formancehq/webhooks',
    target: '_blank',
  },
  GITHUB_REPO_RELEASES: {
    to: 'https://github.com/formancehq/webhooks/releases',
    target: '_blank',
  },
  OVERVIEW_DOCUMENTATION_LINKS: [
    {
      LABEL: 'Creating a webhook',
      LINK: 'https://docs.formance.com/build/platform/events/webhooks#creating-a-webhook',
    },
    {
      LABEL: 'Webhook Signature',
      LINK: 'https://docs.formance.com/build/platform/events/webhooks#webhook-signature',
    },
    {
      LABEL: 'Webhook metrics',
      LINK: 'https://docs.formance.com/build/platform/observability/metrics',
    },
  ],
};

const GATEWAY_LINKS = {
  OVERVIEW_DOCUMENTATION_LINKS: [
    {
      LABEL: 'Gateway Introduction',
      LINK: 'https://docs.formance.com/build/deployment/operator/modules/gateway',
    },
  ],
};

const STARGATE_LINKS = {};

export const MODULES_LINKS: Record<TModuleName, any> = {
  [MODULES_NAMES.LEDGER]: LEDGERS_LINKS,
  [MODULES_NAMES.CONNECTIVITY]: CONNECTIVITY_LINKS,
  [MODULES_NAMES.WALLETS]: WALLETS_LINKS,
  [MODULES_NAMES.FLOWS]: FLOWS_LINKS,
  [MODULES_NAMES.RECONCILIATION]: RECONCILIATION_LINKS,
  [MODULES_NAMES.WEBHOOKS]: WEBHOOKS_LINKS,
  [MODULES_NAMES.GATEWAY]: GATEWAY_LINKS,
  [MODULES_NAMES.STARGATE]: STARGATE_LINKS,
  [MODULES_NAMES.SEARCH]: undefined,
  [MODULES_NAMES.AUTH]: undefined,
  BANKING_BRIDGE: undefined,
};
