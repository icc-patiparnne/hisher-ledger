import * as errors from '@platform/sdks/formance/src/models/errors';
import { Cursor } from '@platform/sdks/utils/cursor';
import {
  NormalizedAccountModel,
  NormalizedLedgerInfoModel,
  NormalizedLedgerModel,
  NormalizedLogModel,
  NormalizedStatsModel,
  NormalizedTransactionModel,
  NormalizedVolumeWithBalanceModel,
} from './models';

// Ledger
export type NormalizedCreateLedgerResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | undefined;
export type NormalizedListLedgersResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | {
      cursor: Cursor<NormalizedLedgerModel>;
    };
export type NormalizedGetLedgerResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | { data?: NormalizedLedgerModel };
export type NormalizedGetLedgerInfoResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | { data?: NormalizedLedgerInfoModel };
export type NormalizedGetLedgerStatsResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | { data?: NormalizedStatsModel };
export type NormalizedGetLedgerListLogsResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | { cursor?: Cursor<NormalizedLogModel> };

// Account
export type NormalizedListAccountsResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | {
      cursor: Cursor<NormalizedAccountModel>;
    };
export type NormalizedGetAccountResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | {
      data: NormalizedAccountModel;
    };

// Transaction
export type NormalizedListTransactionsResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | {
      cursor: Cursor<NormalizedTransactionModel>;
    };

export type NormalizedGetTransactionResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | {
      data: NormalizedTransactionModel;
    };

// Account aggregation
export type NormalizedGetBalancesAggregatedResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | { data: { [k: string]: bigint | number } };

export type NormalizedVolumesWithBalancesResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | {
      cursor: Cursor<NormalizedVolumeWithBalanceModel>;
    };

export type NormalizedUpdateLedgerMetadataResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | undefined;

export type NormalizedDeleteLedgerMetadataResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | undefined;

export type NormalizedAddMetadataToAccountResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | undefined;

export type NormalizedDeleteAccountMetadataResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | undefined;

export type NormalizedAddMetadataOnTransactionResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | undefined;

export type NormalizedDeleteTransactionMetadataResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | undefined;
