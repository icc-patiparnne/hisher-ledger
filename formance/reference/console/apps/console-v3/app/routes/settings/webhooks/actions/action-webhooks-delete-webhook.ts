import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { NormalizedDeleteWebhookRequest } from '../../../../utils/sdk/webhooks/requests';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { deleteWebhookSchema } from '../components/delete-webhook';
import { WEBHOOK_ACTION_DELETE } from '../constants';

export type ActionDataType =
  | ActionType<typeof WEBHOOK_ACTION_DELETE, NormalizedDeleteWebhookRequest>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WEBHOOK_ACTION_DELETE) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = deleteWebhookSchema.parse(values);

      try {
        const deletedWebhook = await api.webhooks.deleteWebhook({
          id: parsedData.id,
        });

        return {
          formAction: WEBHOOK_ACTION_DELETE,
          message: 'Webhook deleted successfully!',
          data: deletedWebhook,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Webhook could not be deleted`,
        };
      }
    },
    authenticator,
    request
  );
};
