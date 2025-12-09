import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { Subject } from '@platform/sdks/formance/src/models/components';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { debitWalletSchema } from '../components/wallet-actions-debit-wallet';
import { WALLETS_ACTION_DEBIT_WALLET } from '../constants';

export type ActionDataType =
  | ActionType<typeof WALLETS_ACTION_DEBIT_WALLET, { walletId: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WALLETS_ACTION_DEBIT_WALLET) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const debitWalletData = debitWalletSchema.parse(values);

      if (!debitWalletData) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form data',
        };
      }

      const debitsToCurrentWallet =
        debitWalletData.destination?.type === 'CURRENT_WALLET';

      const destination = debitsToCurrentWallet
        ? undefined
        : (debitWalletData.destination as Subject);

      try {
        await api.wallets.debitWallet({
          id: debitWalletData.id,
          debitWalletRequest: {
            amount: {
              asset: debitWalletData.asset,
              amount: BigInt(debitWalletData.amount),
            },
            balances: [debitWalletData.selectedBalance || ''],
            pending: debitWalletData.pending,
            metadata: debitWalletData.metadata,
            description: debitWalletData.description,
            destination,
            timestamp: debitWalletData.timestamp,
          },
        });

        return {
          formAction: WALLETS_ACTION_DEBIT_WALLET,
          message: `Wallet ${debitWalletData.destination?.identifier} debited`,
          data: { walletId: debitWalletData.destination?.identifier },
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Wallet ${debitWalletData.destination?.identifier} could not be debited`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  );
};
