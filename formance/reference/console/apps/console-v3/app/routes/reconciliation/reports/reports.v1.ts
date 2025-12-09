import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListReconciliationsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { REPORTS_LIST } from '../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const reports = await getPaginatedAndFilteredList(
    (config: ListReconciliationsRequest) =>
      api.reconciliation.listReconciliations(config),
    request,
    REPORTS_LIST
  );

  return {
    reports: serializeBigInt(reports),
  };
};
