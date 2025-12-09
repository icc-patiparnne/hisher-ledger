import { NormalizedSDK } from '../../../../../../utils/sdk/sdk';

import { Connector } from '@platform/sdks/formance/src/models/components';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  connectorId: string,
  taskId: string,
  provider: string
): Promise<Data> => {
  const connector = await api.payments.getConnector({
    connector: provider,
    connectorId,
  });

  const task = await api.payments.getConnectorTask({
    connector: provider as Connector,
    connectorId,
    taskId,
    scheduleId: taskId,
  });

  const instances = await api.payments.getConnectorTaskInstances({
    connectorId,
    scheduleId: task.data.id,
  });

  return { connector, task, instances };
};
