import { getPaginatedAndFilteredList } from '@platform/remix';
import { V3ListPaymentInitiationsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { CONNECTIVITY_TRANSFER_INITIATIONS_LIST } from '../../constants';
import { Data } from './index';

export const v3Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const paymentTransfers = await getPaginatedAndFilteredList(
    (config: V3ListPaymentInitiationsRequest) => {
      const queryMatch: [] = config && config.query ? config.query.$and : [];

      return api.payments.listTransferInitiations({
        query: {
          $and: [
            ...queryMatch,
            {
              $match: {
                type: 'TRANSFER',
              },
            },
            {
              $match: {
                status: 'WAITING_FOR_VALIDATION',
              },
            },
          ],
        },
        pageSize: 50,
      });
    },
    request,
    CONNECTIVITY_TRANSFER_INITIATIONS_LIST
  );

  return {
    paymentTransfers: serializeBigInt(paymentTransfers),
  };
};
