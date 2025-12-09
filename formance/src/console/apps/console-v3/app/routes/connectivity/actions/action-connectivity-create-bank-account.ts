import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { ActionFunction } from 'react-router';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedCreateBankAccountRequest } from '../../../utils/sdk/payments/requests';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT,
      NormalizedCreateBankAccountRequest
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
      if (values.formAction !== CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      try {
        const createBankAccountValues =
          values as NormalizedCreateBankAccountRequest;

        const response = await api.payments.createBankAccount(
          createBankAccountValues
        );

        return {
          formAction: CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT,
          data: response,
          message: 'Bank account created successfully!',
        };
      } catch (e: any) {
        logError(e);

        let message = 'Bank account could not be created';

        try {
          if (e.body) {
            const errorBody = JSON.parse(e.body);
            message = errorBody.errorMessage || errorBody.message || message;
          } else if (e.message) {
            message = e.message;
          }
        } catch (parseError) {
          logError(parseError);
          message = e.toString();
        }

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
