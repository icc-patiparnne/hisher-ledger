import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { voidHoldSchema } from '../components/wallet-holds-actions-void';
import { WALLETS_ACTION_VOID_HOLD } from '../constants';

export type ActionDataType =
  | ActionType<typeof WALLETS_ACTION_VOID_HOLD, { holdId: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WALLETS_ACTION_VOID_HOLD) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const voidHoldData = voidHoldSchema.parse(values);

      try {
        await api.wallets.voidHold({
          holdId: voidHoldData.holdId,
        });

        return {
          formAction: WALLETS_ACTION_VOID_HOLD,
          message: `Hold ${voidHoldData.holdId} voided`,
          data: {
            holdId: voidHoldData.holdId,
          },
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Hold ${voidHoldData.holdId} could not be voided`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  );
};
