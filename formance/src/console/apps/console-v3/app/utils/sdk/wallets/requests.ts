import {
  ConfirmHoldRequest,
  CreateWalletRequest,
  CreditWalletRequest,
  DebitWalletRequest,
  GetHoldRequest,
  GetHoldsRequest,
  GetTransactionsRequest,
  GetWalletRequest,
  GetWalletSummaryRequest,
  ListBalancesRequest,
  ListWalletsRequest,
  VoidHoldRequest,
} from '@platform/sdks/formance/src/models/operations';

export type NormalizedListWalletsRequest = ListWalletsRequest;

export type NormalizedGetWalletRequest = GetWalletRequest;

export type NormalizedGetWalletBalancesRequest = ListBalancesRequest;

export type NormalizedGetWalletSummaryRequest = GetWalletSummaryRequest;

export type NormalizedCreateWalletRequest = CreateWalletRequest;

export type NormalizedCreditWalletRequest = CreditWalletRequest;

export type NormalizedDebitWalletRequest = DebitWalletRequest;

export type NormalizedConfirmHoldRequest = ConfirmHoldRequest;

export type NormalizedVoidHoldRequest = VoidHoldRequest;

export type NormalizedGetWalletHoldsRequest = GetHoldsRequest;

export type NormalizedGetWalletHoldRequest = GetHoldRequest;

export type NormalizedGetWalletTransactionsRequest = GetTransactionsRequest;
