import {
  ConfigInfoResponse,
  V2AccountResponse,
  V2GetLedgerResponse,
  V2GetTransactionResponse,
  V2LedgerInfoResponse,
  V2LedgerListResponse,
  V2StatsResponse,
} from './src/models/components';
import {
  ListAccountsRequest,
  ListAccountsResponse,
  V2ListAccountsResponse,
  V2ListLogsResponse,
  V2ListTransactionsResponse,
} from './src/models/operations';
// ----------
// V1 guards
// ----------
export function isV1LedgerListGuard(item: unknown): item is ConfigInfoResponse {
  return (item as ConfigInfoResponse).data !== undefined;
}
export function isV1LedgerAccountsGuard(
  item: unknown
): item is ListAccountsRequest {
  return (item as ListAccountsResponse) !== undefined;
}

// ----------
// V2 guards
// ----------
export function isV2LedgerListGuard(
  item: unknown
): item is V2LedgerListResponse {
  return (item as V2LedgerListResponse).cursor !== undefined;
}

export function isV2LedgerGuard(item: unknown): item is V2GetLedgerResponse {
  return (item as V2GetLedgerResponse).data !== undefined;
}

export function isV2LedgerInfoGuard(
  item: unknown
): item is V2LedgerInfoResponse {
  return (item as V2LedgerInfoResponse).data !== undefined;
}

export function isV2LedgerStatsGuard(item: unknown): item is V2StatsResponse {
  return (item as V2StatsResponse).data !== undefined;
}

export function isV2LedgerLogsGuard(item: unknown): item is V2ListLogsResponse {
  return (item as V2ListLogsResponse) !== undefined;
}

export function isV2LedgerTransactionsGuard(
  item: unknown
): item is V2ListTransactionsResponse {
  return (item as V2ListTransactionsResponse) !== undefined;
}

export function isV2GetTransactionGuard(
  item: unknown
): item is V2GetTransactionResponse {
  return (item as V2GetTransactionResponse).data !== undefined;
}

export function isV2LedgerAccountsGuard(
  item: unknown
): item is V2ListAccountsResponse {
  return (item as V2ListAccountsResponse) !== undefined;
}
export function isV2AccountGuard(item: unknown): item is V2AccountResponse {
  return (item as V2AccountResponse).data !== undefined;
}
