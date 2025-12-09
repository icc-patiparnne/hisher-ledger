import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { confirmHoldSchema } from '../components/wallet-holds-actions-confirm';
import { WALLETS_ACTION_CONFIRM_HOLD } from '../constants';

export type ActionDataType =
  | ActionType<
      typeof WALLETS_ACTION_CONFIRM_HOLD,
      {
        holdId: string;
        amount?: number;
        final: boolean;
      }
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
      if (values.formAction !== WALLETS_ACTION_CONFIRM_HOLD) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const confirmHoldData = confirmHoldSchema.parse(values);

      try {
        await api.wallets.confirmHold({
          holdId: confirmHoldData.holdId,
          confirmHoldRequest: {
            ...(confirmHoldData.amount && {
              amount: BigInt(confirmHoldData.amount),
            }),
            final: confirmHoldData.final,
          },
        });

        const amountMessage = confirmHoldData.amount
          ? ` for ${confirmHoldData.amount}`
          : ' for full amount';

        const finalMessage = confirmHoldData.final
          ? ' and remaining funds returned to origin'
          : ' with remaining funds kept in hold';

        return {
          formAction: WALLETS_ACTION_CONFIRM_HOLD,
          message: `Hold ${confirmHoldData.holdId} confirmed${amountMessage}${finalMessage}`,
          data: {
            holdId: confirmHoldData.holdId,
            amount: confirmHoldData.amount,
            final: confirmHoldData.final,
          },
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Hold ${confirmHoldData.holdId} could not be confirmed`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  );
};
