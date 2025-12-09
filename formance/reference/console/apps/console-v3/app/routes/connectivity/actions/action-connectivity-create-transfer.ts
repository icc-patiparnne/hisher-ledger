import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS, serializeBigInt } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedCreateTransferInitiationRequest } from '../../../utils/sdk/payments/requests';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { CONNECTIVITY_ACTION_CREATE_TRANSFER } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof CONNECTIVITY_ACTION_CREATE_TRANSFER,
      NormalizedCreateTransferInitiationRequest
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
      if (values.formAction !== CONNECTIVITY_ACTION_CREATE_TRANSFER) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      try {
        const createTransferValues =
          values as NormalizedCreateTransferInitiationRequest;

        const response = await api.payments.createTransferInitiation({
          ...createTransferValues,
          scheduledAt: new Date(createTransferValues.scheduledAt),
          amount: BigInt(createTransferValues.amount),
        });

        return {
          formAction: CONNECTIVITY_ACTION_CREATE_TRANSFER,
          data: serializeBigInt(response),
          message: 'Transfer initiated successfully!',
        };
      } catch (e: any) {
        logError(e);

        const message = e.body
          ? JSON.parse(e.body).errorMessage
          : 'Transfer could not be created';

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
