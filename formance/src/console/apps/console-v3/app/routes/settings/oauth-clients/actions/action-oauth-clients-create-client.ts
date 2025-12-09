import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { CreateClientResponse } from '@platform/sdks/formance/src/models/components';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { createOAuthClientSchema } from '../components/create-oauth-client';
import { OAUTH_CLIENTS_ACTION_CREATE_CLIENT } from '../constants';

export type ActionDataType =
  | ActionType<typeof OAUTH_CLIENTS_ACTION_CREATE_CLIENT, CreateClientResponse>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== OAUTH_CLIENTS_ACTION_CREATE_CLIENT) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = createOAuthClientSchema.parse(values);

      try {
        const createdClient = await api.auth.createClient({
          name: parsedData.name,
          description: parsedData.description,
          redirectUris:
            parsedData.redirectUris !== undefined
              ? [parsedData.redirectUris]
              : [],
          postLogoutRedirectUris:
            parsedData.postLogoutRedirectUris !== undefined
              ? [parsedData.postLogoutRedirectUris]
              : [],
          scopes: parsedData.scopes,
        });

        return {
          formAction: OAUTH_CLIENTS_ACTION_CREATE_CLIENT,
          message: `OAuth client ${parsedData.name} created!`,
          data: createdClient,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `OAuth client ${parsedData.name} could not be created`,
        };
      }
    },
    authenticator,
    request
  );
};
