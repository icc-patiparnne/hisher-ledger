import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { Status } from '@platform/sdks/formance/src/models/components';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { CONNECTIVITY_ACTION_UPDATE_TRANSFER } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof CONNECTIVITY_ACTION_UPDATE_TRANSFER,
      { transferId: string }
    >
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== CONNECTIVITY_ACTION_UPDATE_TRANSFER) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      try {
        await api.payments.updateTransferInitiation({
          transferId: values.transferId,
          status: values.status as Status,
          updateTransferInitiationStatusRequest: {
            status: values.status as Status,
          },
        });

        return {
          formAction: CONNECTIVITY_ACTION_UPDATE_TRANSFER,
          data: { transferId: values.transferId },
          message: `Transfer ${values.transferId} status updated!`,
        };
      } catch (e: any) {
        logError(e);

        const message = e.body
          ? JSON.parse(e.body).errorMessage
          : 'Transfer status could not be updated';

        return {
          formAction: FORM_ERROR,
          message,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.PAYMENTS],
    FEATURES.payments
  );
};
