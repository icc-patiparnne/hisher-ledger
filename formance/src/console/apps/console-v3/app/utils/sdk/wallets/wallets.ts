import { RequestOptions } from '@platform/sdks/formance/src/lib/sdks';
import { SDK } from '@platform/sdks/formance/src/sdk';
import { SDKValidationError } from '@platform/sdks/formance/src/models/errors';

import { NormalizedSDK } from '../sdk';
import {
  NormalizedConfirmHoldRequest,
  NormalizedCreateWalletRequest,
  NormalizedCreditWalletRequest,
  NormalizedDebitWalletRequest,
  NormalizedGetWalletBalancesRequest,
  NormalizedGetWalletHoldRequest,
  NormalizedGetWalletHoldsRequest,
  NormalizedGetWalletRequest,
  NormalizedGetWalletSummaryRequest,
  NormalizedGetWalletTransactionsRequest,
  NormalizedListWalletsRequest,
  NormalizedVoidHoldRequest,
} from './requests';
import {
  NormalizedConfirmHoldResponse,
  NormalizedCreateWalletResponse,
  NormalizedCreditWalletResponse,
  NormalizedDebitWalletResponse,
  NormalizedGetWalletBalancesResponse,
  NormalizedGetWalletHoldResponse,
  NormalizedGetWalletHoldsResponse,
  NormalizedGetWalletResponse,
  NormalizedGetWalletSummaryResponse,
  NormalizedGetWalletTransactionsResponse,
  NormalizedListWalletsResponse,
  NormalizedVoidHoldResponse,
} from './responses';
import { debugLogger } from '@platform/logger/helper';

export class NormalizedWallets {
  sdk: SDK;
  normalizedSDK: NormalizedSDK;
  version: string;

  constructor(sdk: SDK, version: string, normalizedSDK: NormalizedSDK) {
    this.normalizedSDK = normalizedSDK;
    this.version = version;
    this.sdk = sdk;
  }

  async listWallets(
    request: NormalizedListWalletsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListWalletsResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.listWallets(request, options);
      }
    }
  }

  async getWallet(
    request: NormalizedGetWalletRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWalletResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.getWallet(request, options);
      }
    }
  }

  // Wallet Summary is being used over getWalletBalances since we want to
  // display the assets for each balances
  async getWalletBalances(
    request: NormalizedGetWalletBalancesRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWalletBalancesResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.listBalances(request, options);
      }
    }
  }

  async getWalletSummary(
    request: NormalizedGetWalletSummaryRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWalletSummaryResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.getWalletSummary(request, options);
      }
    }
  }

  async getWalletHolds(
    request: NormalizedGetWalletHoldsRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWalletHoldsResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.getHolds(request, options);
      }
    }
  }

  async getWalletHold(
    request: NormalizedGetWalletHoldRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWalletHoldResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.getHold(request, options);
      }
    }
  }

  async createWallet(
    request: NormalizedCreateWalletRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreateWalletResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.createWallet(request, options);
      }
    }
  }

  async creditWallet(
    request: NormalizedCreditWalletRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreditWalletResponse> {
    switch (this.version) {
      case '1':
      default: {
        try {
          return await this.sdk.wallets.v1.creditWallet(request, options);
        } catch (error: any) {
          if (error instanceof SDKValidationError) {
            if (error.message === 'Response validation failed') {
              debugLogger(
                process.env.DEBUG!,
                'SDK:creditWallet',
                'request',
                request
              );
            }
          }
        }
      }
    }
  }

  async debitWallet(
    request: NormalizedDebitWalletRequest,
    options?: RequestOptions
  ): Promise<NormalizedDebitWalletResponse> {
    switch (this.version) {
      case '1':
      default: {
        try {
          return this.sdk.wallets.v1.debitWallet(request, options);
        } catch (error: any) {
          if (error instanceof SDKValidationError) {
            if (error.message === 'Response validation failed') {
              debugLogger(
                process.env.DEBUG!,
                'SDK:debitWallet',
                'request',
                request
              );
            }
          }
        }
      }
    }
  }

  async confirmHold(
    request: NormalizedConfirmHoldRequest,
    options?: RequestOptions
  ): Promise<NormalizedConfirmHoldResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.confirmHold(request, options);
      }
    }
  }

  async voidHold(
    request: NormalizedVoidHoldRequest,
    options?: RequestOptions
  ): Promise<NormalizedVoidHoldResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.voidHold(request, options);
      }
    }
  }

  async getWalletTransactions(
    request: NormalizedGetWalletTransactionsRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWalletTransactionsResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.wallets.v1.getTransactions(request, options);
      }
    }
  }
}
