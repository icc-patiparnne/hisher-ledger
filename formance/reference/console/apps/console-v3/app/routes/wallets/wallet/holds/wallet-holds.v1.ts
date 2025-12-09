import { getPaginatedAndFilteredList } from '@platform/remix';
import { GetWalletRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { WALLETS_HOLDS_LIST } from '../../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request,
  walletId: string
): Promise<Data> => {
  const wallet = await api.wallets.getWallet({ id: walletId });
  const walletSummary = await api.wallets.getWalletSummary({ id: walletId });

  const walletHolds = await getPaginatedAndFilteredList(
    (config: GetWalletRequest) =>
      api.wallets.getWalletHolds({ ...config, walletID: walletId }),
    request,
    WALLETS_HOLDS_LIST
  );

  return {
    wallet: serializeBigInt(wallet),
    walletSummary: serializeBigInt(walletSummary),
    walletHolds: serializeBigInt(walletHolds),
  };
};
