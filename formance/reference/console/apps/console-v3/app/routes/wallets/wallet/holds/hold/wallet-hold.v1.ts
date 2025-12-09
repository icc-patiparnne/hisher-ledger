import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  walletId: string,
  walletHoldId: string
): Promise<Data> => {
  const wallet = await api.wallets.getWallet({ id: walletId });
  const walletSummary = await api.wallets.getWalletSummary({ id: walletId });

  const walletHold = await api.wallets.getWalletHold({
    holdID: walletHoldId,
  });

  return {
    wallet: serializeBigInt(wallet),
    walletSummary: serializeBigInt(walletSummary),
    walletHold: serializeBigInt(walletHold),
  };
};
