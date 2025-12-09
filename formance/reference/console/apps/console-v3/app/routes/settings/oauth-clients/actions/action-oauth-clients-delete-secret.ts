import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { DeleteSecretRequest } from '@platform/sdks/formance/src/models/operations';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { deleteOAuthSecretSchema } from '../components/delete-oauth-secret';
import { OAUTH_CLIENTS_ACTION_DELETE_SECRET } from '../constants';

export type ActionDataType =
  | ActionType<typeof OAUTH_CLIENTS_ACTION_DELETE_SECRET, DeleteSecretRequest>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== OAUTH_CLIENTS_ACTION_DELETE_SECRET) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = deleteOAuthSecretSchema.parse(values);

      try {
        const deletedSecret = await api.auth.deleteSecret({
          clientId: parsedData.clientId,
          secretId: parsedData.secretId,
        });

        return {
          formAction: OAUTH_CLIENTS_ACTION_DELETE_SECRET,
          message: 'OAuth client secret deleted!',
          data: deletedSecret,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `OAuth client secret ${parsedData.secretId} could not be deleted`,
        };
      }
    },
    authenticator,
    request
  );
};
