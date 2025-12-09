import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { CreateClientResponse } from '@platform/sdks/formance/src/models/components';
import {
  lowerCaseAllWordsExceptFirstLetter,
  MODULES_GATEWAYS,
} from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { resetConnectorSchema } from '../connectors/components/reset-connector';
import { CONNECTIVITY_ACTION_RESET_CONNECTOR } from '../constants';

export type ActionDataType =
  | ActionType<typeof CONNECTIVITY_ACTION_RESET_CONNECTOR, CreateClientResponse>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== CONNECTIVITY_ACTION_RESET_CONNECTOR) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = resetConnectorSchema.parse(values);

      try {
        const resetConnector = await api.payments.resetConnector({
          connectorId: parsedData.connectorId,
          connector: parsedData.connector,
        });

        return {
          formAction: CONNECTIVITY_ACTION_RESET_CONNECTOR,
          message: `Connector ${lowerCaseAllWordsExceptFirstLetter(
            parsedData.connector
          )} reset`,
          data: resetConnector,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Connector ${lowerCaseAllWordsExceptFirstLetter(
            parsedData.connector
          )} could not be reset`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  );
};
