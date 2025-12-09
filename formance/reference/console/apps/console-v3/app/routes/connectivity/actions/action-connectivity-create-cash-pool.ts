import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { ActionFunction } from 'react-router';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedCreateCashPoolRequest } from '../../../utils/sdk/payments/requests';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { CONNECTIVITY_ACTION_CREATE_CASH_POOL } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof CONNECTIVITY_ACTION_CREATE_CASH_POOL,
      NormalizedCreateCashPoolRequest
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
      if (values.formAction !== CONNECTIVITY_ACTION_CREATE_CASH_POOL) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      try {
        const createCashPoolValues = values as NormalizedCreateCashPoolRequest;

        const response = await api.payments.createCashPool(
          createCashPoolValues
        );

        return {
          formAction: CONNECTIVITY_ACTION_CREATE_CASH_POOL,
          data: response,
          message: 'Cash pool creation initiated successfully!',
        };
      } catch (e: any) {
        logError(e);

        const message = e.body
          ? JSON.parse(e.body).errorMessage
          : 'Cash pool could not be created';

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
