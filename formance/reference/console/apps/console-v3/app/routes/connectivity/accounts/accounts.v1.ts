import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListAccountsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { CONNECTIVITY_ACCOUNTS_LIST } from '../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const connectorsConfig = await api.payments.listAllAvailableConnectors();

  const paymentsAccounts = await getPaginatedAndFilteredList(
    (config: ListAccountsRequest) => api.payments.getPaymentAccounts(config),
    request,
    CONNECTIVITY_ACCOUNTS_LIST
  );

  return {
    connectorsConfig,
    paymentsAccounts,
  };
};
