import { getPaginatedAndFilteredList } from '@platform/remix';
import { ListAccountsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { LEDGER_ACCOUNTS_LIST, LEDGER_SELECTED } from '../constants';
import { Data } from './index';

export const v1Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const allLedgers = await api.ledger.listLedgers({});

  // Extract selected ledger from URL parameters
  const url = new URL(request.url);
  const selectedLedger = url.searchParams.get(LEDGER_SELECTED);

  const ledgerAccounts = await getPaginatedAndFilteredList(
    (config: ListAccountsRequest) =>
      api.ledger.listAccounts({
        ...config,
        ...(selectedLedger && { ledger: selectedLedger }),
      }),
    request,
    LEDGER_ACCOUNTS_LIST
  );

  return {
    allLedgers,
    ledgerAccounts,
  };
};
