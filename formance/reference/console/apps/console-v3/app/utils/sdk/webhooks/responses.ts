import * as components from '@platform/sdks/formance/src/models/components';
import { WebhooksConfig } from '@platform/sdks/formance/src/models/components';

import { Cursor } from '@platform/sdks/utils/cursor';
import { NormalizedWebhookModel } from './models';

export type NormalizedListWebhooksResponse =
  | components.WebhooksErrorResponse
  | {
      cursor: Cursor<NormalizedWebhookModel>;
    };

export type NormalizedGetWebhookResponse =
  | { data: NormalizedWebhookModel | undefined }
  | components.WebhooksErrorResponse;

export type NormalizedCreateWebhookResponse =
  | components.ConfigResponse
  | components.WebhooksErrorResponse;

export type NormalizedDeleteWebhookResponse =
  | undefined
  | components.WebhooksErrorResponse;
export type NormalizedRenewSecretWebhookResponse =
  | { data: WebhooksConfig }
  | components.WebhooksErrorResponse;

export type NormalizedSetStatusWebhookResponse =
  | { data: WebhooksConfig }
  | components.WebhooksErrorResponse;
