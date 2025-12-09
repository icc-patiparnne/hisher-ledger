import { serializeBigInt } from '@platform/utils';

import { Data } from '.';
import { NormalizedGetPaymentRequest } from '../../../../utils/sdk/payments/requests';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';

export const paymentLoader = async (
  api: NormalizedSDK,
  request: NormalizedGetPaymentRequest
): Promise<Data> => {
  const payment = await api.payments.getPayment(request);

  return {
    payment: serializeBigInt(payment),
  };
};
