import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { NormalizedWebhookModel } from '../../../../utils/sdk/webhooks/models';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { setStatusWebhookSchema } from '../components/set-status-webhook';
import { WEBHOOK_ACTION_SET_STATUS } from '../constants';

export type ActionDataType =
  | ActionType<typeof WEBHOOK_ACTION_SET_STATUS, NormalizedWebhookModel>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WEBHOOK_ACTION_SET_STATUS) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = setStatusWebhookSchema.parse(values);

      try {
        const statusUpdated = await api.webhooks.setWebhookStatus({
          id: parsedData.id,
          status: parsedData.status,
        });

        return {
          formAction: WEBHOOK_ACTION_SET_STATUS,
          message: `Webhook ${
            parsedData.status === 'activate' ? 'activated' : 'deactivated'
          } successfully!`,
          data: statusUpdated,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Webhook status could not be updated`,
        };
      }
    },
    authenticator,
    request
  );
};
