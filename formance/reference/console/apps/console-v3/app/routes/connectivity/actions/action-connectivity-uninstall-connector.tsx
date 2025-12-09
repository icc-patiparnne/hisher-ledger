import { ActionFunction, useNavigate } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { uninstallConnectorSchema } from '../connectors/components/uninstall-connector';
import { CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR } from '../constants';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import React, { useEffect } from 'react';
import { ROUTES } from '../../../utils/routes';
import { Loader2 } from 'lucide-react';

export type ActionDataType =
  | ActionType<typeof CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR, void>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const form = await request.formData();
  const values = {
    formAction: form.get('formAction'),
    connector: form.get('connector'),
    connectorId: form.get('connectorId'),
  };
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const parsedData = uninstallConnectorSchema.parse(values);

      try {
        await api.payments.uninstallConnector({
          connectorID: parsedData.connectorId,
          connector: parsedData.connector,
        });

        return {
          formAction: CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR,
          message: `Connector ${parsedData.connectorId} is being uninstalled.`,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Connector ${parsedData.connectorId} could not be uninstalled.`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  );
};

export default function UninstallConnectorAction() {
  const navigate = useNavigate();
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'uninstall-connector',
  });

  useEffect(() => {
    navigate(
      ROUTES({ organizationId, stackId, region })['CONNECTIVITY_CONNECTORS_ALL']
        .to
    );
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[50%] mx-auto">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    </div>
  );
}
