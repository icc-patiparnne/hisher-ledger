import { SDK } from '@platform/sdks/formance/src/sdk';

import { NormalizedSDK } from '../sdk';
import {
  CreateClientRequest,
  CreateClientResponse,
  CreateSecretResponse,
  ListClientsResponse,
  ReadClientResponse,
} from '@platform/sdks/formance/src/models/components';
import {
  DeleteClientRequest,
  DeleteSecretRequest,
  ReadClientRequest,
} from '@platform/sdks/formance/src/models/operations';
import { NormalizedCreateClientSecret } from '../ledger/requests';
import { omit } from 'lodash-es';

export class NormalizedAuth {
  sdk: SDK;
  normalizedSDK: NormalizedSDK;
  version: string;

  constructor(sdk: SDK, version: string, normalizedSDK: NormalizedSDK) {
    this.normalizedSDK = normalizedSDK;
    this.version = version;
    this.sdk = sdk;
  }

  listClients = async (): Promise<ListClientsResponse> => {
    switch (this.version) {
      case '1':
      case '2':
      default:
        return this.sdk.auth.v1.listClients();
    }
  };

  getClient = async (
    request: ReadClientRequest
  ): Promise<ReadClientResponse> => {
    switch (this.version) {
      case '1':
      case '2':
      default:
        return this.sdk.auth.v1.readClient(request);
    }
  };

  createClient = async (
    request: CreateClientRequest
  ): Promise<CreateClientResponse> => {
    switch (this.version) {
      case '1':
      case '2':
      default:
        return this.sdk.auth.v1.createClient(request);
    }
  };

  deleteClient = async (
    request: DeleteClientRequest
  ): Promise<DeleteClientRequest> => {
    switch (this.version) {
      case '1':
      case '2':
      default: {
        await this.sdk.auth.v1.deleteClient(request);

        return request;
      }
    }
  };

  createSecret = async (
    request: NormalizedCreateClientSecret
  ): Promise<CreateSecretResponse> => {
    switch (this.version) {
      case '1':
      case '2':
      default:
        return this.sdk.auth.v1.createSecret({
          clientId: request.clientId,
          createSecretRequest: omit(request, ['clientId']),
        });
    }
  };

  deleteSecret = async (
    request: DeleteSecretRequest
  ): Promise<DeleteSecretRequest> => {
    switch (this.version) {
      case '1':
      case '2':
      default: {
        await this.sdk.auth.v1.deleteSecret(request);

        return request;
      }
    }
  };
}
