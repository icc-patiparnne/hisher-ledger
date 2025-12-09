import { ActionFunction } from 'react-router';

import { logError } from '@platform/logger/helper';
import { ActionDataError, ActionType, FORM_ERROR } from '@platform/remix';
import { MODULES_GATEWAYS } from '@platform/utils';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext, WithContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import { WALLETS_ACTION_CREATE_WALLET } from '../constants';
import { createWalletSchema } from '../create';

export type ActionDataType =
  | ActionType<typeof WALLETS_ACTION_CREATE_WALLET, { walletId: string }>
  | ActionDataError
  | WithContext;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionDataType> => {
  const values = await request.json();
  const authenticator = getAuthenticator(request);

  return await withContext(
    async (api: NormalizedSDK) => {
      if (values.formAction !== WALLETS_ACTION_CREATE_WALLET) {
        return {
          formAction: FORM_ERROR,
          message: 'Invalid form action',
        };
      }

      const createWalletData = createWalletSchema.parse(values);

      try {
        const wallet = await api.wallets.createWallet({
          createWalletRequest: {
            name: createWalletData.name,
            metadata: createWalletData.metadata
              ? JSON.parse(createWalletData.metadata)
              : {},
          },
        });
        if (wallet && 'data' in wallet) {
          return {
            formAction: WALLETS_ACTION_CREATE_WALLET,
            message: `Wallet ${wallet.data.name} created`,
            data: { walletId: wallet.data.id },
          };
        }

        return {
          formAction: FORM_ERROR,
          message: `Wallet ${createWalletData.name} could not be created`,
        };
      } catch (e) {
        logError(e);

        return {
          formAction: FORM_ERROR,
          message: `Wallet ${createWalletData.name} could not be created`,
        };
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  );
};
