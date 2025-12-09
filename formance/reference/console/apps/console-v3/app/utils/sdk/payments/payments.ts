import { omit } from 'lodash-es';

import { RequestOptions } from '@platform/sdks/formance/src/lib/sdks';
import * as components from '@platform/sdks/formance/src/models/components';
import { Status } from '@platform/sdks/formance/src/models/components';
import { SDKValidationError } from '@platform/sdks/formance/src/models/errors';
import { SDK } from '@platform/sdks/formance/src/sdk';

import { debugLogger, logError, throwError } from '@platform/logger/helper';
import { NormalizedSDK } from '../sdk';
import { NormalizedConnectorListModel } from './models';
import {
  NormalizedAccountPoolsRequest,
  NormalizedCreateBankAccountRequest,
  NormalizedCreateCashPoolRequest,
  NormalizedCreateTransferInitiationRequest,
  NormalizedGetBankAccountRequest,
  NormalizedGetCashPoolBalancesRequest,
  NormalizedGetCashPoolRequest,
  NormalizedGetCashPoolWithAccountsAndBalancesRequest,
  NormalizedGetConnectorRequest,
  NormalizedGetConnectorTaskInstancesRequest,
  NormalizedGetConnectorTaskRequest,
  NormalizedGetPaymentRequest,
  NormalizedGetTransferRequest,
  NormalizedInstallConnectorRequest,
  NormalizedListBankAccountsRequest,
  NormalizedListConnectorsRequest,
  NormalizedListConnectorTasksRequest,
  NormalizedListPaymentsAccountsRequest,
  NormalizedListPaymentsRequest,
  NormalizedListPoolsRequest,
  NormalizedListTransferInitiationsRequest,
  NormalizedPaymentAccountBalancesRequest,
  NormalizedPaymentAccountRequest,
  NormalizedUninstallConnectorRequest,
  NormalizedUpdateTransferInitiationRequest,
} from './requests';
import {
  NormalizedCreateBankAccountResponse,
  NormalizedCreateCashPoolResponse,
  NormalizedCreateTransferInitiationResponse,
  NormalizedGetBankAccountResponse,
  NormalizedGetCashPoolBalancesResponse,
  NormalizedGetCashPoolResponse,
  NormalizedGetConnectorResponse,
  NormalizedGetConnectorTaskInstancesResponse,
  NormalizedGetPaymentAccountBalancesResponse,
  NormalizedGetPaymentAccountResponse,
  NormalizedGetPaymentAccountsResponse,
  NormalizedGetPaymentResponse,
  NormalizedGetTransferResponse,
  NormalizedInstallConnectorResponse,
  NormalizedListAllAvailableConnectorsResponse,
  NormalizedListBankAccountsResponse,
  NormalizedListConnectorsResponse,
  NormalizedListConnectorTasksResponse,
  NormalizedListPaymentsAccountsResponse,
  NormalizedListPaymentsResponse,
  NormalizedListPoolsResponse,
  NormalizedListTransferInitiationsResponse,
  NormalizedUninstallConnectorResponse,
  NormalizedUpdateTransferInitiationResponse,
} from './responses';

export class NormalizedPayments {
  sdk: SDK;
  normalizedSDK: NormalizedSDK;
  version: string;

  constructor(sdk: SDK, version: string, normalizedSDK: NormalizedSDK) {
    this.normalizedSDK = normalizedSDK;
    this.version = version;
    this.sdk = sdk;
  }

  async listPayments(
    request: NormalizedListPaymentsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListPaymentsResponse> {
    switch (this.version) {
      case '3':
        return this.sdk.payments.v3.listPayments(request, options);

      case '2':
      case '1':
      default: {
        return this.sdk.payments.v1.listPayments(
          { ...request, query: JSON.stringify(request.query) },
          options
        );
      }
    }
  }

  async getPayment(
    request: NormalizedGetPaymentRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetPaymentResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.getPayment(
          { paymentID: request.paymentId! },
          options
        );
      case '2':
      case '1':
      default:
        return await this.sdk.payments.v1.getPayment(
          { paymentId: request.paymentId! },
          options
        );
    }
  }

  async getPaymentAccounts(
    request: NormalizedListPaymentsAccountsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListPaymentsAccountsResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.listAccounts(request, options);
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.paymentslistAccounts(
          { ...request, query: JSON.stringify(request.query) },
          options
        );
      }
    }
  }

  async getPaymentAccount(
    request: NormalizedPaymentAccountRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetPaymentAccountResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.getAccount(
          { accountID: request.accountId },
          options
        );
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.paymentsgetAccount(request, options);
      }
    }
  }

  async getPaymentAccountBalances(
    request: NormalizedPaymentAccountBalancesRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetPaymentAccountBalancesResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.getAccountBalances(
          { ...request, accountID: request.accountId },
          options
        );
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.getAccountBalances(request, options);
      }
    }
  }

  async getPaymentAccountCashPools(
    request: NormalizedAccountPoolsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListPoolsResponse> {
    switch (this.version) {
      case '3':
      case '2':
      case '1':
      default: {
        try {
          const config = {
            query: {
              $and: [{ $match: { account_id: request.accountId } }],
            },
          };

          const paymentsAccountCashPools = await this.listPools(
            config,
            options
          );

          return paymentsAccountCashPools;
        } catch (e) {
          return this.normalizedSDK.mockCursor([]);
        }
      }
    }
  }

  async listPools(
    request: NormalizedListPoolsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListPoolsResponse> {
    switch (this.version) {
      case '3': {
        const pools = await this.sdk.payments.v3.listPools(request, options);
        if (pools && 'cursor' in pools) {
          const data = pools.cursor.data.map((pool) => ({
            ...pool,
            accounts: pool.poolAccounts,
          }));

          return { cursor: { ...pools.cursor, data } };
        }

        return pools;
      }
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.listPools(
          { ...request, query: JSON.stringify(request.query) },
          options
        );
      }
    }
  }

  async getCashPool(
    request: NormalizedGetCashPoolRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetCashPoolResponse> {
    switch (this.version) {
      case '3': {
        const pool = await this.sdk.payments.v3.getPool(
          { poolID: request.poolId },
          options
        );
        if (pool && 'data' in pool) {
          const p = omit({ ...pool.data, accounts: pool.data.poolAccounts }, [
            'poolAccounts',
          ]);

          return { data: p };
        }

        return pool;
      }
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.getPool(request, options);
      }
    }
  }

  async getCashPoolBalances(
    request: NormalizedGetCashPoolBalancesRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetCashPoolBalancesResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.getPoolBalancesLatest(
          { ...request, poolID: request.poolId! },
          options
        );
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.getPoolBalancesLatest(
          {
            ...request,
            poolId: request.poolId!,
          },
          options
        );
      }
    }
  }

  async getCashPoolWithAccountsAndBalances(
    request: NormalizedGetCashPoolWithAccountsAndBalancesRequest,
    options?: RequestOptions
  ): Promise<{
    cashPool: NormalizedGetCashPoolResponse | undefined;
    cashPoolAccounts: NormalizedGetPaymentAccountsResponse;
    cashPoolBalances: NormalizedGetCashPoolBalancesResponse;
  }> {
    const cashPool = await this.getCashPool(
      {
        poolId: request.poolId!,
      },
      options
    );
    if (cashPool && 'data' in cashPool) {
      const cashPoolAccountsIds =
        cashPool.data.accounts || cashPool.data.poolAccounts || [];
      const cashPoolAccounts = await Promise.all(
        cashPoolAccountsIds.map((accountId: string) =>
          this.getPaymentAccount({ accountId })
        )
      )
        .then((accounts) =>
          accounts.map((account: NormalizedGetPaymentAccountResponse) => {
            if ('data' in account) return account.data;

            throw new Error('Failed to get payment account data');
          })
        )
        .catch((error) => {
          logError(error);

          return [];
        });

      const cashPoolBalances = await this.getCashPoolBalances(request, options);

      return {
        cashPool,
        cashPoolAccounts: {
          data: cashPoolAccounts,
        },
        cashPoolBalances,
      };
    }

    return {
      cashPool: undefined,
      cashPoolAccounts: {
        data: [],
      },
      cashPoolBalances: { data: [] },
    };
  }

  async createCashPool(
    request: NormalizedCreateCashPoolRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreateCashPoolResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.createPool(request, options);
      case '2':
      case '1':
      default: {
        const cashPool = await this.sdk.payments.v1.createPool(
          request,
          options
        );
        if (cashPool && 'data' in cashPool) {
          return { data: cashPool.data.id };
        }
      }
    }
  }

  async listTransferInitiations(
    request: NormalizedListTransferInitiationsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListTransferInitiationsResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.listPaymentInitiations(
          request,
          options
        );
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.listTransferInitiations(
          { ...request, query: JSON.stringify(request.query) },
          options
        );
      }
    }
  }

  async getTransferInitiation(
    request: NormalizedGetTransferRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetTransferResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.getPaymentInitiation(
          { paymentInitiationID: request.transferId! },
          options
        );
      case '2':
      case '1':
      default:
        return await this.sdk.payments.v1.getTransferInitiation(
          { transferId: request.transferId! },
          options
        );
    }
  }

  async updateTransferInitiation(
    request: NormalizedUpdateTransferInitiationRequest,
    options?: RequestOptions
  ): Promise<NormalizedUpdateTransferInitiationResponse> {
    switch (this.version) {
      case '3': {
        switch (request.status) {
          case Status.Rejected: {
            return await this.sdk.payments.v3.rejectPaymentInitiation({
              paymentInitiationID: request.transferId,
            });
          }
          case Status.Validated: {
            return await this.sdk.payments.v3.approvePaymentInitiation({
              paymentInitiationID: request.transferId,
            });
          }
          default: {
            return throwError(
              422,
              'Status is missing to approve/reject payment init update'
            );
          }
        }
      }
      case '2':
      case '1':
      default: {
        try {
          return await this.sdk.payments.v1.updateTransferInitiationStatus(
            {
              transferId: request.transferId!,
              updateTransferInitiationStatusRequest: {
                status: request.status! as any,
              },
            },
            options
          );
        } catch (error: any) {
          if (error instanceof SDKValidationError) {
            if (error.message === 'Response validation failed') {
              debugLogger(
                process.env.DEBUG!,
                'SDK:updateTransferInitiationStatus',
                'request',
                request
              );
            }
          }
        }
      }
    }
  }

  async createTransferInitiation(
    request: NormalizedCreateTransferInitiationRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreateTransferInitiationResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.initiatePayment(
          {
            noValidation: false,
            v3InitiatePaymentRequest: request as any,
          },
          options
        );
      case '2':
      case '1':
      default:
        return await this.sdk.payments.v1.createTransferInitiation(
          request,
          options
        );
    }
  }

  async createBankAccount(
    request: NormalizedCreateBankAccountRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreateBankAccountResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.createBankAccount(request, options);
      case '2':
      case '1':
      default: {
        const v1Request = {
          ...request,
          country: request.country || '', // Ensure country is defined for v1
        };

        return await this.sdk.payments.v1.createBankAccount(v1Request, options);
      }
    }
  }

  async listBankAccounts(
    request: NormalizedListBankAccountsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListBankAccountsResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.listBankAccounts(request, options);
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.listBankAccounts(request, options);
      }
    }
  }

  async getBankAccount(
    request: NormalizedGetBankAccountRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetBankAccountResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.getBankAccount(
          { bankAccountID: request.bankAccountId! },
          options
        );
      case '2':
      case '1':
      default:
        return await this.sdk.payments.v1.getBankAccount(
          { bankAccountId: request.bankAccountId! },
          options
        );
    }
  }

  // Connectors
  async listConnectors(
    request: NormalizedListConnectorsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListConnectorsResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.listConnectors(request, options);
      case '2':
      case '1':
      default: {
        const connectors = await this.sdk.payments.v1.listAllConnectors(
          options
        );

        if (connectors && 'data' in connectors) {
          return this.normalizedSDK.mockCursor<NormalizedConnectorListModel>(
            connectors.data
          );
        }

        return connectors;
      }
    }
  }

  async listAllAvailableConnectors(): Promise<NormalizedListAllAvailableConnectorsResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.listConnectorConfigs();
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.listConfigsAvailableConnectors();
      }
    }
  }

  async installConnector(
    request: NormalizedInstallConnectorRequest,
    options?: RequestOptions
  ): Promise<NormalizedInstallConnectorResponse> {
    switch (this.version) {
      case '3': {
        const connector = await this.sdk.payments.v3.installConnector(
          {
            connector: request.connector,
            v3InstallConnectorRequest:
              request.config as components.V3InstallConnectorRequest,
          },
          options
        );
        if (connector && 'data' in connector) {
          return { data: { id: connector.data } };
        }

        return connector;
      }
      case '2':
      case '1':
      default: {
        const connector = await this.sdk.payments.v1.installConnector(
          {
            connector: request.connector as components.Connector,
            connectorConfig: request.config as components.ConnectorConfig,
          },
          options
        );
        if (connector && 'data' in connector) {
          return { data: { id: connector.data.connectorID } };
        }

        return connector;
      }
    }
  }

  async getConnector(
    request: NormalizedGetConnectorRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetConnectorResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.getConnectorConfig(
          { ...request, connectorID: request.connectorId },
          options
        );
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.readConnectorConfigV1(
          { ...request, connector: request.connector as any },
          options
        );
      }
    }
  }

  async getConnectorTasks(
    request: NormalizedListConnectorTasksRequest,
    options?: RequestOptions
  ): Promise<NormalizedListConnectorTasksResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.listConnectorSchedules(
          { connectorID: request.connectorId! },
          options
        );
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.listConnectorTasksV1(
          {
            ...request,
            connector: request.connector!,
            connectorId: request.connectorId!,
          },
          options
        );
      }
    }
  }

  async getConnectorTask(
    request: NormalizedGetConnectorTaskRequest,
    options?: RequestOptions
  ): Promise<any> {
    switch (this.version) {
      case '1':
      case '2':
      case '3':
        return await this.sdk.payments.v3.getConnectorSchedule(
          {
            connectorID: request.connectorId!,
            scheduleID: request.scheduleId!,
          },
          options
        );
      default: {
        return await this.sdk.payments.v1.getConnectorTaskV1(
          {
            ...request,
            connector: request.connector!,
            connectorId: request.connectorId!,
            taskId: request.taskId!,
          },
          options
        );
      }
    }
  }

  async getConnectorTaskInstances(
    request: NormalizedGetConnectorTaskInstancesRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetConnectorTaskInstancesResponse> {
    return await this.sdk.payments.v3.listConnectorScheduleInstances(
      { connectorID: request.connectorId!, scheduleID: request.scheduleId },
      options
    );
  }

  async uninstallConnector(
    request: NormalizedUninstallConnectorRequest,
    options?: RequestOptions
  ): Promise<NormalizedUninstallConnectorResponse> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.uninstallConnector(request, options);
      case '2':
      case '1':
      default: {
        return await this.sdk.payments.v1.uninstallConnectorV1(
          {
            connector: request.connector! as components.Connector,
            connectorId: request.connectorID,
          },
          options
        );
      }
    }
  }

  async resetConnector(request: any, options?: RequestOptions): Promise<any> {
    switch (this.version) {
      case '3':
        return await this.sdk.payments.v3.resetConnector(request, options);
      case '2':
      case '1':
      default:
        return await this.sdk.payments.v1.resetConnectorV1(request, options);
    }
  }
}
