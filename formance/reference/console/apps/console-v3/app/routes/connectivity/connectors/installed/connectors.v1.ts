import { getPaginatedAndFilteredList } from '@platform/remix';
import { V3ListConnectorsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { CONNECTIVITY_CONNECTORS_LIST } from '../../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const connectorsConfig = await api.payments.listAllAvailableConnectors();

  const connectors = await getPaginatedAndFilteredList(
    (config: V3ListConnectorsRequest) => api.payments.listConnectors(config),
    request,
    CONNECTIVITY_CONNECTORS_LIST,
    []
  );

  return { connectors, connectorsConfig, serverSide: false };
};
