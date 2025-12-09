import { getPaginatedAndFilteredList } from '@platform/remix';
import { Connector } from '@platform/sdks/formance/src/models/components';
import { ListConnectorTasksV1Request } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { CONNECTIVITY_CONNECTORS_TASKS_LIST } from '../../../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request,
  connectorId: string,
  provider: string
): Promise<Data> => {
  const connector = await api.payments.getConnector({
    connector: provider,
    connectorId,
  });

  const tasks = await getPaginatedAndFilteredList(
    (config: ListConnectorTasksV1Request) =>
      api.payments.getConnectorTasks({
        ...config,
        connector: provider as Connector,
        connectorId,
      }),
    request,
    CONNECTIVITY_CONNECTORS_TASKS_LIST
  );

  return { connector, tasks };
};
