import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListPoolsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { CONNECTIVITY_CASH_POOLS_LIST } from '../../constants';
import { Data } from './index';

export const v3Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const cashPools = await getPaginatedAndFilteredList(
    (config: ListPoolsRequest) => api.payments.listPools(config),
    request,
    CONNECTIVITY_CASH_POOLS_LIST
  );

  return {
    cashPools,
  };
};
