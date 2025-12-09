import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListAccountsRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { LEDGER_ACCOUNTS_LIST, LEDGER_SELECTED } from '../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  const allLedgers = await api.ledger.listLedgers({ pageSize: 500 });

  // Extract selected ledger from URL parameters
  const url = new URL(request.url);
  const selectedLedger = url.searchParams.get(LEDGER_SELECTED);

  // If no ledger is selected, return empty accounts
  if (!selectedLedger) {
    return {
      allLedgers,
      ledgerAccounts: undefined,
    };
  }

  const ledgerAccounts = await getPaginatedAndFilteredList(
    (config: V2ListAccountsRequest) =>
      api.ledger.listAccounts({
        ...config,
        ledger: selectedLedger,
      }),
    request,
    LEDGER_ACCOUNTS_LIST
  );

  return {
    allLedgers,
    ledgerAccounts,
  };
};
