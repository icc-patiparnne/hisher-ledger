import { serializeBigInt } from '@platform/utils';
import { Data } from '.';
import {
  NormalizedCashPoolBalancesModel,
  NormalizedCashPoolModel,
  NormalizedPaymentAccountModel,
} from '../../../../utils/sdk/payments/models';
import { NormalizedGetCashPoolWithAccountsAndBalancesRequest } from '../../../../utils/sdk/payments/requests';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';

export const v1Loader = async (
  api: NormalizedSDK,
  request: NormalizedGetCashPoolWithAccountsAndBalancesRequest
): Promise<Data> => {
  const connectorsConfig = await api.payments.listAllAvailableConnectors();
  const { cashPool, cashPoolAccounts, cashPoolBalances } =
    (await api.payments.getCashPoolWithAccountsAndBalances({
      poolId: request.poolId,
    })) as {
      cashPool: {
        data: NormalizedCashPoolModel;
      };
      cashPoolAccounts: {
        data: NormalizedPaymentAccountModel[];
      };
      cashPoolBalances: {
        data: NormalizedCashPoolBalancesModel;
      };
    };

  if (cashPoolBalances && 'data' in cashPoolBalances) {
    return {
      cashPool,
      connectorsConfig,
      cashPoolAccounts,
      cashPoolBalances: {
        data: serializeBigInt(
          cashPoolBalances?.data || []
        ) as NormalizedCashPoolBalancesModel,
      },
    };
  }

  return {
    cashPool,
    cashPoolAccounts,
    cashPoolBalances: { data: [] },
    connectorsConfig,
  };
};
