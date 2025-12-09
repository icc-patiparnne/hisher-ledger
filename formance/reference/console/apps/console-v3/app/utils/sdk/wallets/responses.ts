import * as components from '@platform/sdks/formance/src/models/components';

import { Cursor } from '@platform/sdks/utils/cursor';
import { NormalizedWalletModel } from './models';

export type NormalizedListWalletsResponse =
  | components.ListWalletsResponse
  | components.WalletsErrorResponse
  | {
      cursor: Cursor<NormalizedWalletModel>;
    };

export type NormalizedGetWalletResponse =
  | components.GetWalletResponse
  | components.WalletsErrorResponse;

export type NormalizedGetWalletBalancesResponse =
  | components.ListBalancesResponse
  | components.WalletsErrorResponse;

export type NormalizedGetWalletHoldsResponse =
  | components.GetHoldsResponse
  | components.WalletsErrorResponse;

export type NormalizedGetWalletHoldResponse =
  | components.GetHoldResponse
  | components.WalletsErrorResponse;

export type NormalizedCreateWalletResponse =
  | components.CreateWalletResponse
  | components.WalletsErrorResponse;

export type NormalizedCreditWalletResponse =
  | components.WalletsErrorResponse
  | undefined;

export type NormalizedDebitWalletResponse =
  | components.DebitWalletResponse
  | components.WalletsErrorResponse
  | undefined;

export type NormalizedConfirmHoldResponse =
  | components.WalletsErrorResponse
  | undefined;

export type NormalizedVoidHoldResponse =
  | components.WalletsErrorResponse
  | undefined;

export type NormalizedGetWalletSummaryResponse =
  | components.GetWalletSummaryResponse
  | components.WalletsErrorResponse;

export type NormalizedGetWalletHoldersResponse =
  | components.GetHoldsResponse
  | components.WalletsErrorResponse;

export type NormalizedGetWalletTransactionsResponse =
  | components.GetTransactionsResponse
  | components.WalletsErrorResponse;
