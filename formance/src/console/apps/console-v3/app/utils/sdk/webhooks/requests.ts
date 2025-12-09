import {
  ChangeConfigSecretRequest,
  DeleteConfigRequest,
  GetManyConfigsRequest,
} from '@platform/sdks/formance/src/models/operations';
import * as components from '@platform/sdks/formance/src/models/components';

export type NormalizedListWebhooksRequest = GetManyConfigsRequest;

export type NormalizedGetWebhookRequest = GetManyConfigsRequest;

export type NormalizedDeleteWebhookRequest = DeleteConfigRequest;
export type NormalizedCreateWebhookRequest = components.ConfigUser;
export type NormalizedRenewSecretWebhookRequest = ChangeConfigSecretRequest;
export type NormalizedSetStatusWebhookRequest = {
  id: string;
  status: 'deactivate' | 'activate';
};
