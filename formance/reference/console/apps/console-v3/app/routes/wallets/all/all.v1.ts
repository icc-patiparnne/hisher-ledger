import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListWalletsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { Data } from '../all';
import { WALLETS_LIST } from '../constants';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const allWallets = await getPaginatedAndFilteredList(
    (config: ListWalletsRequest) => api.wallets.listWallets(config),
    request,
    WALLETS_LIST,
    ['name', 'metadata'] // Specify the filter parameters that the wallets API supports
  );

  return {
    allWallets: serializeBigInt(allWallets),
  };
};
