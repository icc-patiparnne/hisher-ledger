import { getPaginatedAndFilteredList } from '@platform/remix';
import { V3ListPaymentsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { CONNECTIVITY_PAYMENTS_LIST } from '../constants';
import { Data } from './index';

export const v3Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const payments = await getPaginatedAndFilteredList(
    (config: V3ListPaymentsRequest) => api.payments.listPayments(config),
    request,
    CONNECTIVITY_PAYMENTS_LIST
  );

  return {
    payments: serializeBigInt(payments),
  };
};
