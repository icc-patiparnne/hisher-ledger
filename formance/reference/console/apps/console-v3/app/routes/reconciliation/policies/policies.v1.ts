import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListPoliciesRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { POLICIES_LIST } from '../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const policies = await getPaginatedAndFilteredList(
    (config: ListPoliciesRequest) => api.reconciliation.listPolicies(config),
    request,
    POLICIES_LIST
  );

  return {
    policies: serializeBigInt(policies),
  };
};
