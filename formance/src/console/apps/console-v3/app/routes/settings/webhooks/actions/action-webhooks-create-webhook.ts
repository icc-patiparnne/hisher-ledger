import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { NormalizedCreateWebhookResponse } from '../../../../utils/sdk/webhooks/responses';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { WEBHOOK_ACTION_CREATE_WEBHOOK } from '../constants';
import { createWebhookSchema } from '../create';

export type ActionDataType =
  | ActionType<
      typeof WEBHOOK_ACTION_CREATE_WEBHOOK,
      NormalizedCreateWebhookResponse
    >
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WEBHOOK_ACTION_CREATE_WEBHOOK) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = createWebhookSchema.parse(values);

      try {
        if (!parsedData.eventTypes) {
          return {
            formAction: FORM_ERROR,
            message: 'Webhook events type is undefined',
          };
        }

        const createdWebhook = await api.webhooks.createWebhook({
          endpoint: parsedData.endpoint,
          eventTypes: parsedData.eventTypes,
        });

        return {
          formAction: WEBHOOK_ACTION_CREATE_WEBHOOK,
          message: `Webhook ${parsedData.endpoint} created!`,
          data: createdWebhook,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Webhook ${parsedData.endpoint} could not be created`,
        };
      }
    },
    authenticator,
    request
  );
};
