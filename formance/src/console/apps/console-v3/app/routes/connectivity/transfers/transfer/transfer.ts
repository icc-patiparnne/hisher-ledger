import { serializeBigInt } from '@platform/utils';
import { Data } from '.';
import { NormalizedGetTransferRequest } from '../../../../utils/sdk/payments/requests';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';

export const transferLoader = async (
  api: NormalizedSDK,
  request: NormalizedGetTransferRequest
): Promise<Data> => {
  const transfer = await api.payments.getTransferInitiation(request);

  return {
    transfer: serializeBigInt(transfer),
  };
};
