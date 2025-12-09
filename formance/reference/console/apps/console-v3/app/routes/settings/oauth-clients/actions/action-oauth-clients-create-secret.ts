import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { CreateSecretResponse } from '@platform/sdks/formance/src/models/components';
import { withContext, WithContext } from '../../../../utils/auth.server';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import { createOAuthClientSecretSchema } from '../components/create-oauth-secret';
import { OAUTH_CLIENTS_ACTION_CREATE_SECRET } from '../constants';

export type ActionDataType =
  | ActionType<typeof OAUTH_CLIENTS_ACTION_CREATE_SECRET, CreateSecretResponse>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== OAUTH_CLIENTS_ACTION_CREATE_SECRET) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = createOAuthClientSecretSchema.parse(values);

      try {
        const createdSecret = await api.auth.createSecret({
          name: parsedData.name,
          clientId: parsedData.clientId,
        });

        return {
          formAction: OAUTH_CLIENTS_ACTION_CREATE_SECRET,
          message: `OAuth client secret ${parsedData.name} created!`,
          data: createdSecret,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `OAuth client secret ${parsedData.name} could not be created`,
        };
      }
    },
    authenticator,
    request
  );
};
