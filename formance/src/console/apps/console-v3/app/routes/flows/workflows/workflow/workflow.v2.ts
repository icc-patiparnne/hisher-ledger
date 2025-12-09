import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListInstancesRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { INSTANCES_LIST } from '../../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request,
  workflowId: string
): Promise<Data> => {
  const workflow = await api.flows.getWorkflow({
    flowId: workflowId,
  });

  const instances = await getPaginatedAndFilteredList(
    (config: V2ListInstancesRequest) =>
      api.flows.listInstances({ ...config, workflowID: workflowId }),
    request,
    INSTANCES_LIST
  );

  return {
    workflow,
    instances,
  };
};
