// Make sure to keep this in sync with the Connector enum in the SDK
export const CONNECTORS_NAMES = {
  Generic: 'GENERIC',
  Stripe: 'STRIPE',
  DummyPay: 'DUMMY-PAY',
  Wise: 'WISE',
  Modulr: 'MODULR',
  CurrencyCloud: 'CURRENCY-CLOUD',
  ClearBank: 'CLEAR-BANK',
  BankingCircle: 'BANKING-CIRCLE',
  Mangopay: 'MANGOPAY',
  Moneycorp: 'MONEYCORP',
  Atlar: 'ATLAR',
  Adyen: 'ADYEN',
  Increase: 'INCREASE', // V3
  Qonto: 'QONTO', // V3
  GoCardless: 'GOCARDLESS', // Coming Soon
  Column: 'COLUMN',
  Plaid: 'PLAID',
  Powens: 'POWENS',
  Tink: 'TINK',
  Airwallex: 'AIRWALLEX', // Coming Soon
  Braintree: 'BRAINTREE', // Coming Soon
  Orum: 'ORUM', // Coming Soon
  CheckoutCom: 'CHECKOUT-COM', // Coming Soon
  JPMC: 'JPMC', // Coming Soon
  Devengo: 'DEVENGO', // Coming Soon
  Paysafe: 'PAYSAFE', // Coming Soon
  Coinbase: 'COINBASE', // Coming Soon
  Moov: 'MOOV', // Coming Soon
  CrossRiverBank: 'CROSS-RIVER-BANK', // Coming Soon
  AdyenForPlatform: 'ADYEN-FOR-PLATFORM', // Coming Soon
  Routable: 'ROUTABLE', // Coming Soon
} as const;

export type TConnectorName =
  (typeof CONNECTORS_NAMES)[keyof typeof CONNECTORS_NAMES];

export const CONNECTORS_TYPES = {
  SoftwareGateway: 'Software Gateway',
  BankingAsAService: 'Banking as a Service',
  PaymentServiceProvider: 'Payment Service Provider',
  PaymentProcessor: 'Payment Processor',
  ThirdPartyProvider: 'Third Party Provider',
  Bank: 'Bank',
  Crypto: 'Crypto',
} as const;

export type TConnectorType =
  (typeof CONNECTORS_TYPES)[keyof typeof CONNECTORS_TYPES];

export const CONNECTOR_FEATURES = {
  CardAcquiring: 'Card Acquiring',
  BankingAccounts: 'Banking Accounts',
  CurrencyConversion: 'Currency Conversion',
  CardAcquiringCurrencyConversion: 'Card Acquiring, Currency Conversion',
  BankingAccountsCurrencyConversion: 'Banking Accounts, Currency Conversion',
  SEPADebit: 'SEPA Debit',
  ACH: 'ACH',
  None: '—',
} as const;

export type TConnectorFeature =
  (typeof CONNECTOR_FEATURES)[keyof typeof CONNECTOR_FEATURES];

export type TConnector = {
  name: TConnectorName;
  displayName: string;
  slug: string;
  description: string;
  type: TConnectorType[];
  features: TConnectorFeature;
  release: 'V1' | 'V3';
  website?: string;
  documentation?: string;
};

export const formatConnectorName = (
  connectorName: TConnectorName,
  version: string
): string => {
  if (version === '3') {
    return connectorName.replace(/-/g, '');
  }

  return connectorName;
};

export const CONNECTORS: Record<TConnectorName, TConnector> = {
  [CONNECTORS_NAMES.Stripe]: {
    name: CONNECTORS_NAMES.Stripe,
    displayName: 'Stripe',
    slug: 'stripe',
    description:
      'Complete payment platform with card acquiring and global reach.',
    type: [
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.PaymentProcessor,
    ],
    features: CONNECTOR_FEATURES.CardAcquiring,
    release: 'V1',
    website: 'https://stripe.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/stripe',
  },
  [CONNECTORS_NAMES.Wise]: {
    name: CONNECTORS_NAMES.Wise,
    displayName: 'Wise',
    slug: 'wise',
    description:
      'International money transfer and multi-currency banking accounts.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.BankingAccountsCurrencyConversion,
    release: 'V1',
    website: 'https://wise.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/wise',
  },
  [CONNECTORS_NAMES.Modulr]: {
    name: CONNECTORS_NAMES.Modulr,
    displayName: 'Modulr',
    slug: 'modulr',
    description: 'Digital payments and banking accounts for businesses.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.BankingAccounts,
    release: 'V1',
    website: 'https://www.modulrfinance.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/modulr',
  },
  [CONNECTORS_NAMES.CurrencyCloud]: {
    name: CONNECTORS_NAMES.CurrencyCloud,
    displayName: 'Currency Cloud',
    slug: 'currencycloud',
    description: 'Cross-border payments and currency conversion platform.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.CurrencyConversion,
    release: 'V1',
    website: 'https://currencycloud.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/currencycloud',
  },
  [CONNECTORS_NAMES.ClearBank]: {
    name: CONNECTORS_NAMES.ClearBank,
    displayName: 'Clear Bank',
    slug: 'clear-bank',
    description: 'International payment solutions and banking accounts.',
    type: [CONNECTORS_TYPES.Bank],
    features: CONNECTOR_FEATURES.BankingAccounts,
    release: 'V3',
    website: 'https://clearbank.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/clear-bank',
  },
  [CONNECTORS_NAMES.BankingCircle]: {
    name: CONNECTORS_NAMES.BankingCircle,
    displayName: 'Banking Circle',
    slug: 'bankingcircle',
    description: 'International payment solutions and banking accounts.',
    type: [CONNECTORS_TYPES.Bank, CONNECTORS_TYPES.BankingAsAService],
    features: CONNECTOR_FEATURES.BankingAccounts,
    release: 'V1',
    website: 'https://bankingcircle.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/bankingcircle',
  },
  [CONNECTORS_NAMES.Mangopay]: {
    name: CONNECTORS_NAMES.Mangopay,
    displayName: 'Mangopay',
    slug: 'mangopay',
    description: 'Payment infrastructure for marketplaces and platforms.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.CardAcquiring,
    release: 'V1',
    website: 'https://mangopay.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/mangopay',
  },
  [CONNECTORS_NAMES.Moneycorp]: {
    name: CONNECTORS_NAMES.Moneycorp,
    displayName: 'Moneycorp',
    slug: 'moneycorp',
    description: 'International payments and currency exchange services.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.CardAcquiringCurrencyConversion,
    release: 'V1',
    website: 'https://moneycorp.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/moneycorp',
  },
  [CONNECTORS_NAMES.Atlar]: {
    name: CONNECTORS_NAMES.Atlar,
    displayName: 'Atlar',
    slug: 'atlar',
    description: 'Modern treasury management and payment automation.',
    type: [CONNECTORS_TYPES.SoftwareGateway],
    features: CONNECTOR_FEATURES.None,
    release: 'V1',
    website: 'https://atlar.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/atlar',
  },
  [CONNECTORS_NAMES.Adyen]: {
    name: CONNECTORS_NAMES.Adyen,
    displayName: 'Adyen',
    slug: 'adyen',
    description:
      'Global payment platform with advanced card acquiring capabilities.',
    type: [
      CONNECTORS_TYPES.Bank,
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.PaymentProcessor,
    ],
    features: CONNECTOR_FEATURES.CardAcquiring,
    release: 'V1',
    website: 'https://adyen.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/adyen',
  },
  [CONNECTORS_NAMES.Increase]: {
    name: CONNECTORS_NAMES.Increase,
    displayName: 'Increase',
    slug: 'increase',
    description: 'Modern banking API for developers and businesses.',
    type: [CONNECTORS_TYPES.ThirdPartyProvider],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://increase.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/increase',
  },
  [CONNECTORS_NAMES.Qonto]: {
    name: CONNECTORS_NAMES.Qonto,
    displayName: 'Qonto',
    slug: 'qonto',
    description: 'Business banking and financial management platform.',
    type: [
      CONNECTORS_TYPES.Bank,
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.BankingAccounts,
    release: 'V3',
    website: 'https://qonto.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/qonto',
  },
  [CONNECTORS_NAMES.GoCardless]: {
    name: CONNECTORS_NAMES.GoCardless,
    displayName: 'GoCardless',
    slug: 'gocardless',
    description: 'Direct debit and recurring payment solutions.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.PaymentProcessor,
    ],
    features: CONNECTOR_FEATURES.SEPADebit,
    release: 'V3',
    website: 'https://gocardless.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/gocardless',
  },
  [CONNECTORS_NAMES.Column]: {
    name: CONNECTORS_NAMES.Column,
    displayName: 'Column',
    slug: 'column',
    description: 'Banking as a Service platform for businesses.',
    type: [CONNECTORS_TYPES.BankingAsAService, CONNECTORS_TYPES.Bank],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://column.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/column',
  },
  [CONNECTORS_NAMES.Plaid]: {
    name: CONNECTORS_NAMES.Plaid,
    displayName: 'Plaid',
    slug: 'plaid',
    description:
      'Secure access to U.S. bank accounts for data, identity, and payment verification.',
    type: [
      CONNECTORS_TYPES.SoftwareGateway,
      CONNECTORS_TYPES.ThirdPartyProvider,
    ],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://plaid.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/plaid',
  },
  [CONNECTORS_NAMES.Powens]: {
    name: CONNECTORS_NAMES.Powens,
    displayName: 'Powens',
    slug: 'powens',
    description:
      'Open banking access to European financial data across banks, savings, and more.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.SoftwareGateway,
      CONNECTORS_TYPES.ThirdPartyProvider,
    ],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://powens.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/powens',
  },
  [CONNECTORS_NAMES.Tink]: {
    name: CONNECTORS_NAMES.Tink,
    displayName: 'Tink',
    slug: 'tink',
    description:
      'Pan-European banking connectivity with enriched transaction and payment data.',
    type: [CONNECTORS_TYPES.ThirdPartyProvider],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://tink.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/tink',
  },
  [CONNECTORS_NAMES.Airwallex]: {
    name: CONNECTORS_NAMES.Airwallex,
    displayName: 'Airwallex',
    slug: 'airwallex',
    description: 'Global business banking and payment solutions.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.BankingAccounts,
    release: 'V3',
    website: 'https://airwallex.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/airwallex',
  },
  [CONNECTORS_NAMES.Braintree]: {
    name: CONNECTORS_NAMES.Braintree,
    displayName: 'Braintree',
    slug: 'braintree',
    description: 'PayPal-owned payment processing platform.',
    type: [
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.PaymentProcessor,
    ],
    features: CONNECTOR_FEATURES.CardAcquiring,
    release: 'V3',
    website: 'https://braintree.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/braintree',
  },
  [CONNECTORS_NAMES.Orum]: {
    name: CONNECTORS_NAMES.Orum,
    displayName: 'Orum',
    slug: 'orum',
    description: 'ACH payment processing and bank transfer solutions.',
    type: [
      CONNECTORS_TYPES.PaymentProcessor,
      CONNECTORS_TYPES.ThirdPartyProvider,
    ],
    features: CONNECTOR_FEATURES.ACH,
    release: 'V3',
    website: 'https://orum.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/orum',
  },
  [CONNECTORS_NAMES.CheckoutCom]: {
    name: CONNECTORS_NAMES.CheckoutCom,
    displayName: 'Checkout.com',
    slug: 'checkoutcom',
    description: 'Global payment processing and card acquiring platform.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.PaymentProcessor,
    ],
    features: CONNECTOR_FEATURES.CardAcquiring,
    release: 'V3',
    website: 'https://checkout.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/checkout-com',
  },
  [CONNECTORS_NAMES.JPMC]: {
    name: CONNECTORS_NAMES.JPMC,
    displayName: 'JPMorgan Chase',
    slug: 'jpmorgan-chase',
    description: 'Enterprise banking and payment processing services.',
    type: [CONNECTORS_TYPES.PaymentProcessor],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://jpmc.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/jpmc',
  },
  [CONNECTORS_NAMES.Devengo]: {
    name: CONNECTORS_NAMES.Devengo,
    displayName: 'Devengo',
    slug: 'devengo',
    description: 'Banking infrastructure and payment solutions.',
    type: [
      CONNECTORS_TYPES.BankingAsAService,
      CONNECTORS_TYPES.PaymentServiceProvider,
    ],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://devengo.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/devengo',
  },
  [CONNECTORS_NAMES.Paysafe]: {
    name: CONNECTORS_NAMES.Paysafe,
    displayName: 'Paysafe',
    slug: 'paysafe',
    description: 'Digital commerce and payment processing platform.',
    type: [CONNECTORS_TYPES.PaymentProcessor],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://paysafe.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/paysafe',
  },
  [CONNECTORS_NAMES.Coinbase]: {
    name: CONNECTORS_NAMES.Coinbase,
    displayName: 'Coinbase',
    slug: 'coinbase',
    description: 'Cryptocurrency exchange and digital wallet services.',
    type: [CONNECTORS_TYPES.Crypto],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://coinbase.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/coinbase',
  },
  [CONNECTORS_NAMES.Moov]: {
    name: CONNECTORS_NAMES.Moov,
    displayName: 'Moov',
    slug: 'moov',
    description: 'Modern payment infrastructure and banking services.',
    type: [CONNECTORS_TYPES.SoftwareGateway],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://moov.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/moov',
  },
  [CONNECTORS_NAMES.CrossRiverBank]: {
    name: CONNECTORS_NAMES.CrossRiverBank,
    displayName: 'Cross River Bank',
    slug: 'cross-river-bank',
    description: 'Technology-forward commercial bank and payment solutions.',
    type: [CONNECTORS_TYPES.Bank],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://crossriverbank.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/cross-river-bank',
  },
  [CONNECTORS_NAMES.AdyenForPlatform]: {
    name: CONNECTORS_NAMES.AdyenForPlatform,
    displayName: 'Adyen for Platform',
    slug: 'adyen-for-platform',
    description:
      'Marketplace and platform-focused payment solutions from Adyen.',
    type: [
      CONNECTORS_TYPES.Bank,
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.PaymentProcessor,
    ],
    features: CONNECTOR_FEATURES.CardAcquiring,
    release: 'V3',
    website: 'https://adyen.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/adyen',
  },
  [CONNECTORS_NAMES.DummyPay]: {
    name: CONNECTORS_NAMES.DummyPay,
    displayName: 'DummyPay',
    slug: 'dummypay',
    description: 'Test payment connector for development and testing purposes.',
    type: [CONNECTORS_TYPES.SoftwareGateway],
    features: CONNECTOR_FEATURES.None,
    release: 'V1',
  },
  [CONNECTORS_NAMES.Routable]: {
    name: CONNECTORS_NAMES.Routable,
    displayName: 'Routable',
    slug: 'routable',
    description:
      'Comprehensive accounts payable automation platform for invoice processing, payments, and vendor management.',
    type: [
      CONNECTORS_TYPES.PaymentServiceProvider,
      CONNECTORS_TYPES.ThirdPartyProvider,
    ],
    features: CONNECTOR_FEATURES.None,
    release: 'V3',
    website: 'https://routable.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/routable',
  },
  [CONNECTORS_NAMES.Generic]: {
    name: CONNECTORS_NAMES.Generic,
    displayName: 'Generic',
    slug: 'generic',
    description: 'Generic payment connector for custom integrations.',
    type: [CONNECTORS_TYPES.SoftwareGateway],
    features: CONNECTOR_FEATURES.None,
    release: 'V1',
    website: 'https://generic.com',
    documentation:
      'https://docs.formance.com/modules/connectivity/connectors/generic',
  },
} as const;

// Export sorted connectors: V1 first, then V3, then alphabetically by name
export const SORTED_CONNECTORS = Object.entries(CONNECTORS).sort(
  ([, a], [, b]) => {
    // First sort by release (V1 -> V3)
    if (a.release !== b.release) {
      const releaseOrder = { V1: 0, V3: 1 };

      return releaseOrder[a.release] - releaseOrder[b.release];
    }

    // Then sort alphabetically by name
    return a.name.localeCompare(b.name);
  }
) as Array<[TConnectorName, TConnector]>;
