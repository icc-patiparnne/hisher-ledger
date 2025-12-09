import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { DeleteClientRequest } from '@platform/sdks/formance/src/models/operations';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { deleteOAuthClientSchema } from '../components/delete-oauth-client';
import { OAUTH_CLIENTS_ACTION_DELETE_CLIENT } from '../constants';

export type ActionDataType =
  | ActionType<typeof OAUTH_CLIENTS_ACTION_DELETE_CLIENT, DeleteClientRequest>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== OAUTH_CLIENTS_ACTION_DELETE_CLIENT) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = deleteOAuthClientSchema.parse(values);

      try {
        const deletedClient = await api.auth.deleteClient({
          clientId: parsedData.id,
        });

        return {
          formAction: OAUTH_CLIENTS_ACTION_DELETE_CLIENT,
          message: 'OAuth client deleted!',
          data: deletedClient,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `OAuth client ${parsedData.id} could not be deleted`,
        };
      }
    },
    authenticator,
    request
  );
};
