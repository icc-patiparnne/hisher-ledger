import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListTriggersRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { TRIGGERS_LIST } from '../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const triggers = await getPaginatedAndFilteredList(
    (config: V2ListTriggersRequest) => api.flows.listTriggers(config),
    request,
    TRIGGERS_LIST
  );

  return {
    triggers,
  };
};
