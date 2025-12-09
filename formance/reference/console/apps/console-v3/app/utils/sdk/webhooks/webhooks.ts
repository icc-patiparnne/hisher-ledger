import { SDK } from '@platform/sdks/formance/src/sdk';
import { RequestOptions } from '@platform/sdks/formance/src/lib/sdks';
import httpRequest from '@platform/http/request';

import { NormalizedSDK } from '../sdk';
import {
  NormalizedCreateWebhookResponse,
  NormalizedDeleteWebhookResponse,
  NormalizedGetWebhookResponse,
  NormalizedListWebhooksResponse,
  NormalizedRenewSecretWebhookResponse,
  NormalizedSetStatusWebhookResponse,
} from './responses';
import {
  NormalizedCreateWebhookRequest,
  NormalizedDeleteWebhookRequest,
  NormalizedGetWebhookRequest,
  NormalizedListWebhooksRequest,
  NormalizedRenewSecretWebhookRequest,
  NormalizedSetStatusWebhookRequest,
} from './requests';
import { first, get } from 'lodash-es';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'node:fs';
import { getServiceVersion } from '../../session.gateway.server';
import { debugLogger, logError } from '@platform/logger/helper';

export class NormalizedWebhooks {
  sdk: SDK;
  normalizedSDK: NormalizedSDK;
  version: string;

  constructor(sdk: SDK, version: string, normalizedSDK: NormalizedSDK) {
    this.normalizedSDK = normalizedSDK;
    this.version = version;
    this.sdk = sdk;
  }

  async listEventTypes(): Promise<[] | string[]> {
    const gateway = await this.sdk.getVersions();

    const getEventsRawConfig = () =>
      httpRequest<{ [a: string]: any }>(
        {
          url: 'https://raw.githubusercontent.com/formancehq/stack/main/libs/events/generated/all.json',
        },
        undefined,
        undefined,
        undefined,
        'listEventTypes'
      ).catch(() => undefined);
    const events: string[] = [];

    try {
      let eventsRawConfig = undefined;
      if (
        typeof process !== 'undefined' &&
        process.env.NODE_ENV === 'production'
      ) {
        try {
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const file = path.join(__dirname, '/../../../../../../', 'all.json');
          debugLogger(process.env.DEBUG!, 'listEventTypes', 'file', file);
          const jsonString = fs.readFileSync(file);
          eventsRawConfig = JSON.parse(jsonString as unknown as string);
        } catch (e) {
          logError(e);
          eventsRawConfig = await getEventsRawConfig();
        }
      } else {
        eventsRawConfig = await getEventsRawConfig();
      }

      if (eventsRawConfig) {
        Object.keys(eventsRawConfig).forEach((service) => {
          const gatewayService =
            gateway &&
            gateway.versions.find((version) => version.name === service);

          if (gatewayService) {
            const serviceObject = get(eventsRawConfig, gatewayService?.name);
            const version = `v${getServiceVersion(gatewayService)}.0.0`;
            const serviceEvents = serviceObject[version];
            if (serviceEvents) {
              Object.keys(serviceEvents).forEach((event) => {
                events.push(`${service}.${event.toLocaleLowerCase()}`);
              });
            }
          }
        });
      }
    } catch (error) {
      logError(error);
    }

    return events;
  }

  async listWebhooks(
    request?: NormalizedListWebhooksRequest,
    options?: RequestOptions
  ): Promise<NormalizedListWebhooksResponse> {
    switch (this.version) {
      case '1':
      default: {
        const webhooks = await this.sdk.webhooks.v1.getManyConfigs(
          request ? request : {},
          options
        );

        if (webhooks && 'cursor' in webhooks) {
          return { cursor: { ...webhooks.cursor, pageSize: 0 } };
        }

        return this.normalizedSDK.mockCursor([]);
      }
    }
  }

  async getWebhook(
    request: NormalizedGetWebhookRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWebhookResponse> {
    switch (this.version) {
      case '1':
      default: {
        const webhooks = await this.sdk.webhooks.v1.getManyConfigs(
          request,
          options
        );
        if (webhooks && 'cursor' in webhooks) {
          const webhook = first(webhooks.cursor.data);
          if (webhook) {
            return { data: webhook };
          }

          return { data: undefined };
        }

        return { data: undefined };
      }
    }
  }

  async createWebhook(
    request: NormalizedCreateWebhookRequest,
    options?: RequestOptions
  ): Promise<NormalizedCreateWebhookResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.webhooks.v1.insertConfig(request, options);
      }
    }
  }

  async deleteWebhook(
    request: NormalizedDeleteWebhookRequest,
    options?: RequestOptions
  ): Promise<NormalizedDeleteWebhookResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.webhooks.v1.deleteConfig(request, options);
      }
    }
  }

  async renewWebhookSecret(
    request: NormalizedRenewSecretWebhookRequest,
    options?: RequestOptions
  ): Promise<NormalizedRenewSecretWebhookResponse> {
    switch (this.version) {
      case '1':
      default: {
        return this.sdk.webhooks.v1.changeConfigSecret(request, options);
      }
    }
  }

  async setWebhookStatus(
    request: NormalizedSetStatusWebhookRequest,
    options?: RequestOptions
  ): Promise<NormalizedSetStatusWebhookResponse> {
    switch (this.version) {
      case '1':
      default: {
        if (request.status === 'deactivate') {
          return this.sdk.webhooks.v1.deactivateConfig(request, options);
        }

        return this.sdk.webhooks.v1.activateConfig(request, options);
      }
    }
  }
}
