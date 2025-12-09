import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { Data } from './index';

export const v3Loader = async (
  api: NormalizedSDK,
  accountId: string
): Promise<Data> => {
  const paymentsAccount = await api.payments.getPaymentAccount({ accountId });

  const paymentsAccountPools = await api.payments.getPaymentAccountCashPools({
    accountId,
  });

  const paymentsAccountBalances = await api.payments.getPaymentAccountBalances({
    accountId,
  });

  return {
    paymentsAccount,
    paymentsAccountPools: serializeBigInt(paymentsAccountPools),
    paymentsAccountBalances: serializeBigInt(paymentsAccountBalances),
  };
};
