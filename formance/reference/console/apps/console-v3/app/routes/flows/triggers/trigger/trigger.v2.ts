import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListTriggersOccurrencesRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { TRIGGERS_LIST } from '../../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request,
  triggerId: string
): Promise<Data> => {
  const trigger = await api.flows.getTrigger({
    triggerID: triggerId,
  });

  const occurrences = await getPaginatedAndFilteredList(
    (config: V2ListTriggersOccurrencesRequest) =>
      api.flows.listTriggerOccurrences({ ...config, triggerID: triggerId }),
    request,
    TRIGGERS_LIST
  );

  return {
    trigger,
    occurrences,
  };
};
