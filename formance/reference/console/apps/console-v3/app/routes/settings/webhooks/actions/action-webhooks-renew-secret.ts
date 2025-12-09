import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { renewSecretWebhookSchema } from '../components/renew-secret-webhook';
import { WEBHOOK_ACTION_RENEW_SECRET } from '../constants';

export type ActionDataType =
  | ActionType<typeof WEBHOOK_ACTION_RENEW_SECRET, { secret: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WEBHOOK_ACTION_RENEW_SECRET) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = renewSecretWebhookSchema.parse(values);

      try {
        const renewedSecret = await api.webhooks.renewWebhookSecret({
          id: parsedData.id,
        });

        return {
          formAction: WEBHOOK_ACTION_RENEW_SECRET,
          message: 'Webhook secret renewed successfully!',
          data: renewedSecret,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Webhook secret could not be renewed`,
        };
      }
    },
    authenticator,
    request
  );
};
