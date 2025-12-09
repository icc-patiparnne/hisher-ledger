import { serializeBigInt } from '@platform/utils';
import { NormalizedBankAccountModel } from '../../../../utils/sdk/payments/models';
import { NormalizedGetBankAccountRequest } from '../../../../utils/sdk/payments/requests';
import { NormalizedListAllAvailableConnectorsResponse } from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';

export type Data = {
  bankAccount: NormalizedBankAccountModel | undefined;
  connectorsConfig: NormalizedListAllAvailableConnectorsResponse | undefined;
};

export const bankAccountLoader = async (
  api: NormalizedSDK,
  request: NormalizedGetBankAccountRequest
): Promise<Data> => {
  const connectorsConfig = await api.payments.listAllAvailableConnectors();

  const bankAccount = await api.payments.getBankAccount(request);

  return {
    bankAccount: serializeBigInt(bankAccount),
    connectorsConfig,
  };
};
