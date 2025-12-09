import {
  Balance,
  ExpandedDebitHold,
  Hold,
  Wallet,
  WalletsTransaction,
} from '@platform/sdks/formance/src/models/components';

export type NormalizedWalletModel = Wallet;

export type NormalizedWalletBalanceModel = Balance;

export type NormalizedWalletHoldModel = Hold;

export type NormalizedWalletExpandedHoldModel = ExpandedDebitHold;

export type NormalizedWalletTransactionModel = WalletsTransaction;
