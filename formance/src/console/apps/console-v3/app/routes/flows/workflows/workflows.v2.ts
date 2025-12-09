import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListWorkflowsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { WORKFLOWS_LIST } from '../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const workflows = await getPaginatedAndFilteredList(
    (config: V2ListWorkflowsRequest) => api.flows.listWorkflows(config),
    request,
    WORKFLOWS_LIST
  );

  return {
    workflows,
  };
};
