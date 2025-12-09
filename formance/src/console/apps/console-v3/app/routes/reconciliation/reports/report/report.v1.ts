import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  reportId: string
): Promise<Data> => {
  const report = await api.reconciliation.getReconciliation({
    reconciliationID: reportId,
  });

  return {
    report: serializeBigInt(report),
  };
};
