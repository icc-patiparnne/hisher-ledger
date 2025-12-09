import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import * as components from '@platform/sdks/formance/src/models/components';
import { CreateClientResponse } from '@platform/sdks/formance/src/models/components';
import {
  lowerCaseAllWordsExceptFirstLetter,
  MODULES_GATEWAYS,
} from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { getServiceVersionFromContext } from '../../../utils/session.gateway.server';
import { installConnectorSchema } from '../connectors/install/[slug]';
import { CONNECTIVITY_ACTION_INSTALL_CONNECTOR } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof CONNECTIVITY_ACTION_INSTALL_CONNECTOR,
      CreateClientResponse
    >
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.PAYMENTS
      );

      if (values.formAction !== CONNECTIVITY_ACTION_INSTALL_CONNECTOR) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const schema = installConnectorSchema(version);
      const parsedData = schema.parse(values);

      try {
        const installedConnector = await api.payments.installConnector({
          connector: parsedData.provider,
          config: parsedData.config as
            | components.ConnectorConfig
            | components.V3InstallConnectorRequest,
        });

        if (installedConnector && 'data' in installedConnector) {
          return {
            formAction: CONNECTIVITY_ACTION_INSTALL_CONNECTOR,
            message: `Connector ${lowerCaseAllWordsExceptFirstLetter(
              parsedData.provider
            )} installed`,
            data: {
              ...installedConnector.data,
              provider: parsedData.provider,
            },
          };
        }

        return {
          formAction: FORM_ERROR,
          message: `Connector ${lowerCaseAllWordsExceptFirstLetter(
            parsedData.provider
          )} could not be installed`,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Connector ${lowerCaseAllWordsExceptFirstLetter(
            parsedData.provider
          )} could not be installed`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  );
};
