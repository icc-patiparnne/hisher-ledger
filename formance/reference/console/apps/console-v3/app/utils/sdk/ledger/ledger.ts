import { RequestOptions } from '@platform/sdks/formance/src/lib/sdks';
import { SDKValidationError } from '@platform/sdks/formance/src/models/errors';
import { GetInfoResponse } from '@platform/sdks/formance/src/models/operations';
import { SDK } from '@platform/sdks/formance/src/sdk';

import { debugLogger } from '@platform/logger/helper';
import { NormalizedSDK } from '../sdk';
import { NormalizedLedgerModel, NormalizedTransactionModel } from './models';
import {
  NormalizedCreateLedgerRequest,
  NormalizedDeleteAccountMetadataRequest,
  NormalizedDeleteLedgerMetadataRequest,
  NormalizedDeleteTransactionMetadataRequest,
  NormalizedGetAccountRequest,
  NormalizedGetBalancesAggregatedRequest,
  NormalizedGetLedgerInfoRequest,
  NormalizedGetLedgerListLogsRequest,
  NormalizedGetLedgerRequest,
  NormalizedGetLedgerStatsRequest,
  NormalizedGetTransactionRequest,
  NormalizedGetVolumesWithBalancesRequest,
  NormalizedListAccountsRequest,
  NormalizedListLedgersRequest,
  NormalizedListTransactionsRequest,
  NormalizedUpdateAccountMetadataRequest,
  NormalizedUpdateLedgerMetadataRequest,
  NormalizedUpdateTransactionMetadataRequest,
} from './requests';
import {
  NormalizedAddMetadataOnTransactionResponse,
  NormalizedAddMetadataToAccountResponse,
  NormalizedCreateLedgerResponse,
  NormalizedDeleteAccountMetadataResponse,
  NormalizedDeleteLedgerMetadataResponse,
  NormalizedDeleteTransactionMetadataResponse,
  NormalizedGetAccountResponse,
  NormalizedGetBalancesAggregatedResponse,
  NormalizedGetLedgerInfoResponse,
  NormalizedGetLedgerListLogsResponse,
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
  NormalizedGetTransactionResponse,
  NormalizedListAccountsResponse,
  NormalizedListLedgersResponse,
  NormalizedListTransactionsResponse,
  NormalizedUpdateLedgerMetadataResponse,
  NormalizedVolumesWithBalancesResponse,
} from './responses';

export class NormalizedLedger {
  sdk: SDK;
  normalizedSDK: NormalizedSDK;
  version: string;

  constructor(sdk: SDK, version: string, normalizedSDK: NormalizedSDK) {
    this.normalizedSDK = normalizedSDK;
    this.version = version;
    this.sdk = sdk;
  }

  async createLedger(
    request: NormalizedCreateLedgerRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreateLedgerResponse> {
    switch (this.version) {
      case '2':
      default: {
        try {
          return await this.sdk.ledger.v2.createLedger(
            {
              ledger: request.ledger,
              v2CreateLedgerRequest: {
                metadata: request?.metadata,
                bucket: request?.bucket,
                features: request?.features,
              },
            },
            options
          );
        } catch (error: any) {
          if (error instanceof SDKValidationError) {
            if (error.message === 'Response validation failed') {
              debugLogger(
                process.env.DEBUG!,
                'SDK:createLedger',
                'request',
                request
              );
            }
          }
        }
      }
    }
  }

  async listAccounts(
    request: NormalizedListAccountsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListAccountsResponse> {
    switch (this.version) {
      case '1':
        return this.sdk.ledger.v1.listAccounts(request, options);
      case '2':
      default:
        return this.sdk.ledger.v2.listAccounts(request, options);
    }
  }

  async getAccount(
    request: NormalizedGetAccountRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetAccountResponse> {
    switch (this.version) {
      case '1':
        return this.sdk.ledger.v1.getAccount(request, options);
      case '2':
      default:
        return this.sdk.ledger.v2.getAccount(request, options);
    }
  }

  async getTransaction(
    request: NormalizedGetTransactionRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetTransactionResponse> {
    switch (this.version) {
      case '1': {
        const transaction = await this.sdk.ledger.v1.getTransaction(
          { ...request, txid: request.id },
          options
        );
        if (transaction && 'data' in transaction) {
          return { data: { ...transaction.data, id: transaction.data.txid } };
        }

        return transaction;
      }

      case '2':
      default:
        return this.sdk.ledger.v2.getTransaction(request, options);
    }
  }

  async listTransactions(
    request: NormalizedListTransactionsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListTransactionsResponse> {
    switch (this.version) {
      case '1': {
        const transactions = await this.sdk.ledger.v1.listTransactions(
          request,
          options
        );
        if (transactions && 'cursor' in transactions) {
          const transactionsNormalized = transactions.cursor.data.map(
            (transaction: Omit<NormalizedTransactionModel, 'id'>) => ({
              ...transaction,
              id: transaction.txid,
            })
          );

          return {
            cursor: {
              ...transactions.cursor,
              data: transactionsNormalized as NormalizedTransactionModel[],
            },
          };
        }

        return transactions;
      }

      default: {
        return this.sdk.ledger.v2.listTransactions(request, options);
      }
    }
  }

  async listLedgers(
    request: NormalizedListLedgersRequest,
    options?: RequestOptions
  ): Promise<NormalizedListLedgersResponse> {
    switch (this.version) {
      case '1': {
        const info: GetInfoResponse = await this.sdk.ledger.v1.getInfo();
        if (info && 'data' in info) {
          const ledgers: string[] = info.data.config.storage.ledgers;

          return this.normalizedSDK.mockCursor<NormalizedLedgerModel>(
            ledgers.map((ledgerName: string) => ({ name: ledgerName }))
          );
        }

        return info;
      }
      case '2':
      default:
        return this.sdk.ledger.v2.listLedgers(request, options);
    }
  }

  async getLedger(
    request: NormalizedGetLedgerRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetLedgerResponse> {
    switch (this.version) {
      case '1': {
        return { data: { name: request.ledger } };
      }
      case '2':
      default:
        return this.sdk.ledger.v2.getLedger(request, options);
    }
  }

  async getLedgerInfo(
    request: NormalizedGetLedgerInfoRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetLedgerInfoResponse> {
    switch (this.version) {
      case '1': {
        return this.sdk.ledger.v1.getLedgerInfo(request, options);
      }
      case '2':
      default:
        return this.sdk.ledger.v2.getLedgerInfo(request, options);
    }
  }

  async updateLedgerMetadata(
    request: NormalizedUpdateLedgerMetadataRequest,
    options?: RequestOptions
  ): Promise<NormalizedUpdateLedgerMetadataResponse> {
    switch (this.version) {
      case '1': {
        throw new Error('Update ledger not supported in v1');
      }
      case '2':
      default:
        return await this.sdk.ledger.v2.updateLedgerMetadata(request, options);
    }
  }

  async deleteLedgerMetadata(
    request: NormalizedDeleteLedgerMetadataRequest,
    options?: RequestOptions
  ): Promise<NormalizedDeleteLedgerMetadataResponse> {
    switch (this.version) {
      case '1': {
        throw new Error('Delete ledger metadata not supported in v1');
      }
      case '2':
      default:
        return await this.sdk.ledger.v2.deleteLedgerMetadata(request, options);
    }
  }

  async addMetadataToAccount(
    request: NormalizedUpdateAccountMetadataRequest,
    options?: RequestOptions
  ): Promise<NormalizedAddMetadataToAccountResponse> {
    switch (this.version) {
      case '1': {
        throw new Error('Update account metadata not supported in v1');
      }
      case '2':
      default:
        return await this.sdk.ledger.v2.addMetadataToAccount(request, options);
    }
  }

  async deleteAccountMetadata(
    request: NormalizedDeleteAccountMetadataRequest,
    options?: RequestOptions
  ): Promise<NormalizedDeleteAccountMetadataResponse> {
    switch (this.version) {
      case '1': {
        throw new Error('Delete account metadata not supported in v1');
      }
      case '2':
      default:
        return await this.sdk.ledger.v2.deleteAccountMetadata(request, options);
    }
  }

  async addMetadataOnTransaction(
    request: NormalizedUpdateTransactionMetadataRequest,
    options?: RequestOptions
  ): Promise<NormalizedAddMetadataOnTransactionResponse> {
    switch (this.version) {
      case '1': {
        throw new Error('Update account metadata not supported in v1');
      }
      case '2':
      default:
        return await this.sdk.ledger.v2.addMetadataOnTransaction(
          {
            ...request,
            id: BigInt(request.id),
          },
          options
        );
    }
  }

  async deleteTransactionMetadata(
    request: NormalizedDeleteTransactionMetadataRequest,
    options?: RequestOptions
  ): Promise<NormalizedDeleteTransactionMetadataResponse> {
    switch (this.version) {
      case '1': {
        throw new Error('Delete transaction metadata not supported in v1');
      }
      case '2':
      default:
        return await this.sdk.ledger.v2.deleteTransactionMetadata(
          {
            ...request,
            id: BigInt(request.id),
          },
          options
        );
    }
  }

  async getLedgerStats(
    request: NormalizedGetLedgerStatsRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetLedgerStatsResponse> {
    switch (this.version) {
      case '1': {
        return this.sdk.ledger.v1.readStats(request, options);
      }
      case '2':
      default:
        return this.sdk.ledger.v2.readStats(request, options);
    }
  }

  async getLedgerListLogs(
    request: NormalizedGetLedgerListLogsRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetLedgerListLogsResponse> {
    switch (this.version) {
      case '1': {
        return this.sdk.ledger.v1.listLogs(request, options);
      }
      case '2':
      default:
        return this.sdk.ledger.v2.listLogs(request, options);
    }
  }

  async getBalancesAggregated(
    request: NormalizedGetBalancesAggregatedRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetBalancesAggregatedResponse> {
    switch (this.version) {
      case '1': {
        return this.sdk.ledger.v1.getBalancesAggregated(request, options);
      }
      case '2':
      default:
        return this.sdk.ledger.v2.getBalancesAggregated(request, options);
    }
  }

  async getVolumesWithBalances(
    request: NormalizedGetVolumesWithBalancesRequest,
    options?: RequestOptions
  ): Promise<NormalizedVolumesWithBalancesResponse> {
    switch (this.version) {
      case '2':
        return this.sdk.ledger.v2.getVolumesWithBalances(request, options);
      case '1':
      default:
        return {
          cursor: {
            data: [],
            pageSize: 0,
            hasMore: false,
          },
        };
    }
  }
}
