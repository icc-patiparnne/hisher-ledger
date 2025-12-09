import { CreateSecretRequest } from '@platform/sdks/formance/src/models/components';
import {
  V2AddMetadataOnTransactionRequest,
  V2AddMetadataToAccountRequest,
  V2DeleteAccountMetadataRequest,
  V2DeleteLedgerMetadataRequest,
  V2DeleteTransactionMetadataRequest,
  V2UpdateLedgerMetadataRequest,
} from '@platform/sdks/formance/src/models/operations';

export type NormalizedCreateClientSecret = CreateSecretRequest & {
  clientId: string;
};

// Transaction
export type NormalizedListTransactionsRequest = {
  ledger: string;
  pageSize?: number | undefined;
  cursor?: string | undefined;
  // v1
  reference?: string | undefined;
  account?: string | undefined;
  source?: string | undefined;
  destination?: string | undefined;
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  metadata?: { [k: string]: any } | undefined;
  // v2
  order?: 'effective' | undefined;
  reverse?: boolean | undefined;
  expand?: string | undefined;
  pit?: Date | undefined;
  query?: { [k: string]: any } | undefined;
};
export type NormalizedGetTransactionRequest = {
  ledger: string;
  id: bigint;
  expand?: string | undefined;
  pit?: Date | undefined;
};

// Account
export type NormalizedListAccountsRequest = {
  ledger: string;
  pageSize?: number | undefined;
  cursor?: string | undefined;
  // v1
  metadata?: { [k: string]: any } | undefined;
  balance?: number | undefined;
  address?: string | undefined;
  paginationToken?: string | undefined;
  // v2
  expand?: string | undefined;
  pit?: Date | undefined;
  query?: { [k: string]: any } | undefined;
};
export type NormalizedGetAccountRequest = {
  ledger: string;
  address: string;
  expand?: string | undefined;
  pit?: Date | undefined;
};

// Ledger
export type NormalizedCreateLedgerRequest = {
  ledger: string;
  bucket?: string | undefined;
  metadata?: { [k: string]: string } | undefined;
  features?: { [k: string]: string } | undefined;
};
export type NormalizedGetLedgerInfoRequest = {
  ledger: string;
};
export type NormalizedGetLedgerStatsRequest = {
  ledger: string;
};
export type NormalizedGetLedgerRequest = {
  ledger: string;
};
export type NormalizedGetLedgerListLogsRequest = {
  ledger: string;
  pit?: Date | undefined;
};

export type NormalizedListLedgersRequest = {
  // v2
  pageSize?: number | undefined;
  cursor?: string | undefined;
};

export type NormalizedGetBalancesAggregatedRequest = {
  ledger: string;
  useInsertionDate?: boolean | undefined;
  query?: { [k: string]: any } | undefined;
  // v1
  address?: string | undefined;
  // v2
  pit?: Date | undefined;
};

export type NormalizedGetVolumesWithBalancesRequest = {
  ledger: string;
  pageSize?: number | undefined;
  cursor?: string | undefined;
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  useInsertionDate?: boolean | undefined;
  query?: { [k: string]: any } | undefined;
  // v1
  address?: string | undefined;
  // v2
  groupBy?: number | undefined;
  insertionDate?: boolean | undefined;
};

export type NormalizedUpdateLedgerMetadataRequest =
  V2UpdateLedgerMetadataRequest;

export type NormalizedDeleteLedgerMetadataRequest =
  V2DeleteLedgerMetadataRequest;

export type NormalizedUpdateAccountMetadataRequest =
  V2AddMetadataToAccountRequest;

export type NormalizedDeleteAccountMetadataRequest =
  V2DeleteAccountMetadataRequest;

export type NormalizedUpdateTransactionMetadataRequest =
  V2AddMetadataOnTransactionRequest;

export type NormalizedDeleteTransactionMetadataRequest =
  V2DeleteTransactionMetadataRequest;
