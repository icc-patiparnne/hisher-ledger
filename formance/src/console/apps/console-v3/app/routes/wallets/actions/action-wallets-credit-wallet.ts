import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { Subject } from '@platform/sdks/formance/src/models/components';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { creditWalletSchema } from '../components/wallet-actions-credit-wallet';
import { WALLETS_ACTION_CREDIT_WALLET } from '../constants';

export type ActionDataType =
  | ActionType<typeof WALLETS_ACTION_CREDIT_WALLET, { walletId: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WALLETS_ACTION_CREDIT_WALLET) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const creditWalletData = creditWalletSchema.parse(values);

      if (!creditWalletData) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form data',
        };
      }

      const sources = creditWalletData.source?.identifier
        ? [
            {
              type: creditWalletData.source.type,
              identifier: creditWalletData.source.identifier,
            },
          ]
        : null;

      try {
        await api.wallets.creditWallet({
          id: creditWalletData.id,
          creditWalletRequest: {
            amount: {
              amount: BigInt(creditWalletData.amount),
              asset: creditWalletData.asset,
            },
            metadata: creditWalletData.metadata || {},
            reference: creditWalletData.reference,
            balance: creditWalletData.balance,
            sources: sources as Subject[],
            timestamp: creditWalletData.timestamp,
          },
        });

        return {
          formAction: WALLETS_ACTION_CREDIT_WALLET,
          message: `Wallet ${creditWalletData.id} credited successfully!`,
          data: { walletId: creditWalletData.id },
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Failed to credit wallet ${creditWalletData.id}`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  );
};
