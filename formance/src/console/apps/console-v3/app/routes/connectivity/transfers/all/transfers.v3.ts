import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListTransferInitiationsRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { CONNECTIVITY_TRANSFER_INITIATIONS_LIST } from '../../constants';
import { Data } from './index';

export const v3Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const paymentTransfers = await getPaginatedAndFilteredList(
    (config: ListTransferInitiationsRequest) =>
      api.payments.listTransferInitiations(config),
    request,
    CONNECTIVITY_TRANSFER_INITIATIONS_LIST
  );

  return {
    paymentTransfers: serializeBigInt(paymentTransfers),
  };
};
