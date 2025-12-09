import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListBankAccountsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { CONNECTIVITY_BANK_ACCOUNTS_LIST } from '../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const paymentBankAccounts = await getPaginatedAndFilteredList(
    (config: ListBankAccountsRequest) => api.payments.listBankAccounts(config),
    request,
    CONNECTIVITY_BANK_ACCOUNTS_LIST,
    []
  );

  return {
    paymentBankAccounts,
  };
};
