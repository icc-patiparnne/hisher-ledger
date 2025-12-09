import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  walletId: string
): Promise<Data> => {
  const wallet = await api.wallets.getWallet({ id: walletId });
  const walletSummary = await api.wallets.getWalletSummary({ id: walletId });

  return {
    wallet: serializeBigInt(wallet),
    walletSummary: serializeBigInt(walletSummary),
  };
};
