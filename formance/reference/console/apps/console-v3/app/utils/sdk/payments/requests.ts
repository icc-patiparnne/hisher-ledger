import * as components from '@platform/sdks/formance/src/models/components';
import {
  Connector,
  ConnectorConfig,
  PoolRequest,
  TransferInitiationRequest,
  V3CreateBankAccountRequest,
} from '@platform/sdks/formance/src/models/components';
import {
  GetPoolRequest,
  PaymentsgetAccountRequest,
} from '@platform/sdks/formance/src/models/operations';
import { NormalizedPaymentAdjustmentModel } from './models';

export type NormalizedListPaymentsRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
  query?: any;
  sort?: Array<string> | undefined;
};

export type NormalizedGetPaymentRequest = {
  paymentId: string;
};

export type NormalizedListPaymentsAdjustmentsRequest =
  NormalizedPaymentAdjustmentModel[];

export type NormalizedListPaymentsAccountsRequest =
  NormalizedListPaymentsRequest;

export type NormalizedPaymentAccountRequest = PaymentsgetAccountRequest;

export type NormalizedPaymentAccountBalancesRequest = {
  accountId: string;
  limit?: number | undefined;
  asset?: string | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
  pageSize?: number | undefined;
  cursor?: string | undefined;
  sort?: Array<string> | undefined;
  fromTimestamp?: Date | undefined;
  toTimestamp?: Date | undefined;
};

export type NormalizedAccountPoolsRequest = {
  accountId: string;
};

export type NormalizedListPoolsRequest = NormalizedListPaymentsRequest;

export type NormalizedGetCashPoolRequest = GetPoolRequest;

export type NormalizedGetCashPoolBalancesRequest = {
  poolId?: string; // v1
  poolID?: string; // v3
};

export type NormalizedGetCashPoolWithAccountsAndBalancesRequest =
  NormalizedGetCashPoolBalancesRequest;

export type NormalizedCreateCashPoolRequest = PoolRequest;

export type NormalizedCreateTransferInitiationRequest =
  TransferInitiationRequest;

export type NormalizedListTransferInitiationsRequest =
  NormalizedListPaymentsRequest;

export type NormalizedGetTransferRequest = {
  transferId: string;
};

export type NormalizedUpdateTransferInitiationRequest = {
  transferId: string;
  status: string; // v1
  updateTransferInitiationStatusRequest?: any; // v1
};

export type NormalizedCreateBankAccountRequest = V3CreateBankAccountRequest & {
  connectorID?: string | undefined;
  accountID?: string | undefined;
  provider?: string | undefined;
};

export type NormalizedListBankAccountsRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
  query?: { [k: string]: any } | undefined;
};

export type NormalizedGetBankAccountRequest = {
  bankAccountId: string;
};

export type NormalizedListConnectorsRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
};

export type NormalizedUninstallConnectorRequest = {
  connector?: string;
  connectorID: string;
};

export type NormalizedInstallConnectorRequest = {
  connector: string;
  config?: ConnectorConfig | components.V3InstallConnectorRequest | undefined;
};

export type NormalizedGetConnectorRequest = {
  connector: string;
  connectorId: string;
};

export type NormalizedListConnectorTasksRequest = {
  connector: Connector; // v1
  connectorId?: string; // v1
  connectorID?: string; // v3
  pageSize?: number | undefined;
  cursor?: string | undefined;
};

export type NormalizedGetConnectorTaskRequest = {
  connector: Connector;
  connectorId: string;
  taskId?: string;
  scheduleId?: string;
};

export type NormalizedGetConnectorTaskInstancesRequest = {
  connectorId: string;
  scheduleId: string;
};
