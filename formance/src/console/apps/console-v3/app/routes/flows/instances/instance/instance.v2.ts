import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  instanceId: string
): Promise<Data> => {
  const instance = await api.flows.getInstance({
    instanceID: instanceId,
  });

  return {
    instance,
  };
};
