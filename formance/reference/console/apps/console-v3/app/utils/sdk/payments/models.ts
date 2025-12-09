// ----------------------------------
// MODELS
// ----------------------------------

import {
  Connector,
  Descriptor,
  PoolBalance,
  Raw,
  TaskStatus,
  TransferInitiationAdjustments,
  TransferInitiationPayments,
  TransferInitiationStatus,
  V3Instance,
  V3PaymentStatusEnum,
  V3PaymentTypeEnum,
} from '@platform/sdks/formance/src/models/components';
import {
  TTransferInitiationStatus,
  TTransferInitiationType,
} from './constants';

export type NormalizedPaymentModel = {
  provider?: Connector | undefined;
  raw?: Raw | null;
  adjustments?: Array<NormalizedPaymentAdjustmentModel> | null | undefined;
  id: string;
  connectorID: string;
  reference: string;
  createdAt: Date;
  type: V3PaymentTypeEnum;
  initialAmount: bigint;
  amount: bigint;
  asset: string;
  scheme: string;
  status: V3PaymentStatusEnum;
  sourceAccountID?: string | undefined;
  destinationAccountID?: string | undefined;
  metadata?: { [k: string]: string } | null | undefined;
};

export type NormalizedPaymentAccountModel = {
  id: string;
  provider?: string | undefined;
  defaultCurrency?: string | undefined;
  accountName?: string | undefined;
  name?: string | null | undefined;
  pools?: Array<string> | undefined;
  connectorID: string;
  reference: string;
  createdAt: Date;
  type: 'UNKNOWN' | 'INTERNAL' | 'EXTERNAL';
  defaultAsset?: string | null | undefined;
  metadata?: { [k: string]: string } | null | undefined;
  raw: Record<string, any> | null;
};

export type NormalizedPaymentAdjustmentModel = {
  id: string;
  reference: string;
  createdAt: Date;
  status:
    | 'OTHER'
    | 'PENDING'
    | 'SUCCEEDED'
    | 'CANCELLED'
    | 'FAILED'
    | 'EXPIRED'
    | 'REFUNDED'
    | 'REFUNDED_FAILURE'
    | 'DISPUTE'
    | 'DISPUTE_WON'
    | 'DISPUTE_LOST'
    | 'REFUND_REVERSED'
    | 'AMOUNT_ADJUSTEMENT'
    | 'AUTHORISATION'
    | 'CAPTURE'
    | 'CAPTURE_FAILED';
  amount?: bigint | undefined;
  asset?: string | undefined;
  metadata?: { [k: string]: string } | null | undefined;
  raw: Record<string, any>;
};

export type NormalizedPaymentAccountBalanceModel = {
  accountID: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  asset: string;
  balance: bigint;
  accountId: string;
  currency?: string;
};

export type NormalizedCashPoolModel = {
  id: string;
  name: string;
  createdAt?: Date;
  accounts?: Array<string>; // v1, v2
  poolAccounts?: Array<string>; // v3
};

export type NormalizedCashPoolBalanceModel = PoolBalance;

export type NormalizedCashPoolBalancesModel = PoolBalance[];

export type NormalizedTransferInitiationStatusModel = TTransferInitiationStatus;

export type NormalizedTransferInitiationTypeModel = TTransferInitiationType;

export type NormalizedTransferInitiationModel = {
  id: string;
  reference: string;
  createdAt: Date;
  scheduledAt: Date;
  description: string;
  connectorID: string;
  provider?: string | null;
  type: NormalizedTransferInitiationTypeModel;
  amount: bigint;
  initialAmount?: bigint;
  asset: string;
  status: NormalizedTransferInitiationStatusModel;
  error?: string | null | undefined;
  metadata?: { [k: string]: string } | null | undefined;
  sourceAccountID: string;
  destinationAccountID: string;
  relatedPayments?: Array<TransferInitiationPayments> | null | undefined;
  relatedAdjustments?: Array<TransferInitiationAdjustments> | null | undefined;
};

export type NormalizedTransferInitiationStatusUpdateModel = {
  status: TransferInitiationStatus;
};

export type NormalizedTransferInitiationAdjustementModel =
  TransferInitiationAdjustments;

export type NormalizedBankAccountRelatedAccountsModel = {
  id: string;
  provider?: string;
  connectorID?: string;
  accountID: string;
  createdAt: Date;
};

export type NormalizedBankAccountModel = {
  id: string;
  name: string;
  createdAt: Date;
  country?: string;
  connectorID?: string | undefined;
  accountID?: string | undefined;
  provider?: string | undefined;
  iban?: string | undefined;
  accountNumber?: string | undefined;
  swiftBicCode?: string | undefined;
  relatedAccounts?:
    | Array<NormalizedBankAccountRelatedAccountsModel>
    | undefined;
  metadata?: { [k: string]: string } | null | undefined;
};

export type NormalizedConnectorModel = Connector;

export type NormalizedConnectorConfigsModel = {
  [k: string]: {
    [k: string]: {
      dataType: string;
      required: boolean;
      defaultValue?: string | undefined;
    };
  };
};

export type NormalizedConnectorListModel = {
  id?: string;
  name: string;
  provider: Connector | string;
  connectorID?: string;
  enabled?: boolean | undefined;
  scheduledForDeletion?: boolean; // v3
  config?: Record<string, any>; // v3
};

export type NormalizedConnectorDataModel = {
  // TODO: More fields to be added here depending on
  // sdks/formance/src/models/components/connectorconfig.ts - Type ConnectorConfig

  // Common fields
  name: string;
  apiKey: string;
  pollingPeriod?: string | undefined;

  // Modulr
  apiSecret?: string | undefined;
  endpoint?: string | undefined;

  // CurrencyCloud
  clientId?: string | undefined;
  loginId?: string | undefined;

  // Stripe
  pageSize?: number | undefined;

  // Adyen
  hmacKey?: string | undefined;
  liveEndpointPrefix?: string | undefined;
  companyID: string;
  webhookPassword?: string | undefined;
  webhookUsername?: string | undefined;

  // DummyPay
  filePollingPeriod?: string | undefined;
  directory?: string | undefined;
  prefixFileToIngest?: string | undefined;
  numberOfAccountsPreGenerated?: number | undefined;
  numberOfPaymentsPreGenerated?: number | undefined;

  // Atlar
  baseUrl?: string | undefined;
  transferInitiationStatusPollingPeriod?: string | undefined;
  accessKey?: string | undefined;
  secret?: string | undefined;

  // BankingCircle
  username?: string | undefined;
  password?: string | undefined;
  authorizationEndpoint?: string | undefined;
  userCertificate?: string | undefined;
  userCertificateKey?: string | undefined;

  // Powens
  clientID?: string | undefined;
  configurationToken?: string | undefined;
  domain?: string | undefined;
  maxConnectionsPerLink?: number | undefined;
  provider?: string | undefined;
};

export type NormalizedConnectorTaskModel = {
  id: string;
  createdAt: Date;
  connectorId?: string;
  connectorID?: string;
  updatedAt?: Date;
  status?: TaskStatus;
  state?: any;
  error?: string | undefined;
  descriptor?: Descriptor;
};

export type NormalizedConnectorTaskScheduleInstanceModel = V3Instance;
